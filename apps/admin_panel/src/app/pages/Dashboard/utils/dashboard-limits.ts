/** Matches backend parsePositiveInt caps in admin-dashboard.controller.ts */
export const DASHBOARD_TOP_LIMIT_MAX = 20;
export const DASHBOARD_RECENT_LIMIT_MAX = 50;

export const DEFAULT_DASHBOARD_TOP_LIMIT = 3;
export const DEFAULT_DASHBOARD_RECENT_LIMIT = 5;

export const DASHBOARD_TOP_LIMIT_OPTIONS = [3, 5, 10, 15, 20] as const;

export const DASHBOARD_RECENT_LIMIT_OPTIONS = [
  5, 10, 15, 20, 25, 30, 40, 50,
] as const;
