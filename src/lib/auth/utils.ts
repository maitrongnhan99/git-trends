"use client";

import { supabase } from "@/lib/supabase";
import Cookies from "js-cookie";

/**
 * Check if the user is authenticated by verifying the auth-token cookie
 * and the Supabase session
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    // Check for auth-token cookie
    const authToken = Cookies.get("auth-token");
    if (!authToken) {
      return false;
    }

    // Verify the Supabase session is valid
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
};

/**
 * Get the current user from Supabase session
 */
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
      return null;
    }
    return data.session.user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

/**
 * Sign out the user and clear auth cookies
 */
export const signOut = async (): Promise<void> => {
  try {
    // Sign out from Supabase
    await supabase.auth.signOut();

    // Clear auth-token cookie
    Cookies.remove("auth-token", { path: "/" });

    console.log("User signed out successfully");
  } catch (error) {
    console.error("Error signing out:", error);
  }
};
