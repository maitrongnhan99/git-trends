import { getCurrentUser } from "@/lib/auth/get-current-user";
import { NextRequest, NextResponse } from "next/server";

/**
 * API endpoint to get current user information
 * This endpoint checks the auth token in cookies and returns user data if authenticated
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error fetching current user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
