import { generateToken } from "@/lib/auth/jwt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST endpoint to set auth token based on Supabase session
 * Converts Supabase session to our JWT token format
 */
export async function POST(request: NextRequest) {
  try {
    const { user } = await request.json();

    if (!user?.id || !user.email) {
      return NextResponse.json(
        { success: false, error: "Invalid user data" },
        { status: 400 }
      );
    }

    // Generate a JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email.split("@")[0],
    });

    // Set the token as an HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error setting auth token:", error);
    return NextResponse.json(
      { success: false, error: "Failed to set auth token" },
      { status: 500 }
    );
  }
}
