import { Router } from "express";

import { BusController } from "../controllers/bus.controller.js";
import { requireAdmin, requireAuth } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();
const busController = new BusController();

router.use(requireAuth, requireAdmin);

/**
 * Create bus
 */
router.post("/", busController.createBus.bind(busController));



/**
 * List buses
 */
router.get("/", busController.getBuses.bind(busController));

/**
 * Get bus by ID
 */
router.get("/:id", busController.getBusById.bind(busController));

/**
 * Update bus
 */
router.patch("/:id", busController.updateBus.bind(busController));

/**
 * Delete bus
 */
router.delete("/:id", busController.deleteBus.bind(busController));

/**
 * Upload bus photo
 */
router.post(
  "/upload-bus-photo",
  upload.single("bus_photo"),
  busController.uploadBusPhoto.bind(busController)
);

export default router;
