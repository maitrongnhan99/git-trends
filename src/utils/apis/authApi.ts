import { baseApi } from "./baseApi";

// Types
export interface User {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  githubUsername?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SignInParams {
  email: string;
  password: string;
  [key: string]: unknown;
}

export interface SignUpParams {
  email: string;
  password: string;
  name?: string;
  [key: string]: unknown;
}

export interface AuthResponse {
  message?: string;
  user: User;
}

/**
 * Authentication API functions
 */
const authApi = {
  /**
   * Sign in a user
   */
  signIn: (credentials: SignInParams): Promise<AuthResponse> => {
    return baseApi.post<AuthResponse>("/api/auth/signin", credentials);
  },

  /**
   * Sign up a new user
   */
  signUp: (userData: SignUpParams): Promise<AuthResponse> => {
    return baseApi.post<AuthResponse>("/api/auth/signup", userData);
  },

  /**
   * Get the current user's profile
   */
  getCurrentUser: (): Promise<{ user: User | null }> => {
    return baseApi.get<{ user: User | null }>("/api/auth/me");
  },

  /**
   * Sign out the current user
   */
  signOut: (): Promise<{ success: boolean }> => {
    return baseApi.post<{ success: boolean }>("/api/auth/signout", {});
  },
};

export { authApi };
