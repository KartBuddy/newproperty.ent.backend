import express from "express";
import PropertiesController from "../../modules/properties/properties.controller.js";
import { upload } from "../../middlewares/upload.middleware.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/* Public */
router.get("/", PropertiesController.getAll);

router.get(
    "/admin",
    PropertiesController.getAllAdmin
);

router.get(
  "/admin/pending",
  authMiddleware,
  PropertiesController.getPending
);


/* Client */
router.post(
  "/request",
  upload.array("images", 10),
  PropertiesController.requestProperty
);

/* Admin */
router.post(
  "/create",
  authMiddleware,
  upload.array("images", 10),
  PropertiesController.create
);

router.patch(
  "/:propertyId/approval",
  authMiddleware,
  PropertiesController.updateApproval
);

router.put(
  "/:propertyId",
  authMiddleware,
  upload.array("images", 10),
  PropertiesController.update
);

router.delete(
  "/:propertyId",
  authMiddleware,
  PropertiesController.delete
);

router.get("/:propertyId", PropertiesController.getSingle);
router.patch("/:propertyId/toggle-like", PropertiesController.toggleLike);

export default router;
