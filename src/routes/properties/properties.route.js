import express from "express";
import PropertiesController from "../../modules/properties/properties.controller.js";

const router = express.Router();

router.get("/", PropertiesController.getAll);
router.post("/create", PropertiesController.create);
router.get("/:propertyId", PropertiesController.getSingle);
router.put("/:propertyId", PropertiesController.update);
router.delete("/:propertyId", PropertiesController.delete);

export default router;
