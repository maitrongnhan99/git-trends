import { NextRequest, NextResponse } from "next/server";

// Paths that don't require authentication
const publicPaths = [
  "/",
  "/login",
  "/signup",
  "/about",
  "/forgot-password",
  "/api/auth/signin",
  "/api/auth/signup",
  "/api/auth/signout",
  "/api/auth/me",
  "/api/users/auth",
];

// Routes that require authentication
const protectedPaths = ["/dashboard", "/profile", "/settings", "/projects"];

/**
 * Middleware function to handle authentication
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is an API route
  if (
    pathname.startsWith("/api/") &&
    !pathname.startsWith("/api/auth/") &&
    pathname !== "/api/users/auth"
  ) {
    // Protected API endpoints always need authentication
    // Check for auth token
    const token = request.cookies.get("auth-token")?.value;

    // If no token is present, return unauthorized
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // Check if the path is public or matches static files
  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
  const isStaticFile =
    /\.(jpg|jpeg|png|gif|svg|ico|js|css|woff|woff2|ttf|otf)$/i.test(pathname);

  if (isPublicPath || isStaticFile) {
    return NextResponse.next();
  }

  // Check if path requires authentication
  const needsAuth = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (needsAuth) {
    // Check for auth token
    const token = request.cookies.get("auth-token")?.value;

    // If no token is present, redirect to login
    if (!token) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Configure paths that should be checked by the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
