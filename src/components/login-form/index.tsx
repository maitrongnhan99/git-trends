"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { signInAction } from "@/lib/auth/server-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useState, useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { When } from "react-if";
import { z } from "zod";
import { Button, FormInput, Input } from "../cores";
import { GitHubLoginButton } from "../github-login-button";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
  showDivider?: boolean;
  showGithubLogin?: boolean;
  showSignupLink?: boolean;
  onSignupClick?: () => void;
  className?: string;
}

const LoginForm: FC<LoginFormProps> = ({
  onSuccess,
  redirectTo = "/",
  showDivider = true,
  showGithubLogin = true,
  showSignupLink = true,
  onSignupClick,
  className,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { refetchUser } = useAuth();
  const router = useRouter();

  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setError(null);

    startTransition(async () => {
      try {
        // Create FormData object to pass to server action
        const formData = new FormData();
        formData.append("email", data.email);
        formData.append("password", data.password);
        if (data?.remember) {
          formData.append("remember", "true");
        }

        // Call server action
        const result = await signInAction(formData);

        if (result?.error) {
          setError(result.error);
          return;
        }

        // Update auth context with new user data
        await refetchUser?.();

        // Handle success
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(redirectTo);
        }
      } catch (error) {
        setError("An unexpected error occurred. Please try again.");
        console.error("Login failed:", error);
      }
    });
  };

  return (
    <div className={className}>
      {/* Error message */}
      <When condition={!!error}>
        <div className="p-3 mb-4 text-sm text-red-500 bg-red-100 border border-red-200 rounded-md dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
          {error}
        </div>
      </When>

      {/* GitHub Login Button */}
      {showGithubLogin && (
        <div className="mb-6">
          <GitHubLoginButton className="w-full" />
        </div>
      )}

      {/* Divider */}
      {showDivider && showGithubLogin && (
        <div className="flex items-center mb-4">
          <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600"></div>
          <span className="px-3 text-sm text-gray-500 dark:text-gray-400">
            or
          </span>
          <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600"></div>
        </div>
      )}

      <FormProvider {...methods}>
        <form
          className="space-y-4 md:space-y-6"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <FormInput<LoginFormValues>
            name="email"
            label="Email"
            type="email"
            placeholder="name@company.com"
          />

          <FormInput<LoginFormValues>
            name="password"
            label="Password"
            type="password"
            placeholder="••••••••"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <Input
                  id="remember"
                  type="checkbox"
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-slate-700 dark:border-slate-600 dark:focus:ring-primary-600 dark:ring-offset-slate-800"
                  fullWidth={false}
                  {...methods.register("remember")}
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="remember"
                  className="text-gray-500 dark:text-slate-500"
                >
                  Remember me
                </label>
              </div>
            </div>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-blue-600 hover:underline dark:text-slate-500"
            >
              Forgot password?
            </Link>
          </div>
          <Button
            variant="default"
            className="w-full"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Signing in..." : "Sign in"}
          </Button>

          {showSignupLink && (
            <p className="text-sm font-light text-gray-500 dark:text-slate-500">
              Don&apos;t have an account yet?{" "}
              {onSignupClick ? (
                <button
                  type="button"
                  className="font-medium text-primary-600 hover:underline dark:text-slate-900 bg-transparent"
                  onClick={onSignupClick}
                >
                  Sign up
                </button>
              ) : (
                <Link
                  href="/signup"
                  className="font-medium text-primary-600 hover:underline dark:text-slate-900"
                >
                  Sign up
                </Link>
              )}
            </p>
          )}
        </form>
      </FormProvider>
    </div>
  );
};

export { LoginForm };
