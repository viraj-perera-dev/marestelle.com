// middleware.js
import { NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const { pathname } = req.nextUrl;

  // Skip static files and API routes
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/assets') ||
    pathname.includes('.')
  ) {
    return res;
  }

  // Routes that should be excluded from locale prefix
  const excludeFromLocale = ['/dashboard', '/login', '/payment-success'];
  const isExcluded = excludeFromLocale.some(path => pathname.startsWith(path));


  // Redirect if no locale is present in pathname (only for non-excluded routes)
  if (!isExcluded) {
    const hasLocale = pathname.startsWith('/it') || pathname.startsWith('/en') || pathname.startsWith('/fr');
    
    if (!hasLocale) {
      const locale = 'it'; // default locale
      return NextResponse.redirect(
        new URL(`/${locale}${pathname === '/' ? '' : pathname}`, req.url)
      );
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|assets).*)',
  ],
};