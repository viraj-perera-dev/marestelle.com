// middleware.js (create this file in your project root, same level as app folder)
import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Don't redirect if already has a locale
  if (pathname.startsWith('/it') || pathname.startsWith('/en')) {
    return NextResponse.next();
  }

  // Don't redirect API routes, static files, etc.
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/assets') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Redirect root and other paths to /it
  const locale = 'it'; // Default locale
  return NextResponse.redirect(
    new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url)
  );
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|assets).*)',
  ],
};