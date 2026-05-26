import { createSelector } from '@reduxjs/toolkit';

import type { FullDashboardQueryParams } from 'types/dashboard';
import type { RootState } from 'types/root-state';

import { loadDashboardQueryParamsFromSession } from '../utils/dashboard-query-storage';

import type { DashboardState } from './types';

export const dashboardInitialState: DashboardState =
  loadDashboardQueryParamsFromSession();

const selectDashboardState = (state: RootState): DashboardState =>
  state.dashboard ?? dashboardInitialState;

export const selectRecentLimit = createSelector(
  [selectDashboardState],
  state => state.recentLimit,
);

export const selectTopLimit = createSelector(
  [selectDashboardState],
  state => state.topLimit,
);

export const selectDashboardQueryParams = createSelector(
  [selectDashboardState],
  (state): FullDashboardQueryParams => ({
    recentLimit: state.recentLimit,
    topLimit: state.topLimit,
  }),
);
