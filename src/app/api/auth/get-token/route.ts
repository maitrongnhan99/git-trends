import { verifyToken } from "@/lib/auth/jwt";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET endpoint that safely checks if a valid auth token exists
 * Returns existence status without exposing the actual token
 */
export async function GET(request: NextRequest) {
  try {
    // Get the token from cookies
    const token = request.cookies.get("auth-token")?.value;

    // If no token exists, return false
    if (!token) {
      return NextResponse.json({ hasToken: false });
    }

    // Verify the token is valid (without exposing details)
    const payload = verifyToken(token);

    // Return whether a valid token exists
    return NextResponse.json({
      hasToken: !!payload?.id,
      // Include minimal user info for immediate UI updates
      userId: payload?.id ?? null,
    });
  } catch (error) {
    console.error("Error checking token:", error);
    return NextResponse.json({ hasToken: false });
  }
}
