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

  // Redirect if no locale is present in pathname
  const hasLocale = pathname.startsWith('/it') || pathname.startsWith('/en');
  const excludeFromLocale = ['/dashboard', '/login']

  if (!hasLocale && !excludeFromLocale.some(path => pathname.startsWith(path))) {
    const locale = 'it'; // default locale
    return NextResponse.redirect(
      new URL(`/${locale}${pathname === '/' ? '' : pathname}`, req.url)
    );
  }
  

  // Check if this is a protected route
  const protectedRoutes = ['/dashboard'];
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      const loginUrl = new URL(hasLocale ? `/${pathname.split('/')[1]}/login` : '/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|assets).*)',
  ],
};
