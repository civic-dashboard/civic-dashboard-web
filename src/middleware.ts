import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(_request: NextRequest) {
  const res = NextResponse.next();

  // Instruct Cloudflare to cache the HTML response at the edge
  // - `max-age=0` prevents browsers from caching (lets CDN serve cached HTML)
  // - `cdn-cache-control` targets Cloudflare specifically: 1hr TTL with stale-while-revalidate
  res.headers.set('Cache-Control', 'public, max-age=0');
  res.headers.set(
    'cdn-cache-control',
    'public, max-age=3600, stale-while-revalidate=59',
  );

  return res;
}

export const config = {
  matcher: ['/councillors/:path*'],
};
