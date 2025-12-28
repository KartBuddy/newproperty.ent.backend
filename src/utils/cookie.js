import jwt from "jsonwebtoken";
import { Env } from "../config/env.config.js";

const COOKIE_NAME = "access_token";
const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

export const setJWTCookie = (res, user) => {
  const { id, email } = user;
  const payload = {
    id,
    email,
  };

  const token = jwt.sign(payload, Env.JWT_SECRET, {
    expiresIn: Env.JWT_EXPIRES_IN || "7d",
    audience: "user",
    issuer: "kartbuddy-real-estate",
  });

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: Env.NODE_ENV === "production",
    sameSite: Env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: ONE_WEEK,
    path: "/",
  });
};

export const clearJWTAuthCookie = (res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: Env.NODE_ENV === "production",
    sameSite: Env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
  });
};
