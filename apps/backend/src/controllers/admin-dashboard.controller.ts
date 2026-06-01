import type { NextFunction, Request, Response } from "express";

import { AdminDashboardService } from "../services/admin-dashboard.service.js";
import { sendItem, sendList } from "../utils/api-response.js";

const parsePositiveInt = (
	value: unknown,
	defaultValue: number,
	max: number,
): number => {
	const parsed = Number.parseInt(String(value ?? ""), 10);

	if (Number.isNaN(parsed) || parsed < 1) {
		return defaultValue;
	}

	return Math.min(parsed, max);
};

export class AdminDashboardController {
	private readonly dashboardService = new AdminDashboardService();

	public async getKpis(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const data = await this.dashboardService.getKpis();

			sendItem(req, res, "KPIs fetched successfully", data);
		} catch (error) {
			next(error);
		}
	}

	public async getQuickActions(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const data = await this.dashboardService.getQuickActions();

			sendItem(req, res, "Quick actions fetched successfully", data);
		} catch (error) {
			next(error);
		}
	}

	public async getAnalytics(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const topLimit = parsePositiveInt(req.query.topLimit, 3, 20);
			const data = await this.dashboardService.getAnalytics(topLimit);

			sendItem(req, res, "Analytics fetched successfully", data);
		} catch (error) {
			next(error);
		}
	}

	public async getRoleBreakdown(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const data = await this.dashboardService.getRoleBreakdown();

			sendItem(req, res, "Role breakdown fetched successfully", data);
		} catch (error) {
			next(error);
		}
	}

	public async getAuthProviders(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const data = await this.dashboardService.getAuthProviderBreakdown();

			sendItem(req, res, "Auth providers fetched successfully", data);
		} catch (error) {
			next(error);
		}
	}

	public async getNotificationPreferences(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const data = await this.dashboardService.getNotificationPreferences();

			sendItem(req, res, "Notification preferences fetched successfully", data);
		} catch (error) {
			next(error);
		}
	}

	public async getAccountHealth(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const data = await this.dashboardService.getAccountHealth();

			sendItem(req, res, "Account health fetched successfully", data);
		} catch (error) {
			next(error);
		}
	}

	public async getWalletRewards(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const topLimit = parsePositiveInt(req.query.topLimit, 3, 20);
			const data = await this.dashboardService.getWalletRewards(topLimit);

			sendItem(req, res, "Wallet rewards fetched successfully", data);
		} catch (error) {
			next(error);
		}
	}

	public async getRecentAccounts(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const limit = parsePositiveInt(req.query.limit, 5, 50);
			const sortParam = req.query.sort;
			const orderParam = req.query.order;

			const sort =
				sortParam === "last_login_at" ? "last_login_at" : "createdAt";
			const order = orderParam === "asc" ? "asc" : "desc";

			const data = await this.dashboardService.getRecentAccounts({
				limit,
				sort,
				order,
			});

			sendList(req, res, "Recent accounts fetched successfully", {
				pageNumber: 1,
				pageSize: limit,
				totalDocuments: data.length,
				totalPages: 1,
				documents: data,
			});
		} catch (error) {
			next(error);
		}
	}

	public async getFullDashboard(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const recentLimit = parsePositiveInt(req.query.recentLimit, 5, 50);
			const topLimit = parsePositiveInt(req.query.topLimit, 3, 20);

			const data = await this.dashboardService.getFullDashboard({
				recentLimit,
				topLimit,
			});

			sendItem(req, res, "Dashboard fetched successfully", data);
		} catch (error) {
			next(error);
		}
	}
}
