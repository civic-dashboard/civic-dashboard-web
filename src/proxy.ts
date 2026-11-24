import { NextRequest, NextResponse } from 'next/server';

const productionOrigin = new URL('https://civicdashboard.ca');
const councillorCacheControl =
  'public, max-age=0, s-maxage=3600, stale-while-revalidate=59';

export function proxy(request: NextRequest) {
  if (
    process.env.CIVIC_DASHBOARD_PROXY_PRODUCTION === '1' &&
    request.method === 'GET' &&
    request.nextUrl.pathname !== '/_next/webpack-hmr'
  ) {
    const destination = new URL(productionOrigin);
    destination.pathname = request.nextUrl.pathname;
    destination.search = request.nextUrl.search;

    return NextResponse.rewrite(destination);
  }

  const response = NextResponse.next();
  if (
    request.nextUrl.pathname === '/councillors' ||
    request.nextUrl.pathname.startsWith('/councillors/')
  ) {
    response.headers.set('Cache-Control', councillorCacheControl);
  }

  return response;
}

export const config = {
  matcher: '/:path*',
};
