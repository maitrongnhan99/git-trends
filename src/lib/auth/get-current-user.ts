import { NextRequest } from "next/server";
import { prisma } from "../prisma";
import { verifyToken } from "./jwt";

export const getCurrentUser = async (request: NextRequest) => {
  try {
    // Get token from cookie
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return null;
    }

    // Verify token
    const payload = verifyToken(token);

    if (!payload?.id) {
      return null;
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

    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};
