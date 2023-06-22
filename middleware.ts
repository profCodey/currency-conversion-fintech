import { NextRequest, NextResponse } from "next/server";
import { APP_TOKENS, USER_CATEGORIES } from "./utils/constants";

export function middleware(request: NextRequest) {
  //   let cookie = request.cookies.get("nextjs")?.value;
  const apiClientPaths = [
    "/dashboard",
    "/config",
    "/onboarding",
    "/support",
    "/recipients",
    // "/converter",
    "/fund-account",
    "/transactions",
  ];

  const adminPaths = ["/admin"];

  const publicPaths = ["/", "/login", "/sign-up", "/forgot-password"];
  const isAuthenticated = request.cookies.has(APP_TOKENS.ACCESS_TOKEN);
  const userCategory = request.cookies.get(APP_TOKENS.CATEGORY)?.value;
  const nextUrl = request.nextUrl;

  // if not isAuthenticated, only allow visiting public paths
  if (!isAuthenticated && !publicPaths.includes(nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (userCategory === USER_CATEGORIES.API_CLIENT) {
    if (apiClientPaths.some((path) => nextUrl.pathname.startsWith(path))) {
      // if (apiClientPaths.includes(nextUrl.pathname)) {
      return NextResponse.rewrite(new URL(nextUrl.pathname, request.url));
    } else {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  if (userCategory === USER_CATEGORIES.ADMIN) {
    if (adminPaths.some((path) => nextUrl.pathname === path)) {
      return NextResponse.rewrite(new URL(nextUrl.pathname, request.url));
    } else {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|world-map-bg.svg).*)",
  ],
};
