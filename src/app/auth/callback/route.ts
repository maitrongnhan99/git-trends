"use server";

import { handleGitHubAuthAction } from "@/lib/auth/github-auth";
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get the code from the URL
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    if (!code) {
      return NextResponse.redirect(
        new URL("/login?error=missing_code", request.url)
      );
    }

    // Exchange code for session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data.user || !data.session) {
      console.error("Error exchanging code for session:", error);
      return NextResponse.redirect(
        new URL("/login?error=auth_error", request.url)
      );
    }

    // Extract user data
    const formData = new FormData();
    formData.append("user_id", data.user.id);
    formData.append("email", data.user.email || "");
    formData.append("user_name", data.user.user_metadata?.name || "");
    formData.append("avatar_url", data.user.user_metadata?.avatar_url || "");
    formData.append("provider_id", data.user.user_metadata?.user_name || "");
    formData.append("remember", "true");

    // Call the server action to create/update user and set cookie
    const result = await handleGitHubAuthAction(formData);

    if (result.error) {
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(result.error)}`, request.url)
      );
    }

    // Redirect to homepage or dashboard
    return NextResponse.redirect(new URL("/", request.url));
  } catch (error) {
    console.error("Authentication callback error:", error);
    return NextResponse.redirect(
      new URL("/login?error=server_error", request.url)
    );
  }
}
