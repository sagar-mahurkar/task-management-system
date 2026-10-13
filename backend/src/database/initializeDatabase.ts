import { Client } from "pg";

const databaseName = process.env.DATABASE_NAME;

export async function initializeDatabase(): Promise<void> {
  const {
    DATABASE_HOST,
    DATABASE_PORT,
    DATABASE_USER,
    DATABASE_PASSWORD,
  } = process.env;

  if (
    !databaseName ||
    !DATABASE_HOST ||
    !DATABASE_PORT ||
    !DATABASE_USER ||
    DATABASE_PASSWORD === undefined
  ) {
    throw new Error("Missing required database configuration.");
  }

  const client = new Client({
    host: DATABASE_HOST,
    port: Number(DATABASE_PORT),
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: "postgres",
  });

  await client.connect();

  try {
    const result = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [databaseName],
    );

    if (result.rowCount === 0) {
      // PostgreSQL does not support parameters for database identifiers.
      // Escape double quotes to safely quote the configured identifier.
      const quotedDatabaseName = `"${databaseName.replace(/"/g, '""')}"`;

      await client.query(`CREATE DATABASE ${quotedDatabaseName}`);
      console.log(`Database "${databaseName}" created.`);
    } else {
      console.log(`Database "${databaseName}" already exists.`);
    }
  } finally {
    await client.end();
  }
}
