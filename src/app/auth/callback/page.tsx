"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";

const AuthCallback: FC = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [status, setStatus] = useState("Initializing authentication...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuth = async () => {
      try {
        setStatus("Checking Supabase session...");
        // Supabase Auth automatically handles the code exchange on page load
        // We just need to check if we have a session
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth Callback Error:", error.message);
          setError(`Authentication error: ${error.message}`);
          router.push(`/login?error=${encodeURIComponent(error.message)}`);
          return;
        }

        if (!data.session) {
          console.error("No session found");
          setError("No authentication session found");
          router.push("/login?error=no_session");
          return;
        }

        const user = data.session.user;
        console.log("User authenticated successfully", user);
        setStatus("Creating or updating user data...");

        // Check if the user exists in the database or create/update the user
        try {
          const userData = {
            email: user.email,
            id: user.id,
            name: user.user_metadata?.name || user.email?.split("@")[0],
            avatarUrl: user.user_metadata?.avatar_url,
            githubId: user.user_metadata?.provider_id,
            githubUsername: user.user_metadata?.user_name,
          };

          console.log("Sending user data to API:", {
            ...userData,
            avatarUrl: userData.avatarUrl ? "[exists]" : null,
          });

          // Get the session token to pass in the Authorization header
          const { data: sessionData } = await supabase.auth.getSession();
          const accessToken = sessionData.session?.access_token;

          const response = await fetch("/api/users/auth", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: accessToken ? `Bearer ${accessToken}` : "",
            },
            body: JSON.stringify(userData),
          });

          const responseData = await response.json();
          console.log("API response:", responseData);

          if (!response.ok) {
            throw new Error(
              responseData.message || "Failed to process user data"
            );
          }

          console.log("User data processed:", responseData);
          setStatus("Authentication complete! Setting auth token...");

          // Set auth token in cookie for authentication
          const token = accessToken ?? data.session.access_token;

          if (!token) {
            throw new Error("No access token available");
          }

          // Use the login function from AuthContext to set the token
          login(token);

          console.log("Auth token set in cookie");
          setStatus("Authentication complete! Redirecting...");

          // Redirect to the dashboard or home page
          router.push("/");
        } catch (error) {
          const dbError = error as Error;
          console.error("Database operation error:", dbError);
          setError(`Database error: ${dbError.message}`);
          router.push(
            `/login?error=database_error&message=${encodeURIComponent(
              dbError.message || "Unknown error"
            )}`
          );
        }
      } catch (err) {
        const error = err as Error;
        console.error("Unexpected error during auth:", error);
        setError(`Unexpected error: ${error.message}`);
        router.push("/login?error=unexpected_error");
      }
    };

    // Let Supabase detect and process the auth callback
    handleAuth();
  }, [router, login]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
        <Link
          href="/"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <Image
            className="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
            width={32}
            height={32}
          />
          Git Trends
        </Link>

        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-slate-800 dark:border-slate-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8 text-center">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Authentication in Progress
            </h1>

            {!error ? (
              <div className="flex flex-col items-center space-y-6 py-4">
                {/* Loading Animation */}
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>

                {/* Status Message */}
                <p className="text-md text-gray-700 dark:text-gray-300">
                  {status}
                </p>

                <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Please wait while we complete your authentication. You&apos;ll
                  be redirected automatically.
                </div>
              </div>
            ) : (
              <div className="text-left mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                <h3 className="font-semibold text-lg mb-2">
                  Authentication Failed
                </h3>
                <p className="mb-3">{error}</p>
                <Link
                  href="/login"
                  className="inline-block mt-2 px-4 py-2 bg-primary-600 text-white font-medium rounded-lg text-sm hover:bg-primary-700 transition-colors"
                >
                  Return to Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
