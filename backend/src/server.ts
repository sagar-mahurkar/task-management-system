import "dotenv/config";
import app from "./app";
import { initializeDatabase } from "./database/initializeDatabase";
import { AppDataSource } from "./database/dataSource";

const port = Number(process.env.PORT ?? 3000);

async function startServer(): Promise<void> {
  try {
    await initializeDatabase();
    await AppDataSource.initialize();

    console.log("Database connection established.");

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exitCode = 1;
  }
}

void startServer();
