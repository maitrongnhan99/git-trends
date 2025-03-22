"use client";

import { supabase } from "@/lib/supabase";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";
import { FC, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import { Button } from "../cores";

interface GitHubLoginButtonProps {
  className?: string;
}

const GitHubLoginButton: FC<GitHubLoginButtonProps> = ({ className }) => {
  const [isLoading, setIsLoading] = useState(false);

  const signInWithGithub = async () => {
    const auth_callback_url = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: auth_callback_url,
      },
    });

    if (error) {
      console.error(error);
      throw error;
    }

    redirect(data.url);
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);

      // Generate a random state value for CSRF protection
      const state =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

      // Store state in a cookie for verification in the callback
      Cookies.set("github_oauth_state", state, {
        expires: 1 / 24, // Expires in 1 hour
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      // Use Supabase to handle GitHub OAuth
      await signInWithGithub();
    } catch (error) {
      console.error("Failed to initiate GitHub login:", error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="dark"
      className={twMerge("flex items-center justify-center", className)}
      onClick={handleLogin}
      disabled={isLoading}
    >
      <FaGithub className="mr-2 h-4 w-4" />
      {isLoading ? "Connecting..." : "Continue with GitHub"}
    </Button>
  );
};

export { GitHubLoginButton };
