import jwt from "jsonwebtoken";
import { Env } from "../config/env.config.js";

export const authMiddleware = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "No token provided",
        });
    }

    try {
        const decoded = jwt.verify(token, Env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }
};
