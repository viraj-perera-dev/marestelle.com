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
    pathname.includes('.') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    return res;
  }

  // Routes that should be excluded from locale prefix
  const excludeFromLocale = ['/dashboard', '/login', '/payment-success'];
  const isExcluded = excludeFromLocale.some(path => pathname.startsWith(path));

  // Handle locale redirects only for non-excluded routes
  if (!isExcluded) {
    const supportedLocales = ['it', 'en', 'fr'];
    const hasLocale = supportedLocales.some(locale => pathname.startsWith(`/${locale}`));
    
    // Only redirect if:
    // 1. No locale is present
    // 2. It's exactly the root path or doesn't start with a locale
    // 3. Avoid redirect loops
    if (!hasLocale && pathname === '/') {
      const locale = 'it'; // default locale
      const url = new URL(`/${locale}`, req.url);
      return NextResponse.redirect(url);
    }
    
    // For other paths without locale, redirect them too
    if (!hasLocale && pathname !== '/') {
      const locale = 'it';
      const url = new URL(`/${locale}${pathname}`, req.url);
      return NextResponse.redirect(url);
    }
  }

  return res;
}

export const config = {
  matcher: [
    // More specific matcher to avoid catching everything
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|assets).*)',
  ],
};