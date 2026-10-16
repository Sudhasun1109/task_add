import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // For a hosted PostgreSQL provider that requires SSL, configure SSL
  // according to that provider's documentation.
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error.message);
});
