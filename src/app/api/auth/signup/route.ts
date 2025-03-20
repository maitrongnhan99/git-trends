import { generateToken } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { hash } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Define validation schema for sign-up request
const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().optional(),
});

// Define a type for user creation with password
interface UserCreateWithPassword {
  email: string;
  name?: string | null;
  password: string;
  userPreferences?: {
    create: {
      darkMode: boolean;
      defaultView: string;
    };
  };
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate request data
    const validationResult = signUpSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const { email, password, name } = validationResult.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create user data with password
    const userData: UserCreateWithPassword = {
      email,
      name,
      password: hashedPassword,
      userPreferences: {
        create: {
          darkMode: false,
          defaultView: "grid",
        },
      },
    };

    // Create new user
    const user = await prisma.user.create({
      data: userData as unknown as Prisma.UserCreateInput,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    // Create response with token cookie
    const response = NextResponse.json(
      { message: "User created successfully", user },
      { status: 201 }
    );

    // Set HTTP-only cookie
    response.cookies.set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Sign-up error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
