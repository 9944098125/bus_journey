import React from 'react';
import { Helmet } from 'react-helmet-async';

import { AccountHealthCard } from './components/account-health-card';
import { AuthProviderCard } from './components/auth-provider-card';
import { DashboardHeader } from './components/dashboard-header';
import {
  DashboardError,
  DashboardLoading,
} from './components/dashboard-status';
import { KpiGrid } from './components/kpi-grid';
import { NotificationPrefsCard } from './components/notification-prefs-card';
import { QuickActions } from './components/quick-actions';
import { RecentAccountsLimitControl } from './components/recent-accounts-limit-control';
import { RecentUsersTable } from './components/recent-users-table';
import { RoleDistribution } from './components/role-distribution';
import { TopUsersLimitControl } from './components/top-users-limit-control';
import { WalletRewardsPanel } from './components/wallet-rewards-panel';
import { useDashboard } from './hooks/use-dashboard';
import {
  DASHBOARD_BOTTOM_GRID,
  DASHBOARD_BOTTOM_MAIN_CELL,
  DASHBOARD_BOTTOM_SIDE_CELL,
  DASHBOARD_MIDDLE_CELL,
  DASHBOARD_MIDDLE_GRID,
} from './utils/dashboard-layout';

export function Dashboard() {
  const { dashboard, showSkeleton, isError, refetch, isFetching } =
    useDashboard();

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
        <meta
          name="description"
          content="Bus Journey admin dashboard — user metrics and account health"
        />
      </Helmet>

      <div className="mx-auto max-w-[1600px] space-y-6 sm:space-y-8">
        <DashboardHeader
          isLive={!!dashboard && !showSkeleton}
          isRefreshing={isFetching && !showSkeleton}
        />

        {showSkeleton && <DashboardLoading />}

        {!showSkeleton && isError && (
          <DashboardError onRetry={() => void refetch()} />
        )}

        {!showSkeleton && !isError && dashboard && (
          <>
            <KpiGrid />
            <QuickActions />
            <div className={DASHBOARD_MIDDLE_GRID}>
              <div className={DASHBOARD_MIDDLE_CELL}>
                <RoleDistribution />
              </div>
              <div className={DASHBOARD_MIDDLE_CELL}>
                <AuthProviderCard />
              </div>
              <div className={DASHBOARD_MIDDLE_CELL}>
                <NotificationPrefsCard />
              </div>
            </div>
            <div className={DASHBOARD_BOTTOM_GRID}>
              <div className={DASHBOARD_BOTTOM_MAIN_CELL}>
                <AccountHealthCard />
              </div>
              <div className={DASHBOARD_BOTTOM_SIDE_CELL}>
                <TopUsersLimitControl />
                <WalletRewardsPanel />
              </div>
            </div>
            <div className="flex w-full flex-col gap-3">
              <RecentAccountsLimitControl />
              <RecentUsersTable />
            </div>
          </>
        )}
      </div>
    </>
  );
}
