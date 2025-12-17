import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only set edge caching for councillor pages
  if (pathname.startsWith('/councillors/')) {
    const res = NextResponse.next();

    // Instruct Cloudflare (and other CDNs) to cache the HTML response at the edge
    // - `s-maxage` controls shared/CDN cache TTL
    // - `max-age=0` prevents browsers from caching (lets CDN serve cached HTML)
    // - `stale-while-revalidate` allows serving stale content while revalidating in background
    res.headers.set(
      'Cache-Control',
      'public, max-age=0, s-maxage=3600, stale-while-revalidate=59',
    );

    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/councillors/:path*'],
};
