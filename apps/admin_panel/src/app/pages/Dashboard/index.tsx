import React from 'react';
import { Helmet } from 'react-helmet-async';

import { AccountHealthCard } from './components/account-health-card';
import { AuthProviderCard } from './components/auth-provider-card';
import { DashboardHeader } from './components/dashboard-header';
import { KpiGrid } from './components/kpi-grid';
import { NotificationPrefsCard } from './components/notification-prefs-card';
import { QuickActions } from './components/quick-actions';
import { RecentUsersTable } from './components/recent-users-table';
import { RoleDistribution } from './components/role-distribution';
import { WalletRewardsPanel } from './components/wallet-rewards-panel';

export function Dashboard() {
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
        <DashboardHeader />
        <KpiGrid />
        <QuickActions />

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          <div className="xl:col-span-1">
            <RoleDistribution />
          </div>
          <div className="xl:col-span-1">
            <AuthProviderCard />
          </div>
          <div className="xl:col-span-1">
            <NotificationPrefsCard />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <AccountHealthCard />
          </div>
          <div className="lg:col-span-2">
            <WalletRewardsPanel />
          </div>
        </div>

        <RecentUsersTable />
      </div>
    </>
  );
}
