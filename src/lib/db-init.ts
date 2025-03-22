import { prisma } from "./prisma";

/**
 * Initialize the database connection
 * This function is meant to be called during application initialization
 */
export async function initDatabase() {
  try {
    // Initialize Prisma connection
    await prisma.$connect();
    console.log("✅ Database connected successfully");
    return true;
  } catch (error) {
    console.error("❌ Database connection error:", error);
    console.error("Please check your Supabase connection settings:");
    console.error("- Ensure your Supabase project is active");
    console.error("- Verify the connection strings in .env file");
    console.error(
      "- Check that DATABASE_URL and DIRECT_URL are correctly formatted"
    );
    return false;
  }
}

/**
 * Checks if the database connection is valid
 * @returns An object with isConnected status and connection details or error message
 */
export const checkDatabaseConnection = async () => {
  try {
    // Test connection with a simple query
    const result = await prisma.$queryRaw`SELECT 1 as connected`;

    return {
      isConnected: true,
      details: {
        connectionType: process.env.DIRECT_URL
          ? "Pooled (with Direct URL)"
          : "Pooled",
        provider: "PostgreSQL on Supabase",
        host: process.env.NEXT_PUBLIC_DATABASE_HOST || "unknown",
        response: result,
      },
    };
  } catch {
    // If the first query fails, try a simple connection
    try {
      await prisma.$connect();

      return {
        isConnected: true,
        details: {
          connectionType: process.env.DIRECT_URL
            ? "Pooled (with Direct URL)"
            : "Pooled",
          provider: "PostgreSQL on Supabase",
          host: process.env.NEXT_PUBLIC_DATABASE_HOST || "unknown",
          note: "Connected but query execution failed",
        },
      };
    } catch (connectionError) {
      // Define a type for database error
      interface DatabaseError {
        message?: string;
        code?: string;
        stack?: string;
      }

      const dbError = connectionError as DatabaseError;

      return {
        isConnected: false,
        error: {
          message:
            typeof connectionError === "object" && connectionError !== null
              ? dbError.message || "Unknown connection error"
              : "Unknown connection error",
          code:
            typeof connectionError === "object" && connectionError !== null
              ? dbError.code
              : undefined,
          stack:
            process.env.NODE_ENV === "development" &&
            typeof connectionError === "object" &&
            connectionError !== null
              ? dbError.stack
              : undefined,
        },
      };
    }
  }
};
