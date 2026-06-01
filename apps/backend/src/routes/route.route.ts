import { Router } from "express";

import { RouteController } from "../controllers/route.controller.js";
import { requireAdmin, requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();
const routeController = new RouteController();

router.use(requireAuth, requireAdmin);

/**
 * Create route
 */
router.post("/", routeController.createRoute.bind(routeController));

/**
 * List routes (?page=&limit=&search=&operator=&source_city=&destination_city=&status=active|inactive)
 */
router.get("/", routeController.getRoutes.bind(routeController));

/**
 * Get route by ID
 */
router.get("/:id", routeController.getRouteById.bind(routeController));

/**
 * Update route
 */
router.patch("/:id", routeController.updateRoute.bind(routeController));

/**
 * Delete route
 */
router.delete("/:id", routeController.deleteRoute.bind(routeController));

export default router;
