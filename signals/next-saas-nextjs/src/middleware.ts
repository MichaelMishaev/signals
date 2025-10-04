import createIntlMiddleware from 'next-intl/middleware';
import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

const locales = ['en', 'ur'];
const defaultLocale = 'en';

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

const authMiddleware = withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.includes("/auth");
    const isDrillPage = req.nextUrl.pathname.includes("/drill");
    const isApiAuthRoute = req.nextUrl.pathname.startsWith("/api/auth");

    // Allow API auth routes
    if (isApiAuthRoute) {
      return NextResponse.next();
    }

    // Redirect authenticated users from auth pages to drill
    if (isAuthPage && isAuth) {
      const locale = req.nextUrl.pathname.split('/')[1];
      return NextResponse.redirect(new URL(`/${locale}/drill`, req.url));
    }

    // Redirect unauthenticated users from drill to signin
    if (isDrillPage && !isAuth) {
      const locale = req.nextUrl.pathname.split('/')[1];
      const from = req.nextUrl.pathname + req.nextUrl.search;
      return NextResponse.redirect(
        new URL(`/${locale}/auth/signin?from=${encodeURIComponent(from)}`, req.url)
      );
    }

    return intlMiddleware(req as NextRequest);
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return true;
      },
    },
    pages: {
      signIn: "/auth/signin",
      error: "/auth/error",
    },
  }
);

export default function middleware(req: NextRequest) {
  const isAuthProtectedPath = req.nextUrl.pathname.match(/\/(en|ur)\/(drill|auth)/);

  if (isAuthProtectedPath) {
    return (authMiddleware as any)(req);
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ['/', '/(en|ur)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};