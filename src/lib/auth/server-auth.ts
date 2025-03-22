"use server";

import { prisma } from "@/lib/prisma";
import { compare } from "bcrypt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { generateToken, verifyToken } from "./jwt";

/**
 * Server action to sign in a user
 */
export async function signInAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const remember = Boolean(formData.get("remember"));

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        image: true,
        githubUsername: true,
      },
    });

    if (!user?.password) {
      return { error: "Invalid email or password" };
    }

    // Verify password
    const passwordValid = await compare(password, user.password);

    if (!passwordValid) {
      return { error: "Invalid email or password" };
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    const cookieStore = await cookies();

    // Set HTTP-only cookie
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: remember ? 60 * 60 * 24 * 7 : undefined, // 7 days if remember is true
      path: "/",
    });

    // Return user data (without password)
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        githubUsername: user.githubUsername,
      },
    };
  } catch (error) {
    console.error("Sign-in error:", error);
    return { error: "Authentication failed" };
  }
}

/**
 * Server action to sign out a user
 */
export async function signOutAction() {
  try {
    const cookieStore = await cookies();

    // Clear the auth cookie
    cookieStore.set("auth-token", "", {
      expires: new Date(0), // Expire immediately
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Sign-out error:", error);
    return { error: "Failed to sign out" };
  }
}

/**
 * Server action to get the current user
 */
export async function getCurrentUserAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return { user: null };
    }

    // Verify token
    const payload = verifyToken(token);

    if (!payload?.id) {
      return { user: null };
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        githubUsername: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return { user: null };
    }

    // Convert dates to strings to match User interface
    return {
      user: {
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return { user: null };
  }
}

/**
 * Server action to protect a route
 */
export async function protectRouteAction(redirectUrl: string = "/login") {
  try {
    const { user } = await getCurrentUserAction();

    if (!user) {
      redirect(redirectUrl);
    }

    return { user };
  } catch (error) {
    console.error("Error protecting route:", error);
    redirect(redirectUrl);
  }
}
