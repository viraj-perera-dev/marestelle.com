// middleware.js - Debug version for development
import { NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req) {
  const { pathname, search } = req.nextUrl;
  
  // Add debug logging
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    console.log('🔄 Middleware:', { 
      pathname, 
      hasSearch: !!search,
      userAgent: req.headers.get('user-agent')?.slice(0, 50),
      acceptLanguage: req.headers.get('accept-language')
    });
  }
  
  // Early returns for static files, API routes, and special paths
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/robots.txt') ||
    pathname.startsWith('/sitemap.xml') ||
    pathname.includes('.') // Any file with extension
  ) {
    if (isDev) console.log('⚡ Skip static:', pathname);
    return NextResponse.next();
  }

  // Routes that bypass locale handling entirely
  const excludeFromLocale = ['/dashboard', '/login', '/payment-success'];
  const isExcluded = excludeFromLocale.some(path => pathname.startsWith(path));

  if (isExcluded) {
    if (isDev) console.log('🔒 Admin route:', pathname);
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });
    await supabase.auth.getSession();
    return res;
  }

  // Handle locale redirects for all other routes
  const supportedLocales = ['it', 'en', 'fr'];
  const defaultLocale = 'it';
  
  // Check if path already has a locale prefix
  const localeInPath = supportedLocales.find(locale => 
    pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  // If already has locale, continue with Supabase auth
  if (localeInPath) {
    if (isDev) console.log('✅ Has locale:', localeInPath, pathname);
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });
    await supabase.auth.getSession();
    return res;
  }

  // Detect user's preferred locale
  const preferredLocale = detectLocale(req, supportedLocales, defaultLocale);
  
  // Construct redirect URL with locale prefix
  const redirectPath = pathname === '/' 
    ? `/${preferredLocale}`
    : `/${preferredLocale}${pathname}`;
  
  const redirectUrl = new URL(`${redirectPath}${search}`, req.url);
  
  if (isDev) {
    console.log('🔀 Redirecting:', {
      from: pathname,
      to: redirectPath,
      locale: preferredLocale
    });
  }
  
  return NextResponse.redirect(redirectUrl);
}

function detectLocale(req, supportedLocales, defaultLocale) {
  // Priority 1: Check URL search params (for testing: ?locale=en)
  const urlLocale = new URL(req.url).searchParams.get('locale');
  if (urlLocale && supportedLocales.includes(urlLocale)) {
    return urlLocale;
  }

  // Priority 2: Check Accept-Language header
  const acceptLanguage = req.headers.get('accept-language');
  if (acceptLanguage) {
    const languages = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0].trim().toLowerCase());
    
    // Check for exact matches first
    for (const lang of languages) {
      if (supportedLocales.includes(lang)) {
        return lang;
      }
    }
    
    // Check for language-only matches (en-US -> en)
    for (const lang of languages) {
      const langCode = lang.split('-')[0];
      if (supportedLocales.includes(langCode)) {
        return langCode;
      }
    }
  }

  // Priority 3: Geo-location based detection (if available)
  const country = req.geo?.country?.toLowerCase();
  if (country) {
    const countryToLocale = {
      'fr': 'fr',
      'gb': 'en',
      'us': 'en',
      'ca': 'en',
      'au': 'en',
      'de': 'en',
      'ch': 'en',
      'at': 'en',
      'nl': 'en',
      'be': 'en'
    };
    
    if (countryToLocale[country]) {
      return countryToLocale[country];
    }
  }

  return defaultLocale;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|assets|.*\\..*).*)',
  ],
};