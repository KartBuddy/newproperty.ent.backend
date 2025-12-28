import express from "express";
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

configDotenv();

import { Env } from "./src/config/env.config.js";
import pool from "./src/config/db.config.js";
import authRoutes from "./src/routes/auth/auth.routes.js";
import propertiesRoutes from "./src/routes/properties/properties.route.js";

const app = express();

app.use(
  cors({
    origin: Env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertiesRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const startServer = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("Database connected");

    app.listen(Env.PORT, () => {
      console.log(`Server running on http://localhost:${Env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
