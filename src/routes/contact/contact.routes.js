import express from "express";
import ContactController from "../../modules/contact/contact.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", ContactController.submitContact);
router.get("/", authMiddleware, ContactController.getAllSubmissions);
router.get("/:id", authMiddleware, ContactController.getSubmissionById);
router.delete("/:id", authMiddleware, ContactController.deleteSubmission);

export default router;
