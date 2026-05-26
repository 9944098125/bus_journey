import type { DashboardState } from '../slice/types';

import {
  DASHBOARD_RECENT_LIMIT_OPTIONS,
  DASHBOARD_TOP_LIMIT_OPTIONS,
  DEFAULT_DASHBOARD_RECENT_LIMIT,
  DEFAULT_DASHBOARD_TOP_LIMIT,
} from './dashboard-limits';

const DASHBOARD_QUERY_STORAGE_KEY = 'asp-admin-dashboard-query';

const isRecentLimit = (value: unknown): value is number =>
  typeof value === 'number' &&
  (DASHBOARD_RECENT_LIMIT_OPTIONS as readonly number[]).includes(value);

const isTopLimit = (value: unknown): value is number =>
  typeof value === 'number' &&
  (DASHBOARD_TOP_LIMIT_OPTIONS as readonly number[]).includes(value);

export function loadDashboardQueryParamsFromSession(): DashboardState {
  if (typeof sessionStorage === 'undefined') {
    return {
      recentLimit: DEFAULT_DASHBOARD_RECENT_LIMIT,
      topLimit: DEFAULT_DASHBOARD_TOP_LIMIT,
    };
  }

  try {
    const raw = sessionStorage.getItem(DASHBOARD_QUERY_STORAGE_KEY);
    if (!raw) {
      return {
        recentLimit: DEFAULT_DASHBOARD_RECENT_LIMIT,
        topLimit: DEFAULT_DASHBOARD_TOP_LIMIT,
      };
    }

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return {
        recentLimit: DEFAULT_DASHBOARD_RECENT_LIMIT,
        topLimit: DEFAULT_DASHBOARD_TOP_LIMIT,
      };
    }

    const { recentLimit, topLimit } = parsed as Record<string, unknown>;

    return {
      recentLimit: isRecentLimit(recentLimit)
        ? recentLimit
        : DEFAULT_DASHBOARD_RECENT_LIMIT,
      topLimit: isTopLimit(topLimit) ? topLimit : DEFAULT_DASHBOARD_TOP_LIMIT,
    };
  } catch {
    return {
      recentLimit: DEFAULT_DASHBOARD_RECENT_LIMIT,
      topLimit: DEFAULT_DASHBOARD_TOP_LIMIT,
    };
  }
}

export function saveDashboardQueryParamsToSession(params: DashboardState): void {
  if (typeof sessionStorage === 'undefined') {
    return;
  }

  try {
    sessionStorage.setItem(
      DASHBOARD_QUERY_STORAGE_KEY,
      JSON.stringify(params),
    );
  } catch {
    // ignore quota / private mode errors
  }
}
