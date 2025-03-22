import { initDatabase } from "@/lib/db-init";

// Self-executing function to initialize the database
const initialize = async () => {
  console.log("🚀 Application initialization started");
  console.log("🔄 Connecting to Supabase...");

  try {
    // Check database connection
    const connected = await initDatabase();

    if (connected) {
      console.log("🔄 Setting up database connections and pooling...");
      // We could add more initialization steps here if needed
    } else {
      console.warn(
        "⚠️ Application will continue but some features may not work properly"
      );
    }
  } catch (error) {
    console.error("Error during initialization:", error);
  }
};

// Only run in server environment, not during static generation
if (typeof window === "undefined") {
  initialize()
    .then(() => console.log("✅ Application initialization completed"))
    .catch((error) =>
      console.error("❌ Application initialization failed:", error)
    );
}

export {};
