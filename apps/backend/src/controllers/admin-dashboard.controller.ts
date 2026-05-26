import type { NextFunction, Request, Response } from "express";

import { AdminDashboardService } from "../services/admin-dashboard.service.js";

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
		_req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const data = await this.dashboardService.getKpis();

			res.status(200).json({
				success: true,
				data,
			});
		} catch (error) {
			next(error);
		}
	}

	public async getQuickActions(
		_req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const data = await this.dashboardService.getQuickActions();

			res.status(200).json({
				success: true,
				data,
			});
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

			res.status(200).json({
				success: true,
				data,
			});
		} catch (error) {
			next(error);
		}
	}

	public async getRoleBreakdown(
		_req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const data = await this.dashboardService.getRoleBreakdown();

			res.status(200).json({
				success: true,
				data,
			});
		} catch (error) {
			next(error);
		}
	}

	public async getAuthProviders(
		_req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const data = await this.dashboardService.getAuthProviderBreakdown();

			res.status(200).json({
				success: true,
				data,
			});
		} catch (error) {
			next(error);
		}
	}

	public async getNotificationPreferences(
		_req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const data = await this.dashboardService.getNotificationPreferences();

			res.status(200).json({
				success: true,
				data,
			});
		} catch (error) {
			next(error);
		}
	}

	public async getAccountHealth(
		_req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const data = await this.dashboardService.getAccountHealth();

			res.status(200).json({
				success: true,
				data,
			});
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

			res.status(200).json({
				success: true,
				data,
			});
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

			res.status(200).json({
				success: true,
				count: data.length,
				data,
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

			res.status(200).json({
				success: true,
				data,
			});
		} catch (error) {
			next(error);
		}
	}
}
