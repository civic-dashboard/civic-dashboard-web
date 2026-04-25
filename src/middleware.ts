import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(_request: NextRequest) {
  const res = NextResponse.next();
  res.headers.set(
    'Cache-Control',
    'public, max-age=0, s-maxage=3600, stale-while-revalidate=59',
  );
  return res;
}

export const config = {
  matcher: ['/councillors/:path*'],
};
