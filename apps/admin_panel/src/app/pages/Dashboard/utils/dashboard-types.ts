import type { AuthProvider, UserRole } from 'types/user';

/** Snapshot row aligned with backend IUser fields (static until API wiring). */
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

export interface RoleBreakdown {
  role: UserRole;
  count: number;
  percentage: number;
}

export interface AuthProviderBreakdown {
  provider: AuthProvider;
  count: number;
  percentage: number;
}
