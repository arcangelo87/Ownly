import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { SITE_PAGES } from './lib/seo/pages';

const intlMiddleware = createIntlMiddleware(routing);

const PT_PATHS = new Set(SITE_PAGES.filter((p) => p.locales.includes('pt')).map((p) => p.path));

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /en/institutional-buy-side is a public URL shared with investors: never
  // redirect or rewrite it here (see CLAUDE.md hard rules).

  // Root domain and /en both show the strategic buyers landing page directly
  if (pathname === '/' || pathname === '/en' || pathname === '/en/') {
    return NextResponse.rewrite(new URL('/en/institutional-buy-side', request.url));
  }

  // The PT home is the PT sell-side page
  if (pathname === '/pt' || pathname === '/pt/') {
    return NextResponse.redirect(new URL('/pt/sell-side', request.url), 308);
  }

  // Only pages with Portuguese copy (SITE_PAGES) and PT blog posts are served
  // under /pt. Everything else, and any old /it URL, goes to the English page.
  const localeMatch = pathname.match(/^\/(pt|it)(\/.*)?$/);
  if (localeMatch) {
    const rest = (localeMatch[2] ?? '').replace(/\/$/, '');
    const servedInPt = localeMatch[1] === 'pt' && (PT_PATHS.has(rest) || rest.startsWith('/blog'));
    if (!servedInPt) {
      return NextResponse.redirect(new URL(`/en${rest}`, request.url), 308);
    }
  }

  // Refresh Supabase auth session on every request
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Guard admin routes
  const isAdmin = /^\/[a-z]{2}\/admin(\/|$)/.test(pathname);
  const isLogin = /^\/[a-z]{2}\/admin\/login(\/|$)/.test(pathname);
  const isResetPassword = /^\/[a-z]{2}\/admin\/reset-password(\/|$)/.test(pathname);

  if (isAdmin && !isLogin && !isResetPassword && !user) {
    const locale = pathname.split('/')[1];
    return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url));
  }

  if (isLogin && user) {
    const locale = pathname.split('/')[1];
    return NextResponse.redirect(new URL(`/${locale}/admin`, request.url));
  }

  // Apply next-intl routing for all other routes
  const intlResponse = intlMiddleware(request);
  // Carry over any Supabase session cookies
  response.cookies.getAll().forEach((cookie) => intlResponse.cookies.set(cookie));
  return intlResponse;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
