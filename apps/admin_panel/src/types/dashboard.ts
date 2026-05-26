import type { AuthProvider, UserRole } from './user';

/** Matches backend admin-dashboard.interface.ts */

export interface DashboardUserSnapshot {
  id: string;
  full_name: string;
  email: string;
  country_code: string;
  phone_number: string;
  profile_picture: string | null;
  role: UserRole;
  auth_provider: AuthProvider;
  is_verified: boolean;
  is_active: boolean;
  wallet_balance: number;
  reward_points: number;
  last_login_at: string | null;
  preferences: {
    email_notifications: boolean;
    sms_notifications: boolean;
  };
  createdAt: string;
}

export interface DashboardKpis {
  totalUsers: number;
  activeUsers: number;
  verifiedUsers: number;
  pendingVerification: number;
  inactiveUsers: number;
  operators: number;
  admins: number;
  passengers: number;
  totalWalletBalance: number;
  totalRewardPoints: number;
  localAuthUsers: number;
  googleAuthUsers: number;
  emailNotificationsOn: number;
  smsNotificationsOn: number;
}

export interface RoleBreakdownItem {
  role: UserRole;
  count: number;
  percentage: number;
}

export interface AuthProviderBreakdownItem {
  provider: AuthProvider;
  count: number;
  percentage: number;
}

export interface AccountHealthMetric {
  count: number;
  percentage: number;
  field: string;
}

export interface AccountHealthData {
  verified: AccountHealthMetric;
  active: AccountHealthMetric;
  pendingVerification: AccountHealthMetric;
  inactive: AccountHealthMetric;
}

export interface NotificationPreferencesData {
  emailNotificationsOn: number;
  smsNotificationsOn: number;
  emailOptInPercent: number;
  smsOptInPercent: number;
  totalUsers: number;
}

export interface WalletRewardsData {
  totalWalletBalance: number;
  totalRewardPoints: number;
  topWalletUsers: DashboardUserSnapshot[];
  topRewardUsers: DashboardUserSnapshot[];
}

export interface QuickActionItem {
  count: number;
  role?: UserRole;
  is_active?: boolean;
  href: string;
  activeCount?: number;
  totalWalletBalance?: number;
}

export interface QuickActionsData {
  customers: QuickActionItem;
  admins: QuickActionItem;
  operators: QuickActionItem;
  inactiveOperators: QuickActionItem;
  inactiveUsers: QuickActionItem;
  payments: QuickActionItem;
}

export interface DashboardAnalyticsData {
  roleBreakdown: RoleBreakdownItem[];
  authProviderBreakdown: AuthProviderBreakdownItem[];
  notificationPreferences: NotificationPreferencesData;
  accountHealth: AccountHealthData;
  walletRewards: WalletRewardsData;
}

export interface FullDashboardData {
  kpis: DashboardKpis;
  quickActions: QuickActionsData;
  analytics: DashboardAnalyticsData;
  recentAccounts: DashboardUserSnapshot[];
}

export interface DashboardApiResponse<T> {
  success: boolean;
  data: T;
}

export interface FullDashboardQueryParams {
  recentLimit?: number;
  topLimit?: number;
}

export interface WalletRewardsQueryParams {
  topLimit?: number;
}

export interface RecentAccountsQueryParams {
  limit?: number;
  sort?: 'createdAt' | 'last_login_at';
  order?: 'asc' | 'desc';
}

export interface RecentAccountsResponse {
  success: boolean;
  count: number;
  data: DashboardUserSnapshot[];
}
