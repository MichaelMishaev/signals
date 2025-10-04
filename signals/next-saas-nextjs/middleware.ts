import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import createIntlMiddleware from 'next-intl/middleware';

// Create i18n middleware
const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'ur'],
  defaultLocale: 'en'
});

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip i18n middleware for admin and API routes - just pass through
  if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Handle i18n routing for all other routes
  const intlResponse = intlMiddleware(request);

  // Extract locale from the pathname or response
  const locale = pathname.startsWith('/en') ? 'en' : pathname.startsWith('/ur') ? 'ur' : 'en';

  // Check for dev toggle to simulate production
  const devSimulateProduction = request.cookies.get('dev-simulate-production')?.value === 'true';
  const isProduction = process.env.NODE_ENV === 'production' || devSimulateProduction;

  // Remove locale prefix for path checking
  const pathWithoutLocale = pathname.replace(/^\/(en|ur)/, '') || '/';

  // In production, only allow homepage and drill routes
  if (isProduction) {
    const allowedPaths = [
      '/',
      '/drill',
      '/signal',
      '/_next',
      '/favicon.ico',
      '/public'
    ];

    const isAllowed = allowedPaths.some(path =>
      pathWithoutLocale === path || pathWithoutLocale.startsWith(path + '/')
    );

    if (!isAllowed) {
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }

    return intlResponse || NextResponse.next();
  }

  // Development mode - allow all routes
  // Allow all API auth routes
  if (pathWithoutLocale.startsWith("/api/auth")) {
    return intlResponse || NextResponse.next();
  }

  // Allow public routes
  if (pathWithoutLocale.startsWith("/auth/") || pathWithoutLocale === "/" || pathWithoutLocale.startsWith("/drill-test")) {
    return intlResponse || NextResponse.next();
  }

  // Check authentication for protected routes
  if (pathWithoutLocale.startsWith("/drill")) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      // For drill pages, we can allow access with localStorage
      // but encourage sign in for full features
      return intlResponse || NextResponse.next();
    }
  }

  return intlResponse || NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};