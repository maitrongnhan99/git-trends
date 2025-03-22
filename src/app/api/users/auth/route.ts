import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();
    const { email, id, name, avatarUrl, githubId, githubUsername } = userData;

    console.log("Received user data:", {
      email,
      id,
      name,
      avatarUrl: avatarUrl ? "[avatar url exists]" : null,
      githubId,
      githubUsername,
    });

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user exists by email
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { email },
      });
      console.log("Existing user lookup result:", user ? "Found" : "Not found");
    } catch (findError) {
      console.error("Error finding user:", findError);
      return NextResponse.json(
        { message: `Error finding user: ${(findError as Error).message}` },
        { status: 500 }
      );
    }

    try {
      if (user) {
        // Update existing user with GitHub info
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            githubId: githubId || user.githubId,
            githubUsername: githubUsername || user.githubUsername,
            name: name || user.name,
            image: avatarUrl || user.image,
            updatedAt: new Date(),
          },
        });

        console.log("Updated existing user:", user.id);
      } else {
        // Create new user
        console.log("Attempting to create new user with ID:", id);
        user = await prisma.user.create({
          data: {
            id: id, // Use Supabase user ID
            email,
            name: name || email.split("@")[0],
            image: avatarUrl,
            githubId,
            githubUsername,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        console.log("Created new user:", user.id);
      }
    } catch (dbError) {
      const errorMessage = (dbError as Error).message;
      console.error("Error during user create/update:", dbError);

      // Check for specific error types
      const message = errorMessage.includes("Unique constraint")
        ? "A user with this ID or email already exists"
        : `Database error: ${errorMessage}`;

      return NextResponse.json({ message }, { status: 500 });
    }

    return NextResponse.json({
      message: user ? "User processed successfully" : "User not found",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        githubUsername: user.githubUsername,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Unexpected error processing user:", error);
    return NextResponse.json(
      { message: `Failed to process user data: ${errorMessage}` },
      { status: 500 }
    );
  }
}
