"use client";
import { getCurrentUserAction, signOutAction } from "@/lib/auth/server-auth";
import { User } from "@/utils/apis";
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

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Check if a valid token exists on the server
 * Uses the API endpoint to avoid exposing tokens to client JavaScript
 */
const checkServerToken = async (): Promise<boolean> => {
  try {
    const response = await fetch("/api/auth/get-token");
    if (!response.ok) return false;

    const data = await response.json();
    return data.hasToken;
  } catch (error) {
    console.error("Error checking token:", error);
    return false;
  }
};

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCurrentUser = async () => {
    try {
      setIsLoading(true);
      const { user } = await getCurrentUserAction();

      if (user) {
        console.log("✅ User authenticated:", user.email);
        setUser(user);
      } else {
        console.log("❌ No user found");
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if token exists on the server
        const hasToken = await checkServerToken();
        console.log("🔄 Server token check:", hasToken);

        if (hasToken) {
          console.log("🔄 Auth token found, fetching user...");
          await fetchCurrentUser();
        } else {
          console.log("❌ No auth token found");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error during auth check:", error);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    setIsLoading(true);
    try {
      const result = await signOutAction();
      if (result.error) {
        throw new Error(result.error);
      }
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refetchUser = useCallback(async () => {
    // First check if token exists
    const hasToken = await checkServerToken();
    if (hasToken) {
      await fetchCurrentUser();
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      logout,
      refetchUser,
    }),
    [user, isLoading, refetchUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
