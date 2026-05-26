import { Router } from "express";

import { AdminDashboardController } from "../controllers/admin-dashboard.controller.js";
import { requireAdmin, requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();
const controller = new AdminDashboardController();

router.use(requireAuth, requireAdmin);

/**
 * Full dashboard payload (kpis + quickActions + analytics + recentAccounts)
 */
router.get("/", controller.getFullDashboard.bind(controller));

router.get("/kpis", controller.getKpis.bind(controller));

router.get("/quick-actions", controller.getQuickActions.bind(controller));

router.get("/analytics", controller.getAnalytics.bind(controller));

router.get("/role-breakdown", controller.getRoleBreakdown.bind(controller));

router.get("/auth-providers", controller.getAuthProviders.bind(controller));

router.get(
	"/notification-preferences",
	controller.getNotificationPreferences.bind(controller),
);

router.get("/account-health", controller.getAccountHealth.bind(controller));

router.get("/wallet-rewards", controller.getWalletRewards.bind(controller));

router.get("/recent-accounts", controller.getRecentAccounts.bind(controller));

export default router;
