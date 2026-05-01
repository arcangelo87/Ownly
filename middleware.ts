import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
