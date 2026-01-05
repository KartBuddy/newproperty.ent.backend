import express from "express";
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

configDotenv();

import { Env } from "./src/config/env.config.js";
import pool from "./src/config/db.config.js";
import authRoutes from "./src/routes/auth/auth.routes.js";
import propertiesRoutes from "./src/routes/properties/properties.route.js";
import inquiryRoutes from "./src/routes/properties/inquiry.route.js";
import dashboardRoutes from "./src/routes/dashboard/dashboard.routes.js";
import contactRoutes from "./src/routes/contact/contact.routes.js";

const app = express();

const allowedOrigins = [
  "https://newproperty.co.in",
  "https://www.newproperty.co.in",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertiesRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/contact", contactRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const startServer = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("Database connected");

    app.listen(Env.PORT, () => {
      console.log(`Server running on PORT:${Env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
