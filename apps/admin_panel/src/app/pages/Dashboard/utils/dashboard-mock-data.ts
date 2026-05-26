import type {
  AuthProviderBreakdown,
  DashboardKpis,
  DashboardUserSnapshot,
  RoleBreakdown,
} from './dashboard-types';

export const DASHBOARD_KPIS: DashboardKpis = {
  totalUsers: 12_847,
  activeUsers: 11_203,
  verifiedUsers: 10_456,
  pendingVerification: 1_391,
  inactiveUsers: 1_644,
  operators: 48,
  admins: 12,
  passengers: 12_787,
  totalWalletBalance: 2_847_650,
  totalRewardPoints: 486_320,
  localAuthUsers: 9_124,
  googleAuthUsers: 3_723,
  emailNotificationsOn: 10_892,
  smsNotificationsOn: 8_456,
};

export const ROLE_BREAKDOWN: RoleBreakdown[] = [
  { role: 'USER', count: 12_787, percentage: 99.5 },
  { role: 'OPERATOR', count: 48, percentage: 0.37 },
  { role: 'ADMIN', count: 12, percentage: 0.09 },
];

export const AUTH_PROVIDER_BREAKDOWN: AuthProviderBreakdown[] = [
  { provider: 'LOCAL', count: 9_124, percentage: 71 },
  { provider: 'GOOGLE', count: 3_723, percentage: 29 },
];

export const RECENT_USERS: DashboardUserSnapshot[] = [
  {
    id: '1',
    full_name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    country_code: '+91',
    phone_number: '9876543210',
    profile_picture: null,
    role: 'USER',
    auth_provider: 'LOCAL',
    is_verified: true,
    is_active: true,
    wallet_balance: 1250,
    reward_points: 340,
    last_login_at: '2026-05-26T08:42:00Z',
    preferences: { email_notifications: true, sms_notifications: true },
    createdAt: '2026-05-20T10:00:00Z',
  },
  {
    id: '2',
    full_name: 'Rajesh Kumar',
    email: 'rajesh.k@email.com',
    country_code: '+91',
    phone_number: '9123456789',
    profile_picture: null,
    role: 'OPERATOR',
    auth_provider: 'GOOGLE',
    is_verified: true,
    is_active: true,
    wallet_balance: 0,
    reward_points: 120,
    last_login_at: '2026-05-26T07:15:00Z',
    preferences: { email_notifications: true, sms_notifications: false },
    createdAt: '2026-04-12T14:30:00Z',
  },
  {
    id: '3',
    full_name: 'Ananya Patel',
    email: 'ananya.p@email.com',
    country_code: '+91',
    phone_number: '9988776655',
    profile_picture: null,
    role: 'USER',
    auth_provider: 'LOCAL',
    is_verified: false,
    is_active: true,
    wallet_balance: 450,
    reward_points: 85,
    last_login_at: '2026-05-25T18:30:00Z',
    preferences: { email_notifications: false, sms_notifications: true },
    createdAt: '2026-05-24T09:20:00Z',
  },
  {
    id: '4',
    full_name: 'Vikram Singh',
    email: 'vikram.s@email.com',
    country_code: '+91',
    phone_number: '9765432109',
    profile_picture: null,
    role: 'ADMIN',
    auth_provider: 'LOCAL',
    is_verified: true,
    is_active: true,
    wallet_balance: 5000,
    reward_points: 1200,
    last_login_at: '2026-05-26T09:00:00Z',
    preferences: { email_notifications: true, sms_notifications: true },
    createdAt: '2025-11-01T08:00:00Z',
  },
  {
    id: '5',
    full_name: 'Meera Nair',
    email: 'meera.n@email.com',
    country_code: '+91',
    phone_number: '9654321098',
    profile_picture: null,
    role: 'USER',
    auth_provider: 'GOOGLE',
    is_verified: true,
    is_active: false,
    wallet_balance: 780,
    reward_points: 210,
    last_login_at: '2026-05-10T12:00:00Z',
    preferences: { email_notifications: true, sms_notifications: false },
    createdAt: '2026-03-15T16:45:00Z',
  },
];

export const TOP_WALLET_USERS = [...RECENT_USERS]
  .sort((a, b) => b.wallet_balance - a.wallet_balance)
  .slice(0, 3);

export const TOP_REWARD_USERS = [...RECENT_USERS]
  .sort((a, b) => b.reward_points - a.reward_points)
  .slice(0, 3);
