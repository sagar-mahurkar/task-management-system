import "reflect-metadata";
import { DataSource } from "typeorm";
import { Task } from "../entities/Task";
import { User } from "../entities/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT ?? 5432),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,

  entities: [User, Task],

  synchronize: false,
  logging: process.env.NODE_ENV === "development",
});

/**
 * Initializes the application schema for the local MVP.
 *
 * Synchronization is permitted only when the public schema contains
 * no tables. Existing schemas are never synchronized automatically.
 */
export async function initializeSchema(): Promise<void> {
  const tables: Array<{ tablename: string }> = await AppDataSource.query(`
    SELECT tablename
    FROM pg_catalog.pg_tables
    WHERE schemaname = 'public'
  `);

  const existingTables = new Set(tables.map((table) => table.tablename));
  const requiredTables = ["users", "tasks"];

  if (existingTables.size === 0) {
    await AppDataSource.synchronize();
    console.log("Application schema initialized.");
    return;
  }

  const existingRequiredTables = requiredTables.filter((tableName) =>
    existingTables.has(tableName),
  );

  if (existingRequiredTables.length === requiredTables.length) {
    console.log("Application tables already exist; synchronization skipped.");
    return;
  }

  throw new Error(
    [
      "Refusing automatic schema synchronization.",
      "The public schema is not empty and the application tables are incomplete.",
      "Inspect the existing schema and apply a controlled migration.",
    ].join(" "),
  );
}
