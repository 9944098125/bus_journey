import type { PayloadAction } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { useDispatch, useSelector } from 'react-redux';

import { useInjectReducer } from 'utils/redux-injectors';
import { baseQuery, endpoints, formatErrors } from 'utils/api/endpoints';
import type {
  DashboardAnalyticsData,
  DashboardApiResponse,
  DashboardKpis,
  FullDashboardData,
  FullDashboardQueryParams,
  QuickActionsData,
  RecentAccountsQueryParams,
  RecentAccountsResponse,
  WalletRewardsData,
  WalletRewardsQueryParams,
} from 'types/dashboard';
import { createSlice } from 'utils/@reduxjs/toolkit';

import { saveDashboardQueryParamsToSession } from '../utils/dashboard-query-storage';

import {
  dashboardInitialState,
  selectDashboardQueryParams,
  selectRecentLimit,
  selectTopLimit,
} from './selectors';

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: dashboardInitialState,
  reducers: {
    setRecentLimit(state, action: PayloadAction<number>) {
      state.recentLimit = action.payload;
    },
    setTopLimit(state, action: PayloadAction<number>) {
      state.topLimit = action.payload;
    },
  },
});

export const dashboardActions = dashboardSlice.actions;
export const dashboardReducer = dashboardSlice.reducer;

/**
 * RTK Query API for admin dashboard endpoints (GET /api/admin/dashboard/*).
 * Reducers are injected when the Dashboard page mounts via {@link useDashboardSlice}.
 */
export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery,
  endpoints: build => ({
    /** Full dashboard — primary source for the admin dashboard page */
    getFullDashboard: build.query<
      DashboardApiResponse<FullDashboardData>,
      FullDashboardQueryParams | undefined
    >({
      query: params => ({
        url: endpoints.dashboard.full.url,
        method: endpoints.dashboard.full.method,
        ...(params ? { params } : {}),
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return formatErrors(baseQueryReturnValue.data);
      },
    }),
    /** Granular endpoints — use when only one section needs a refresh */
    getDashboardKpis: build.query<DashboardApiResponse<DashboardKpis>, void>({
      query: () => ({
        url: endpoints.dashboard.kpis.url,
        method: endpoints.dashboard.kpis.method,
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return formatErrors(baseQueryReturnValue.data);
      },
    }),
    getDashboardQuickActions: build.query<
      DashboardApiResponse<QuickActionsData>,
      void
    >({
      query: () => ({
        url: endpoints.dashboard.quickActions.url,
        method: endpoints.dashboard.quickActions.method,
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return formatErrors(baseQueryReturnValue.data);
      },
    }),
    getDashboardAnalytics: build.query<
      DashboardApiResponse<DashboardAnalyticsData>,
      { topLimit?: number } | undefined
    >({
      query: params => ({
        url: endpoints.dashboard.analytics.url,
        method: endpoints.dashboard.analytics.method,
        ...(params ? { params } : {}),
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return formatErrors(baseQueryReturnValue.data);
      },
    }),
    getDashboardWalletRewards: build.query<
      DashboardApiResponse<WalletRewardsData>,
      WalletRewardsQueryParams | undefined
    >({
      query: params => ({
        url: endpoints.dashboard.walletRewards.url,
        method: endpoints.dashboard.walletRewards.method,
        ...(params ? { params } : {}),
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return formatErrors(baseQueryReturnValue.data);
      },
    }),
    getDashboardRecentAccounts: build.query<
      RecentAccountsResponse,
      RecentAccountsQueryParams | undefined
    >({
      query: params => ({
        url: endpoints.dashboard.recentAccounts.url,
        method: endpoints.dashboard.recentAccounts.method,
        ...(params ? { params } : {}),
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return formatErrors(baseQueryReturnValue.data);
      },
    }),
  }),
});

export const {
  useGetFullDashboardQuery,
  useGetDashboardKpisQuery,
  useGetDashboardQuickActionsQuery,
  useGetDashboardAnalyticsQuery,
  useGetDashboardWalletRewardsQuery,
  useGetDashboardRecentAccountsQuery,
  useLazyGetDashboardWalletRewardsQuery,
} = dashboardApi;

export { selectDashboardQueryParams } from './selectors';

/** Dashboard query limits from Redux + dispatch helpers to update them. */
export function useDashboardLimits() {
  useDashboardSlice();

  const dispatch = useDispatch();
  const params = useSelector(selectDashboardQueryParams);
  const recentLimit = useSelector(selectRecentLimit);
  const topLimit = useSelector(selectTopLimit);

  return {
    params,
    recentLimit,
    topLimit,
    setRecentLimit: (limit: number) => {
      dispatch(dashboardActions.setRecentLimit(limit));
      saveDashboardQueryParamsToSession({
        recentLimit: limit,
        topLimit,
      });
    },
    setTopLimit: (limit: number) => {
      dispatch(dashboardActions.setTopLimit(limit));
      saveDashboardQueryParamsToSession({
        recentLimit,
        topLimit: limit,
      });
    },
  };
}

/**
 * Injects the dashboard Redux slice and RTK Query reducer; exposes dashboard API hooks.
 */
export const useDashboardSlice = () => {
  useInjectReducer({ key: dashboardSlice.name, reducer: dashboardReducer });
  useInjectReducer({
    key: dashboardApi.reducerPath,
    reducer: dashboardApi.reducer,
  });

  return {
    actions: dashboardActions,
    ...dashboardApi,
  };
};
