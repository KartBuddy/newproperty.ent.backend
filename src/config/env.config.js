import { getEnv } from "../utils/getEnv.js";

export const Env = {
  NODE_ENV: getEnv("NODE_ENV", "development"),
  PORT: Number(getEnv("PORT", "8000")),

  DB_USER: getEnv("DB_USER"),
  DB_HOST: getEnv("DB_HOST"),
  DB_NAME: getEnv("DB_NAME"),
  DB_PASSWORD: getEnv("DB_PASSWORD"),
  DB_PORT: Number(getEnv("DB_PORT", "5432")),

  JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN"),
  JWT_SECRET: getEnv("JWT_SECRET"),

  FRONTEND_URL: getEnv("FRONTEND_URL", "http://localhost:5173"),
};
