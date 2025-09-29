import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
    const isDrillPage = req.nextUrl.pathname.startsWith("/drill");
    const isApiAuthRoute = req.nextUrl.pathname.startsWith("/api/auth");

    // Allow API auth routes
    if (isApiAuthRoute) {
      return NextResponse.next();
    }

    // Redirect authenticated users from auth pages to drill
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL("/drill", req.url));
    }

    // Redirect unauthenticated users from drill to signin
    if (isDrillPage && !isAuth) {
      const from = req.nextUrl.pathname + req.nextUrl.search;
      return NextResponse.redirect(
        new URL(`/auth/signin?from=${encodeURIComponent(from)}`, req.url)
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // This function is called to check if the user is authorized
        // We return true to let the middleware function handle the logic
        return true;
      },
    },
    pages: {
      signIn: "/auth/signin",
      error: "/auth/error",
    },
  }
);

export const config = {
  matcher: [
    "/drill/:path*",
    "/auth/:path*",
    "/api/drill/:path*",
    // Add other protected routes here
  ],
};