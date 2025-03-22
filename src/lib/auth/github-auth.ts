"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { generateToken } from "./jwt";

/**
 * Server action to handle GitHub OAuth authentication
 * Completes the OAuth flow after Supabase redirects back to our app
 */
export async function handleGitHubAuthAction(formData: FormData) {
  // GitHub user data from Supabase Auth
  const githubUserId = formData.get("user_id") as string;
  const email = formData.get("email") as string;
  const name = (formData.get("user_name") as string) || null;
  const avatarUrl = (formData.get("avatar_url") as string) || null;
  const githubUsername = (formData.get("provider_id") as string) || null;
  const remember = Boolean(formData.get("remember") || true);

  if (!email || !githubUserId) {
    return { error: "Invalid GitHub authentication data" };
  }

  try {
    // Find or create user
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        githubId: githubUserId,
        name: name || undefined,
        image: avatarUrl || undefined,
        githubUsername: githubUsername || undefined,
      },
      create: {
        email,
        githubId: githubUserId,
        name: name || undefined,
        image: avatarUrl || undefined,
        githubUsername: githubUsername || undefined,
      },
    });

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: remember ? 60 * 60 * 24 * 7 : undefined, // 7 days if remember is true
      path: "/",
    });

    // Return user data
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
    console.error("GitHub authentication error:", error);
    return { error: "Authentication failed" };
  }
}
