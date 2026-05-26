import { Users } from "../models/user.model.js";

import type {
	AuthProvider,
	IUser,
	UserRole,
} from "../interfaces/user.interface.js";

import type { DashboardKpis } from "../interfaces/admin-dashboard.interface.js";

type RoleCountRow = { _id: UserRole; count: number };

type ProviderCountRow = { _id: AuthProvider; count: number };

type MetricsRow = {
	totalUsers: number;
	activeUsers: number;
	verifiedUsers: number;
	inactiveUsers: number;
	totalWalletBalance: number;
	totalRewardPoints: number;
	emailNotificationsOn: number;
	smsNotificationsOn: number;
	localAuthUsers: number;
	googleAuthUsers: number;
};

/** Treat missing DB fields like schema defaults (legacy users). */
const NORMALIZE_USER_FIELDS_STAGE = {
	$addFields: {
		auth_provider: { $ifNull: ["$auth_provider", "LOCAL"] },
		is_active: { $ifNull: ["$is_active", true] },
		wallet_balance: { $ifNull: ["$wallet_balance", 0] },
		reward_points: { $ifNull: ["$reward_points", 0] },
		email_notifications: {
			$ifNull: ["$preferences.email_notifications", true],
		},
		sms_notifications: {
			$ifNull: ["$preferences.sms_notifications", true],
		},
	},
} as const;

const EMPTY_METRICS: MetricsRow = {
	totalUsers: 0,
	activeUsers: 0,
	verifiedUsers: 0,
	inactiveUsers: 0,
	totalWalletBalance: 0,
	totalRewardPoints: 0,
	emailNotificationsOn: 0,
	smsNotificationsOn: 0,
	localAuthUsers: 0,
	googleAuthUsers: 0,
};

const USER_PUBLIC_FIELDS = "-password";

export class AdminDashboardRepository {
	/**
	 * Core metrics + per-role counts in a single aggregation.
	 */
	public async aggregateMetricsAndRoles(): Promise<{
		metrics: MetricsRow;
		byRole: RoleCountRow[];
	}> {
		const [result] = await Users.aggregate<{
			metrics: MetricsRow[];
			byRole: RoleCountRow[];
		}>([
			NORMALIZE_USER_FIELDS_STAGE,
			{
				$facet: {
					metrics: [
						{
							$group: {
								_id: null,
								totalUsers: { $sum: 1 },
								activeUsers: {
									$sum: {
										$cond: [{ $eq: ["$is_active", true] }, 1, 0],
									},
								},
								verifiedUsers: {
									$sum: {
										$cond: [{ $eq: ["$is_verified", true] }, 1, 0],
									},
								},
								inactiveUsers: {
									$sum: {
										$cond: [{ $eq: ["$is_active", false] }, 1, 0],
									},
								},
								totalWalletBalance: { $sum: "$wallet_balance" },
								totalRewardPoints: { $sum: "$reward_points" },
								emailNotificationsOn: {
									$sum: {
										$cond: [
											{ $eq: ["$email_notifications", true] },
											1,
											0,
										],
									},
								},
								smsNotificationsOn: {
									$sum: {
										$cond: [
											{ $eq: ["$sms_notifications", true] },
											1,
											0,
										],
									},
								},
								localAuthUsers: {
									$sum: {
										$cond: [
											{ $eq: ["$auth_provider", "LOCAL"] },
											1,
											0,
										],
									},
								},
								googleAuthUsers: {
									$sum: {
										$cond: [
											{ $eq: ["$auth_provider", "GOOGLE"] },
											1,
											0,
										],
									},
								},
							},
						},
					],
					byRole: [{ $group: { _id: "$role", count: { $sum: 1 } } }],
				},
			},
		]);

		return {
			metrics: result?.metrics?.[0] ?? EMPTY_METRICS,
			byRole: result?.byRole ?? [],
		};
	}

	public buildKpisFromAggregate(
		metrics: MetricsRow,
		byRole: RoleCountRow[],
	): DashboardKpis {
		const roleCount = (role: UserRole) =>
			byRole.find((row) => row._id === role)?.count ?? 0;

		const totalUsers = metrics.totalUsers;
		const verifiedUsers = metrics.verifiedUsers;

		return {
			totalUsers,
			activeUsers: metrics.activeUsers,
			verifiedUsers,
			pendingVerification: totalUsers - verifiedUsers,
			inactiveUsers: metrics.inactiveUsers,
			operators: roleCount("OPERATOR"),
			admins: roleCount("ADMIN"),
			passengers: roleCount("USER"),
			totalWalletBalance: metrics.totalWalletBalance,
			totalRewardPoints: metrics.totalRewardPoints,
			localAuthUsers: metrics.localAuthUsers,
			googleAuthUsers: metrics.googleAuthUsers,
			emailNotificationsOn: metrics.emailNotificationsOn,
			smsNotificationsOn: metrics.smsNotificationsOn,
		};
	}

	public async getKpis(): Promise<DashboardKpis> {
		const { metrics, byRole } = await this.aggregateMetricsAndRoles();

		return this.buildKpisFromAggregate(metrics, byRole);
	}

	public async getRoleCounts(): Promise<RoleCountRow[]> {
		return Users.aggregate<RoleCountRow>([
			{ $group: { _id: "$role", count: { $sum: 1 } } },
		]);
	}

	public async getAuthProviderCounts(): Promise<ProviderCountRow[]> {
		return Users.aggregate<ProviderCountRow>([
			NORMALIZE_USER_FIELDS_STAGE,
			{ $group: { _id: "$auth_provider", count: { $sum: 1 } } },
		]);
	}

	public async countByFilter(filter: Record<string, unknown>): Promise<number> {
		return Users.countDocuments(filter);
	}

	public async findTopUsersByField(
		field: "wallet_balance" | "reward_points",
		limit: number,
	): Promise<IUser[]> {
		const users = await Users.find()
			.select(USER_PUBLIC_FIELDS)
			.sort({ [field]: -1 })
			.limit(limit)
			.lean();

		return users as IUser[];
	}

	public async findRecentAccounts(options: {
		limit: number;
		sort: "createdAt" | "last_login_at";
		order: "asc" | "desc";
	}): Promise<IUser[]> {
		const sortDirection = options.order === "asc" ? 1 : -1;

		const users = await Users.find()
			.select(USER_PUBLIC_FIELDS)
			.sort({ [options.sort]: sortDirection })
			.limit(options.limit)
			.lean();

		return users as IUser[];
	}
}
