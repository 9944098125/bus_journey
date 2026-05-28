import { Router } from "express";

import { OperatorController } from "../controllers/operator.controller.js";
import { requireAdmin, requireAuth } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();
const operatorController = new OperatorController();

router.use(requireAuth, requireAdmin);

/**
 * Create operator
 */
router.post("/", operatorController.createOperator.bind(operatorController));

/**
 * Upload driver photo
 */
router.post(
  "/upload-driver-photo",
  upload.single("driver_photo"),
  operatorController.uploadDriverPhoto.bind(operatorController)
);

/**
 * Upload driving license
 */
router.post(
  "/upload-driving-license",
  upload.single("driving_license"),
  operatorController.uploadDrivingLicense.bind(operatorController)
);

/**
 * List operators (?status=active|inactive or ?is_active=true|false)
 */
router.get("/", operatorController.getAllOperators.bind(operatorController));

/**
 * Get operator by ID
 */
router.get("/:id", operatorController.getOperatorById.bind(operatorController));

/**
 * Update operator
 */
router.patch(
  "/:id",
  operatorController.updateOperator.bind(operatorController)
);

/**
 * Delete operator
 */
router.delete(
  "/:id",
  operatorController.deleteOperator.bind(operatorController)
);

export default router;
