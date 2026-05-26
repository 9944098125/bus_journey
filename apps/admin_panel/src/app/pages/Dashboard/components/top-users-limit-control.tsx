import React from 'react';
import { useSelector } from 'react-redux';

import {
  DASHBOARD_TOP_LIMIT_OPTIONS,
} from '../utils/dashboard-limits';
import { useDashboardLimits } from '../hooks/use-dashboard';
import {
  selectDashboardQueryParams,
  useDashboardSlice,
} from '../slice';

import { DashboardLimitPicker } from './dashboard-limit-picker';

const formatTopUsersOption = (value: number) =>
  value === 1 ? '1 user' : `${value} users`;

type TopUsersLimitControlProps = {
  disabled?: boolean;
};

export function TopUsersLimitControl({ disabled = false }: TopUsersLimitControlProps) {
  const { topLimit, setTopLimit } = useDashboardLimits();
  const { useGetFullDashboardQuery } = useDashboardSlice();
  const params = useSelector(selectDashboardQueryParams);
  const { isFetching, isLoading } = useGetFullDashboardQuery(params);

  return (
    <DashboardLimitPicker
      id="dashboard-top-limit"
      label="Leaderboard size"
      description="Choose how many users appear in the Top wallets and Top rewards lists below."
      value={topLimit}
      options={DASHBOARD_TOP_LIMIT_OPTIONS}
      onChange={setTopLimit}
      formatOption={formatTopUsersOption}
      disabled={disabled}
      isUpdating={isFetching && !isLoading}
    />
  );
}
