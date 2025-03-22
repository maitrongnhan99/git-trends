"use client";

import { supabase } from "@/lib/supabase";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getCurrentUser, signOut } from "./utils";

// Define the User type
type User = {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
};

// Define the AuthContext type to match the original interface
type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
};

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: async () => {},
  refetchUser: async () => {},
});

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Function to handle login
  const handleLogin = useCallback((token: string) => {
    // Set auth-token cookie
    Cookies.set("auth-token", token, {
      expires: 7, // 7 days
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }, []);

  // Function to handle logout
  const handleLogout = useCallback(async () => {
    await signOut();
    setUser(null);
    router.push("/login");
  }, [router]);

  // Function to refetch the current user
  const refetchUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const currentUser = await getCurrentUser();

      if (currentUser) {
        setUser({
          id: currentUser.id,
          email: currentUser.email ?? "",
          name: currentUser.user_metadata?.name,
          image: currentUser.user_metadata?.avatar_url,
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error refetching user:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check for existing session on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsLoading(true);
        const currentUser = await getCurrentUser();

        if (currentUser) {
          setUser({
            id: currentUser.id,
            email: currentUser.email ?? "",
            name: currentUser.user_metadata?.name,
            image: currentUser.user_metadata?.avatar_url,
          });
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        if (event === "SIGNED_IN" && session) {
          // User signed in, update state
          const user = session.user;
          setUser({
            id: user.id,
            email: user.email ?? "",
            name: user.user_metadata?.name,
            image: user.user_metadata?.avatar_url,
          });

          // Ensure auth-token is set
          Cookies.set("auth-token", session.access_token, {
            expires: 7,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
          });
        } else if (event === "SIGNED_OUT") {
          // User signed out, update state
          setUser(null);
          Cookies.remove("auth-token", { path: "/" });
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login: handleLogin,
      logout: handleLogout,
      refetchUser,
    }),
    [user, isLoading, refetchUser, handleLogin, handleLogout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);
