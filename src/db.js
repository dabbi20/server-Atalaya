import pg from "pg";
import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
  DATABASE_URL,
} from "./config.js";

export const pool = new pg.Pool(
  DATABASE_URL
    ? {
        connectionString: DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        user: DB_USER,
        host: DB_HOST,
        password: DB_PASSWORD,
        database: DB_NAME,
        port: Number(DB_PORT),
      }
);

// Verificación de conexión
pool
  .query("SELECT NOW()")
  .then((r) => console.log("✅ DB Connected:", r.rows[0]))
  .catch((err) => console.error("❌ DB Connection Error:", err));

