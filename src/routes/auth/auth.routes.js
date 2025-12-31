import express from "express";
import AuthController from "../../modules/auth/controllers/auth.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);
router.patch("/update-profile", authMiddleware, AuthController.updateProfile);
router.patch("/update-password", authMiddleware, AuthController.updatePassword);

export default router;
