import { Pool } from "pg";
import { Env } from "./env.config.js";

const pool = new Pool({
  user: Env.DB_USER,
  host: Env.DB_HOST,
  database: Env.DB_NAME,
  password: Env.DB_PASSWORD,
  port: Env.DB_PORT,
});

pool.on("connect", () => {
  console.log("PostgreSQL pool connected");
});

pool.on("error", (err) => {
  console.error("Unexpected DB error", err);
  process.exit(1);
});

export default pool;
