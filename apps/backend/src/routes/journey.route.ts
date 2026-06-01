import { Router } from "express";

import { JourneyController } from "../controllers/journey.controller.js";
import { requireAdmin, requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();
const journeyController = new JourneyController();

router.use(requireAuth, requireAdmin);

/**
 * Create journey
 */
router.post("/", journeyController.createJourney.bind(journeyController));

/**
 * List journeys
 * ?page=&limit=&search=&route=&bus=&operator=&status=scheduled|in_progress|completed|cancelled&is_active=true|false&departure_from=&departure_to=
 */
router.get("/", journeyController.getJourneys.bind(journeyController));

/**
 * Get journey by ID
 */
router.get("/:id", journeyController.getJourneyById.bind(journeyController));

/**
 * Update journey
 */
router.patch("/:id", journeyController.updateJourney.bind(journeyController));

/**
 * Delete journey
 */
router.delete("/:id", journeyController.deleteJourney.bind(journeyController));

export default router;
