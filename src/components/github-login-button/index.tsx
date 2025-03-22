"use client";

import { supabase } from "@/lib/supabase";
import { FC, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { Button } from "../cores";

interface GitHubLoginButtonProps {
  className?: string;
  redirectTo?: string;
}

const GitHubLoginButton: FC<GitHubLoginButtonProps> = ({
  className,
  redirectTo = `${window.location.origin}/auth/callback`,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);

      // Initiate GitHub OAuth login
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo,
          scopes: "read:user user:email",
        },
      });

      if (error) {
        console.error("GitHub login error:", error);
        throw error;
      }

      // Redirect happens automatically
    } catch (error) {
      console.error("Failed to initiate GitHub login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="light"
      className={className}
      onClick={handleLogin}
      disabled={isLoading}
    >
      <FaGithub className="mr-2 h-4 w-4" />
      {isLoading ? "Connecting..." : "Continue with GitHub"}
    </Button>
  );
};

export { GitHubLoginButton };
