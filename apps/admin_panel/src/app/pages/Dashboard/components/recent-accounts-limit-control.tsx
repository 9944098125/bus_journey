import React from 'react';
import { useSelector } from 'react-redux';

import {
  DASHBOARD_RECENT_LIMIT_OPTIONS,
} from '../utils/dashboard-limits';
import { useDashboardLimits } from '../hooks/use-dashboard';
import {
  selectDashboardQueryParams,
  useDashboardSlice,
} from '../slice';

import { DashboardLimitPicker } from './dashboard-limit-picker';

const formatRecentAccountsOption = (value: number) =>
  value === 1 ? '1 account' : `${value} accounts`;

type RecentAccountsLimitControlProps = {
  disabled?: boolean;
};

export function RecentAccountsLimitControl({
  disabled = false,
}: RecentAccountsLimitControlProps) {
  const { recentLimit, setRecentLimit } = useDashboardLimits();
  const { useGetFullDashboardQuery } = useDashboardSlice();
  const params = useSelector(selectDashboardQueryParams);
  const { isFetching, isLoading } = useGetFullDashboardQuery(params);

  return (
    <DashboardLimitPicker
      id="dashboard-recent-limit"
      label="Table row count"
      description="Choose how many newly registered accounts to load in the recent sign-ups table below."
      value={recentLimit}
      options={DASHBOARD_RECENT_LIMIT_OPTIONS}
      onChange={setRecentLimit}
      formatOption={formatRecentAccountsOption}
      disabled={disabled}
      isUpdating={isFetching && !isLoading}
    />
  );
}
