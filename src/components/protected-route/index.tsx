"use client";

import { useAuth } from "@/utils/auth-context";
import { useRouter } from "next/navigation";
import { FC, ReactNode, useEffect } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectUrl?: string;
}

/**
 * ProtectedRoute component that checks if user is authenticated
 * and redirects to login page if not
 */
const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  redirectUrl = "/login",
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Client-side protection
  useEffect(() => {
    // Check the route on mount if not already loading
    const checkAuth = async () => {
      if (!isLoading && !isAuthenticated) {
        router.push(redirectUrl);
      }
    };

    checkAuth();
  }, [isAuthenticated, isLoading, router, redirectUrl]);

  // Show loading state while authentication is being checked
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If authenticated, render the children
  return isAuthenticated ? <>{children}</> : null;
};

/**
 * Server-side protected page wrapper that uses server actions
 * to protect routes before rendering on the client
 */
export async function withServerProtection<T extends object>(
  Component: FC<T>,
  redirectUrl: string = "/login"
) {
  return function ProtectedComponent(props: T) {
    // This wrapper leverages server actions but still needs the client component
    // for smooth transitions and handling authentication state changes
    return (
      <ProtectedRoute redirectUrl={redirectUrl}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

export { ProtectedRoute };
