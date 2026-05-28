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
