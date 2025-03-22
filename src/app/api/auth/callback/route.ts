"use server";

import { handleGitHubAuthAction } from "@/lib/auth/github-auth";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get the code from the URL
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const error = url.searchParams.get("error");
    const state = url.searchParams.get("state");

    console.log("🔄 Code:", code);
    console.log("🔄 Error:", error);
    console.log("🔄 State:", state);

    // Verify state parameter to prevent CSRF attacks
    const requestCookies = request.cookies;
    const savedState = requestCookies.get("github_oauth_state")?.value;

    if (state && savedState && state !== savedState) {
      console.error("State mismatch: ", { received: state, saved: savedState });
      return NextResponse.redirect(
        new URL("/login?error=invalid_state", request.url)
      );
    }

    if (error) {
      console.error("Error returned from GitHub:", error);
      return NextResponse.redirect(
        new URL(`/login?error=${error}`, request.url)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL("/login?error=missing_code", request.url)
      );
    }

    // Create a fresh Supabase client for server-side
    // IMPORTANT: We need to create a client with no cookie storage, just for code exchange
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false, // Don't persist the session
          autoRefreshToken: false, // Don't auto refresh token
          flowType: "pkce", // Use the PKCE flow
        },
      }
    );

    console.log("🔄 Using server Supabase client with PKCE flow");

    try {
      console.log("@Supabase Auth Code:", supabase);
      console.log("🔄 Supabase Auth Code:", code);
      // Exchange code for session
      const { data, error: sessionError } =
        await supabase.auth.exchangeCodeForSession(code);

      console.log("🔄 Session data:", data);

      if (sessionError) {
        console.error("Error exchanging code for session:", sessionError);
        throw sessionError;
      }

      if (!data?.user) {
        console.error("No user data returned");
        return NextResponse.redirect(
          new URL("/login?error=no_user_data", request.url)
        );
      }

      // Extract user data
      const formData = new FormData();
      formData.append("user_id", data.user.id);
      formData.append("email", data.user.email ?? "");
      formData.append("user_name", data.user.user_metadata?.name || "");
      formData.append("avatar_url", data.user.user_metadata?.avatar_url || "");
      formData.append("provider_id", data.user.user_metadata?.user_name || "");
      formData.append("remember", "true");

      // Call the server action to create/update user and set cookie
      const result = await handleGitHubAuthAction(formData);

      console.log("🔄 Result:", result);

      if (result.error) {
        return NextResponse.redirect(
          new URL(
            `/login?error=${encodeURIComponent(result.error)}`,
            request.url
          )
        );
      }

      // Create response with cookies
      const response = NextResponse.redirect(
        new URL("/?redirect=true", request.url)
      );

      // Set the session cookies
      if (data.session) {
        // Set auth cookies manually
        const sixMonthsInSeconds = 60 * 60 * 24 * 30 * 6;

        response.cookies.set("sb-access-token", data.session.access_token, {
          path: "/",
          maxAge: sixMonthsInSeconds,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });

        response.cookies.set("sb-refresh-token", data.session.refresh_token, {
          path: "/",
          maxAge: sixMonthsInSeconds,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
      }

      return response;
    } catch (exchangeError) {
      console.error("Error during code exchange:", exchangeError);
      return NextResponse.redirect(
        new URL("/login?error=exchange_error", request.url)
      );
    }
  } catch (error) {
    console.error("Authentication callback error:", error);
    return NextResponse.redirect(
      new URL("/login?error=server_error", request.url)
    );
  }
}
