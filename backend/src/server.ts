import "dotenv/config";
import app from "./app";
import { initializeDatabase } from "./database/initializeDatabase";
import { AppDataSource, initializeSchema } from "./database/dataSource";

async function startServer(): Promise<void> {
  const port = Number(process.env.PORT ?? 3000);

  try {
    // 1. Create the configured database if it does not exist.
    await initializeDatabase();

    // 2. Initialize the ORM and register entity metadata.
    await AppDataSource.initialize();
    console.log("Database connection established.");

    // 3. Initialize tables only when the public schema is empty.
    await initializeSchema();

    // 4. Start accepting HTTP requests.
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.error("Application startup failed:", error);

    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }

    process.exitCode = 1;
  }
}

void startServer();
