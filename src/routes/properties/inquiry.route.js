import express from "express";
import InquiryController from "../../modules/properties/inquiry.controller.js";

const router = express.Router();

router.post("/create", InquiryController.create);
router.get("/", InquiryController.getAll);

export default router;
