import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check for dev toggle to simulate production
  const devSimulateProduction = request.cookies.get('dev-simulate-production')?.value === 'true';
  const isProduction = process.env.NODE_ENV === 'production' || devSimulateProduction;

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
      pathname === path || pathname.startsWith(path + '/')
    );

    if (!isAllowed) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  }

  // Development mode - allow all routes
  // Allow all API auth routes
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Allow public routes
  if (pathname.startsWith("/auth/") || pathname === "/" || pathname.startsWith("/drill-test")) {
    return NextResponse.next();
  }

  // Check authentication for protected routes
  if (pathname.startsWith("/drill")) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      // For drill pages, we can allow access with localStorage
      // but encourage sign in for full features
      return NextResponse.next();
    }
  }

  return NextResponse.next();
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