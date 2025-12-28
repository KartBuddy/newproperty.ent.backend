import { configDotenv } from "dotenv";

configDotenv();

export const getEnv = (key, defaultValue) => {
  const val = process.env[key] ?? defaultValue;
  if (!val) {
    throw new Error(`Environment variable ${key} is not set.`);
  }

  return val;
};
