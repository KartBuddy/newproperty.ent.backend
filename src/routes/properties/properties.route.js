import express from "express";
import PropertiesController from "../../modules/properties/properties.controller.js";
import { upload } from "../../middlewares/upload.middleware.js";

const router = express.Router();

router.get("/", PropertiesController.getAll);
router.post("/create", upload.array("images", 10), PropertiesController.create);
router.get("/:propertyId", PropertiesController.getSingle);
router.put("/:propertyId", upload.array("images", 10), PropertiesController.update);

router.delete("/:propertyId", PropertiesController.delete);
router.patch("/:propertyId/toggle-like", PropertiesController.toggleLike);

export default router;
