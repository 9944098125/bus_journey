import React from 'react';
import {
  BadgeCheck,
  Shield,
  UserCheck,
  Users,
  Wallet,
  Gift,
} from 'lucide-react';

import { TooltipProvider } from 'app/components/ui/tooltip';

import {
  DASHBOARD_KPI_CELL,
  DASHBOARD_KPI_ROW_GRID,
  DASHBOARD_KPI_SECTION,
  DASHBOARD_KPI_WIDE_ROW_GRID,
} from '../utils/dashboard-layout';
import {
  formatCompact,
  formatCountLabel,
  formatCurrency,
} from '../utils/dashboard-utils';
import { useDashboardData } from '../hooks/use-dashboard';
import { StatCard } from './stat-card';

function KpiCell({ children }: { children: React.ReactNode }) {
  return <div className={DASHBOARD_KPI_CELL}>{children}</div>;
}

export function KpiGrid() {
  const { kpis: k } = useDashboardData();
  const verifiedRate =
    k.totalUsers > 0
      ? Math.round((k.verifiedUsers / k.totalUsers) * 100)
      : 0;
  const activeRate =
    k.totalUsers > 0 ? Math.round((k.activeUsers / k.totalUsers) * 100) : 0;

  return (
    <section aria-label="Key user metrics" className={DASHBOARD_KPI_SECTION}>
      <TooltipProvider delayDuration={200}>
        <div className={DASHBOARD_KPI_ROW_GRID}>
          <KpiCell>
            <StatCard
              title="Total accounts"
              value={formatCompact(k.totalUsers)}
              subtitle={`${k.passengers.toLocaleString('en-IN')} passengers`}
              icon={Users}
              tooltip="All Users documents: USER, ADMIN, and OPERATOR roles"
            />
          </KpiCell>
          <KpiCell>
            <StatCard
              title="Active users"
              value={formatCompact(k.activeUsers)}
              subtitle={`${activeRate}% of total · is_active`}
              icon={UserCheck}
              accent="success"
              tooltip="Users with is_active: true"
            />
          </KpiCell>
          <KpiCell>
            <StatCard
              title="Verified"
              value={formatCompact(k.verifiedUsers)}
              subtitle={`${verifiedRate}% · is_verified`}
              icon={BadgeCheck}
              accent="success"
              tooltip="Email/phone verified accounts"
            />
          </KpiCell>
          <KpiCell>
            <StatCard
              title="Pending verification"
              value={formatCompact(k.pendingVerification)}
              subtitle="Awaiting is_verified"
              icon={BadgeCheck}
              accent="warning"
              tooltip="Registered but not yet verified"
            />
          </KpiCell>
          <KpiCell>
            <StatCard
              title="Platform wallet"
              value={formatCurrency(k.totalWalletBalance)}
              subtitle="Sum of wallet_balance"
              icon={Wallet}
              tooltip="Aggregate wallet_balance across all users (INR)"
            />
          </KpiCell>
          <KpiCell>
            <StatCard
              title="Reward points"
              value={formatCompact(k.totalRewardPoints)}
              subtitle="Sum of reward_points"
              icon={Gift}
              accent="violet"
              tooltip="Total loyalty points issued platform-wide"
            />
          </KpiCell>
        </div>
        <div className={DASHBOARD_KPI_WIDE_ROW_GRID}>
          <KpiCell>
            <StatCard
              title="Staff & operators"
              value={`${formatCountLabel(k.admins, 'admin')} · ${formatCountLabel(k.operators, 'operator')}`}
              subtitle="role: ADMIN | OPERATOR"
              icon={Shield}
              accent="violet"
              tooltip="Non-passenger roles from the role enum"
            />
          </KpiCell>
          <KpiCell>
            <StatCard
              title="Inactive accounts"
              value={formatCompact(k.inactiveUsers)}
              subtitle="is_active: false — review for churn"
              icon={Users}
              accent="warning"
              tooltip="Deactivated or suspended user accounts"
            />
          </KpiCell>
        </div>
      </TooltipProvider>
    </section>
  );
}
