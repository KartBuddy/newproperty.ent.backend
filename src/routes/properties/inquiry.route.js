import express from "express";
import InquiryController from "../../modules/properties/inquiry.controller.js";

const router = express.Router();

router.post("/create", InquiryController.create);
router.get("/", InquiryController.getAll);
router.get("/property/:propertyId", InquiryController.getByPropertyId); // inquiries for property (admin)
router.get("/:id", InquiryController.getById);
router.delete("/:id", InquiryController.delete);

export default router;
