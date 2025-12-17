interface ExecutionContext {
  waitUntil(p: Promise<unknown> | void): void;
}

export interface Env {
  ASSETS: {
    fetch: (req: Request) => Promise<Response>;
  };
}

const ttlSeconds = 3600;
const cachePrefixes = ['/councillors/', '/public-consultations/'] as const;

function shouldCachePath(pathname: string): boolean {
  return cachePrefixes.some((p) => pathname.startsWith(p));
}

async function callOriginal(
  request: Request,
  _env: Env,
  _ctx: ExecutionContext,
): Promise<Response> {
  // Since we're in a Worker environment, we can use native fetch
  return fetch(request);
}

type CFCache = {
  match(req: Request): Promise<Response | undefined>;
  put(req: Request, res: Response): Promise<void>;
};

const worker = {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    if (request.method !== 'GET') {
      return callOriginal(request, env, ctx);
    }

    const url = new URL(request.url);
    if (!shouldCachePath(url.pathname)) {
      return callOriginal(request, env, ctx);
    }

    // Build a normalized cache key: strip volatile headers like Cookie/Authorization
    function makeCacheKey(req: Request) {
      const u = new URL(req.url);
      const h = new Headers(req.headers);
      h.delete('cookie');
      h.delete('authorization');
      // remove headers that should not vary the cache key
      h.delete('x-forwarded-for');
      return new Request(u.toString(), { method: 'GET', headers: h });
    }

    const cacheKey = makeCacheKey(request);
    const cfCache = (caches as unknown as { default: CFCache }).default;
    const cached = await cfCache.match(cacheKey);

    if (cached) {
      // Serve cached immediately and refresh in background
      ctx.waitUntil(
        (async () => {
          try {
            // Use the normalized cacheKey when fetching origin for background revalidation
            // so we don't forward cookies/authorization that would force Next to mark
            // the response as dynamic (`no-cache`).
            const originRes = await callOriginal(cacheKey, env, ctx);
            if (originRes && originRes.ok && originRes.status === 200) {
              const toCache = originRes.clone();
              toCache.headers.set(
                'Cache-Control',
                `public, s-maxage=${ttlSeconds}, stale-while-revalidate=60`,
              );
              await cfCache.put(cacheKey, toCache.clone());
            }
          } catch (_e) {
            // swallow background errors; nothing to do
          }
        })(),
      );

      return cached;
    }

    // Cache miss: fetch origin, store and return
    // For cache miss, fetch origin using the normalized cache key to avoid
    // forwarding volatile headers that could force no-cache responses.
    const response = await callOriginal(cacheKey, env, ctx);
    if (!response || !response.ok || response.status !== 200) return response;

    const toCache = response.clone();
    // Ensure a sensible cache header for downstream caches
    toCache.headers.set(
      'Cache-Control',
      `public, s-maxage=${ttlSeconds}, stale-while-revalidate=60`,
    );
    ctx.waitUntil(cfCache.put(cacheKey, toCache.clone()));

    return response;
  },
};

export default worker;
