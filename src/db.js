import pkg from "pg";
import { DB_NAME, DB_PORT, DB_HOST, DB_USER, DB_PASSWORD } from "./config.js";

const { Pool } = pkg;

export const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
});

pool.query("SELECT NOW()")
  .then((res) => console.log("DB OK:", res.rows[0]))
  .catch((err) => console.error("DB ERROR:", err.message));
