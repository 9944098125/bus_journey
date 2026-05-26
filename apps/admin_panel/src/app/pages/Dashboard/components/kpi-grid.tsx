import React from 'react';
import {
  BadgeCheck,
  Shield,
  UserCheck,
  Users,
  Wallet,
  Gift,
} from 'lucide-react';

import { DASHBOARD_KPIS } from '../utils/dashboard-mock-data';
import { formatCompact, formatCurrency } from '../utils/dashboard-utils';
import { StatCard } from './stat-card';

export function KpiGrid() {
  const k = DASHBOARD_KPIS;
  const verifiedRate = Math.round((k.verifiedUsers / k.totalUsers) * 100);
  const activeRate = Math.round((k.activeUsers / k.totalUsers) * 100);

  return (
    <section aria-label="Key user metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      <StatCard
        title="Total accounts"
        value={formatCompact(k.totalUsers)}
        subtitle={`${k.passengers.toLocaleString('en-IN')} passengers`}
        icon={Users}
        trend={{ label: '+4.2% vs last month', positive: true }}
        tooltip="All Users documents: USER, ADMIN, and OPERATOR roles"
      />
      <StatCard
        title="Active users"
        value={formatCompact(k.activeUsers)}
        subtitle={`${activeRate}% of total · is_active`}
        icon={UserCheck}
        accent="success"
        tooltip="Users with is_active: true"
      />
      <StatCard
        title="Verified"
        value={formatCompact(k.verifiedUsers)}
        subtitle={`${verifiedRate}% · is_verified`}
        icon={BadgeCheck}
        accent="success"
        tooltip="Email/phone verified accounts"
      />
      <StatCard
        title="Pending verification"
        value={formatCompact(k.pendingVerification)}
        subtitle="Awaiting is_verified"
        icon={BadgeCheck}
        accent="warning"
        tooltip="Registered but not yet verified"
      />
      <StatCard
        title="Platform wallet"
        value={formatCurrency(k.totalWalletBalance)}
        subtitle="Sum of wallet_balance"
        icon={Wallet}
        tooltip="Aggregate wallet_balance across all users (INR)"
      />
      <StatCard
        title="Reward points"
        value={formatCompact(k.totalRewardPoints)}
        subtitle="Sum of reward_points"
        icon={Gift}
        accent="violet"
        tooltip="Total loyalty points issued platform-wide"
      />
      <StatCard
        className="sm:col-span-2 xl:col-span-3"
        title="Staff & operators"
        value={`${k.admins} admins · ${k.operators} operators`}
        subtitle="role: ADMIN | OPERATOR"
        icon={Shield}
        accent="violet"
        tooltip="Non-passenger roles from the role enum"
      />
      <StatCard
        className="sm:col-span-2 xl:col-span-3"
        title="Inactive accounts"
        value={formatCompact(k.inactiveUsers)}
        subtitle="is_active: false — review for churn"
        icon={Users}
        accent="warning"
        tooltip="Deactivated or suspended user accounts"
      />
    </section>
  );
}
