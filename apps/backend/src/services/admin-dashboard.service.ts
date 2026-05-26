import type {
	AuthProvider,
	IUser,
	UserRole,
} from "../interfaces/user.interface.js";

import type {
	AccountHealthData,
	AuthProviderBreakdownItem,
	DashboardAnalyticsData,
	DashboardKpis,
	DashboardUserSnapshot,
	FullDashboardData,
	NotificationPreferencesData,
	QuickActionsData,
	RoleBreakdownItem,
	WalletRewardsData,
} from "../interfaces/admin-dashboard.interface.js";

import { AdminDashboardRepository } from "../repositories/admin-dashboard.repository.js";

const ALL_ROLES: UserRole[] = ["USER", "ADMIN", "OPERATOR"];
const ALL_PROVIDERS: AuthProvider[] = ["LOCAL", "GOOGLE"];

const toPercentage = (count: number, total: number): number => {
	if (total === 0) {
		return 0;
	}

	return Math.round((count / total) * 1000) / 10;
};

export class AdminDashboardService {
	private readonly repository = new AdminDashboardRepository();

	private mapUserToSnapshot(user: IUser): DashboardUserSnapshot {
		return {
			id: user._id.toString(),
			full_name: user.full_name,
			email: user.email,
			country_code: user.country_code,
			phone_number: user.phone_number,
			profile_picture: user.profile_picture ?? null,
			role: user.role,
			auth_provider: user.auth_provider ?? "LOCAL",
			is_verified: user.is_verified ?? false,
			is_active: user.is_active ?? true,
			wallet_balance: user.wallet_balance ?? 0,
			reward_points: user.reward_points ?? 0,
			last_login_at: user.last_login_at
				? new Date(user.last_login_at).toISOString()
				: null,
			preferences: {
				email_notifications:
					user.preferences?.email_notifications ?? true,
				sms_notifications: user.preferences?.sms_notifications ?? true,
			},
			createdAt: new Date(user.createdAt).toISOString(),
		};
	}

	public async getKpis(): Promise<DashboardKpis> {
		return this.repository.getKpis();
	}

	public async getQuickActions(): Promise<QuickActionsData> {
		const kpis = await this.getKpis();

		const [activeOperators, inactiveOperators] = await Promise.all([
			this.repository.countByFilter({
				role: "OPERATOR",
				is_active: true,
			}),
			this.repository.countByFilter({
				role: "OPERATOR",
				is_active: false,
			}),
		]);

		return {
			customers: {
				count: kpis.passengers,
				role: "USER",
				href: "/customers",
			},
			admins: {
				count: kpis.admins,
				role: "ADMIN",
				href: "/admins",
			},
			operators: {
				count: kpis.operators,
				role: "OPERATOR",
				activeCount: activeOperators,
				href: "/operators",
			},
			inactiveOperators: {
				count: inactiveOperators,
				role: "OPERATOR",
				is_active: false,
				href: "/operators?status=inactive",
			},
			inactiveUsers: {
				count: kpis.inactiveUsers,
				is_active: false,
				href: "/customers?status=inactive",
			},
			payments: {
				count: kpis.totalUsers,
				href: "/payments",
				totalWalletBalance: kpis.totalWalletBalance,
			},
		};
	}

	public async getRoleBreakdown(): Promise<RoleBreakdownItem[]> {
		const rows = await this.repository.getRoleCounts();
		const total = rows.reduce((sum, row) => sum + row.count, 0);

		return ALL_ROLES.map((role) => {
			const count = rows.find((row) => row._id === role)?.count ?? 0;

			return {
				role,
				count,
				percentage: toPercentage(count, total),
			};
		});
	}

	public async getAuthProviderBreakdown(): Promise<AuthProviderBreakdownItem[]> {
		const rows = await this.repository.getAuthProviderCounts();
		const total = rows.reduce((sum, row) => sum + row.count, 0);

		return ALL_PROVIDERS.map((provider) => {
			const count = rows.find((row) => row._id === provider)?.count ?? 0;

			return {
				provider,
				count,
				percentage: toPercentage(count, total),
			};
		});
	}

	public async getNotificationPreferences(): Promise<NotificationPreferencesData> {
		const kpis = await this.getKpis();

		return {
			emailNotificationsOn: kpis.emailNotificationsOn,
			smsNotificationsOn: kpis.smsNotificationsOn,
			emailOptInPercent: toPercentage(
				kpis.emailNotificationsOn,
				kpis.totalUsers,
			),
			smsOptInPercent: toPercentage(kpis.smsNotificationsOn, kpis.totalUsers),
			totalUsers: kpis.totalUsers,
		};
	}

	public async getAccountHealth(): Promise<AccountHealthData> {
		const kpis = await this.getKpis();
		const total = kpis.totalUsers;

		return {
			verified: {
				count: kpis.verifiedUsers,
				percentage: toPercentage(kpis.verifiedUsers, total),
				field: "is_verified",
			},
			active: {
				count: kpis.activeUsers,
				percentage: toPercentage(kpis.activeUsers, total),
				field: "is_active",
			},
			pendingVerification: {
				count: kpis.pendingVerification,
				percentage: toPercentage(kpis.pendingVerification, total),
				field: "is_verified: false",
			},
			inactive: {
				count: kpis.inactiveUsers,
				percentage: toPercentage(kpis.inactiveUsers, total),
				field: "is_active: false",
			},
		};
	}

	public async getWalletRewards(topLimit = 3): Promise<WalletRewardsData> {
		const kpis = await this.getKpis();

		const [topWalletUsers, topRewardUsers] = await Promise.all([
			this.repository.findTopUsersByField("wallet_balance", topLimit),
			this.repository.findTopUsersByField("reward_points", topLimit),
		]);

		return {
			totalWalletBalance: kpis.totalWalletBalance,
			totalRewardPoints: kpis.totalRewardPoints,
			topWalletUsers: topWalletUsers.map((user) =>
				this.mapUserToSnapshot(user),
			),
			topRewardUsers: topRewardUsers.map((user) =>
				this.mapUserToSnapshot(user),
			),
		};
	}

	public async getAnalytics(topLimit = 3): Promise<DashboardAnalyticsData> {
		const [
			roleBreakdown,
			authProviderBreakdown,
			notificationPreferences,
			accountHealth,
			walletRewards,
		] = await Promise.all([
			this.getRoleBreakdown(),
			this.getAuthProviderBreakdown(),
			this.getNotificationPreferences(),
			this.getAccountHealth(),
			this.getWalletRewards(topLimit),
		]);

		return {
			roleBreakdown,
			authProviderBreakdown,
			notificationPreferences,
			accountHealth,
			walletRewards,
		};
	}

	public async getRecentAccounts(options?: {
		limit?: number;
		sort?: "createdAt" | "last_login_at";
		order?: "asc" | "desc";
	}): Promise<DashboardUserSnapshot[]> {
		const limit = Math.min(Math.max(options?.limit ?? 5, 1), 50);
		const sort = options?.sort ?? "createdAt";
		const order = options?.order ?? "desc";

		const users = await this.repository.findRecentAccounts({
			limit,
			sort,
			order,
		});

		return users.map((user) => this.mapUserToSnapshot(user));
	}

	public async getFullDashboard(options?: {
		recentLimit?: number;
		topLimit?: number;
	}): Promise<FullDashboardData> {
		const recentLimit = options?.recentLimit ?? 5;
		const topLimit = options?.topLimit ?? 3;

		const [kpis, quickActions, analytics, recentAccounts] = await Promise.all([
			this.getKpis(),
			this.getQuickActions(),
			this.getAnalytics(topLimit),
			this.getRecentAccounts({ limit: recentLimit }),
		]);

		return {
			kpis,
			quickActions,
			analytics,
			recentAccounts,
		};
	}
}
