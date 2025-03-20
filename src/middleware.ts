import { verifyToken } from "@/lib/auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// Define paths that don't require authentication
const publicPaths = [
  "/",
  "/login",
  "/api/auth/signin",
  "/api/auth/signup",
  "/about",
];

// Check if the path is public
const isPublicPath = (path: string) => {
  return publicPaths.some(
    (publicPath) =>
      path === publicPath ||
      path.startsWith("/api/auth/") ||
      path.startsWith("/_next/") ||
      path.startsWith("/favicon")
  );
};

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Allow public paths
  if (isPublicPath(path)) {
    return NextResponse.next();
  }

  // Check for auth token
  const token = request.cookies.get("auth-token")?.value;

  // If no token is present, redirect to login
  if (!token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  // Verify token
  const payload = verifyToken(token);

  // If token is invalid, redirect to login
  if (!payload) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  // Token is valid, proceed
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
