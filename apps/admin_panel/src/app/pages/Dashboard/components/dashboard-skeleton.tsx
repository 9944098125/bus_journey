import React from 'react';

import { Skeleton } from 'app/components/ui/skeleton';
import { cn } from 'utils/twm';

import {
  DASHBOARD_BOTTOM_GRID,
  DASHBOARD_BOTTOM_MAIN_CELL,
  DASHBOARD_BOTTOM_SIDE_CELL,
  DASHBOARD_KPI_CELL,
  DASHBOARD_KPI_ROW_GRID,
  DASHBOARD_KPI_SECTION,
  DASHBOARD_KPI_WIDE_ROW_GRID,
  DASHBOARD_MIDDLE_CELL,
  DASHBOARD_MIDDLE_GRID,
} from '../utils/dashboard-layout';
import { StatCardSkeleton } from './stat-card-skeleton';
import {
  DEFAULT_DASHBOARD_RECENT_LIMIT,
  DEFAULT_DASHBOARD_TOP_LIMIT,
} from '../utils/dashboard-limits';

const skeletonSubtle = 'bg-muted/55';

function DashboardCardSkeleton({
  children,
  className,
  padding = 'default',
}: {
  children: React.ReactNode;
  className?: string;
  padding?: 'default' | 'none' | 'compact';
}) {
  return (
    <article
      className={cn(
        'admin-card-surface flex h-full w-full min-h-0 flex-col rounded-2xl border',
        padding === 'default' && 'p-5 sm:p-6',
        padding === 'compact' && 'p-4 sm:p-5',
        padding === 'none' && 'overflow-hidden',
        className,
      )}
    >
      {children}
    </article>
  );
}

function CardHeaderSkeleton({
  withIcon = false,
  className,
}: {
  withIcon?: boolean;
  className?: string;
}) {
  return (
    <header
      className={cn(
        'mb-5 flex shrink-0 gap-3',
        withIcon ? 'items-center' : 'flex-col',
        className,
      )}
    >
      {withIcon && <Skeleton className="size-10 shrink-0 rounded-xl" />}
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-6 w-44 max-w-full" />
        <Skeleton className={cn('h-4 w-full max-w-[16rem]', skeletonSubtle)} />
      </div>
    </header>
  );
}

function ProgressRowSkeleton({ className }: { className?: string }) {
  return (
    <li className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Skeleton className="size-8 shrink-0 rounded-lg" />
          <Skeleton className={cn('h-5 w-20', skeletonSubtle)} />
        </div>
        <Skeleton className={cn('h-5 w-16', skeletonSubtle)} />
      </div>
      <Skeleton className={cn('h-2 w-full rounded-full', skeletonSubtle)} />
    </li>
  );
}

function KpiGridSkeleton() {
  return (
    <section aria-hidden className={DASHBOARD_KPI_SECTION}>
      <div className={DASHBOARD_KPI_ROW_GRID}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={DASHBOARD_KPI_CELL}>
            <StatCardSkeleton />
          </div>
        ))}
      </div>
      <div className={DASHBOARD_KPI_WIDE_ROW_GRID}>
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={`wide-${i}`} className={DASHBOARD_KPI_CELL}>
            <StatCardSkeleton />
          </div>
        ))}
      </div>
    </section>
  );
}

function QuickActionsSkeleton() {
  return (
    <section aria-hidden>
      <Skeleton className="mb-3 h-5 w-32" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="admin-card-surface flex min-h-[5.5rem] w-full items-center gap-3 rounded-2xl border p-4"
          >
            <Skeleton className="size-11 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className={cn('h-3.5 w-full max-w-[10rem]', skeletonSubtle)} />
            </div>
            <Skeleton className={cn('size-4 shrink-0', skeletonSubtle)} />
          </div>
        ))}
      </div>
    </section>
  );
}

function RoleDistributionSkeleton() {
  return (
    <DashboardCardSkeleton className="min-h-[22rem] w-full">
      <CardHeaderSkeleton />
      <ul className="flex flex-1 flex-col justify-center space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <ProgressRowSkeleton key={i} />
        ))}
      </ul>
    </DashboardCardSkeleton>
  );
}

function AuthProviderCardSkeleton() {
  return (
    <DashboardCardSkeleton className="min-h-[22rem] w-full">
      <CardHeaderSkeleton />
      <div className="mb-6 grid shrink-0 grid-cols-2 gap-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-sea-light/50 bg-sea-foam/50 p-3"
          >
            <Skeleton className="mb-2 size-9 rounded-lg" />
            <Skeleton className={cn('mb-2 h-3.5 w-16', skeletonSubtle)} />
            <Skeleton className="mb-1 h-7 w-12" />
            <Skeleton className={cn('h-3 w-10', skeletonSubtle)} />
          </div>
        ))}
      </div>
      <div className="flex flex-1 flex-col justify-center space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex justify-between">
              <Skeleton className={cn('h-4 w-16', skeletonSubtle)} />
              <Skeleton className={cn('h-4 w-10', skeletonSubtle)} />
            </div>
            <Skeleton className={cn('h-2 w-full rounded-full', skeletonSubtle)} />
          </div>
        ))}
      </div>
      <Skeleton className={cn('mt-4 h-10 w-full rounded-lg', skeletonSubtle)} />
    </DashboardCardSkeleton>
  );
}

function NotificationPrefsCardSkeleton() {
  return (
    <DashboardCardSkeleton className="min-h-[22rem] w-full">
      <CardHeaderSkeleton withIcon />
      <div className="flex flex-1 flex-col justify-center space-y-5">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className={cn('h-4 w-10', skeletonSubtle)} />
            </div>
            <Skeleton className={cn('h-2 w-full rounded-full', skeletonSubtle)} />
            <Skeleton className={cn('h-3.5 w-36', skeletonSubtle)} />
          </div>
        ))}
      </div>
      <div className="mt-5 shrink-0 rounded-xl border border-dashed border-sea-light/60 bg-sea-foam/40 p-4">
        <Skeleton className={cn('mb-3 h-4 w-52', skeletonSubtle)} />
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
          <Skeleton className={cn('h-6 w-36', skeletonSubtle)} />
          <Skeleton className={cn('h-6 w-32', skeletonSubtle)} />
        </div>
      </div>
    </DashboardCardSkeleton>
  );
}

function AccountHealthCardSkeleton() {
  return (
    <DashboardCardSkeleton className="min-h-[20rem] w-full lg:min-h-full">
      <CardHeaderSkeleton />
      <ul className="grid flex-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <li
            key={i}
            className="flex flex-col rounded-xl border border-sea-light/40 bg-white/40 p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className={cn('h-5 w-10', skeletonSubtle)} />
            </div>
            <Skeleton className={cn('h-2 w-full rounded-full', skeletonSubtle)} />
            <Skeleton className={cn('mt-2 h-3.5 w-full max-w-[12rem]', skeletonSubtle)} />
          </li>
        ))}
      </ul>
    </DashboardCardSkeleton>
  );
}

function LimitControlSkeleton() {
  return (
    <div className="admin-card-surface w-full shrink-0 rounded-2xl border border-sea-light/45 bg-gradient-to-br from-white via-white to-sea-foam/40 p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className={cn('h-4 w-full max-w-md', skeletonSubtle)} />
        </div>
        <Skeleton className={cn('h-9 w-28 shrink-0 rounded-xl', skeletonSubtle)} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className={cn('h-10 w-14 rounded-xl', skeletonSubtle)} />
        ))}
      </div>
    </div>
  );
}

function WalletRewardsPanelSkeleton({
  rowCount = DEFAULT_DASHBOARD_TOP_LIMIT,
}: {
  rowCount?: number;
}) {
  return (
    <DashboardCardSkeleton className="min-h-[20rem] w-full flex-1">
      <header className="mb-4 flex shrink-0 items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className={cn('h-4 w-full max-w-xs', skeletonSubtle)} />
        </div>
        <div className="flex shrink-0 gap-2">
          <Skeleton className={cn('h-7 w-20 rounded-lg', skeletonSubtle)} />
          <Skeleton className={cn('h-7 w-16 rounded-lg', skeletonSubtle)} />
        </div>
      </header>
      <Skeleton className={cn('mb-4 h-11 w-full rounded-xl', skeletonSubtle)} />
      <ul className="flex flex-1 flex-col space-y-2">
        {Array.from({ length: rowCount }).map((_, i) => (
          <li
            key={i}
            className="flex items-center gap-3 rounded-xl border border-sea-light/35 bg-sea-foam/30 px-3 py-2.5"
          >
            <Skeleton className={cn('size-7 shrink-0 rounded-lg', skeletonSubtle)} />
            <Skeleton className="size-9 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className={cn('h-3 w-20', skeletonSubtle)} />
            </div>
            <Skeleton className={cn('h-4 w-16 shrink-0', skeletonSubtle)} />
          </li>
        ))}
      </ul>
    </DashboardCardSkeleton>
  );
}

function RecentUsersTableSkeleton({
  rowCount = DEFAULT_DASHBOARD_RECENT_LIMIT,
}: {
  rowCount?: number;
}) {
  return (
    <DashboardCardSkeleton padding="none" className="min-h-[18rem]">
      <header className="shrink-0 border-b border-sea-light/40 px-5 py-4 sm:px-6">
        <Skeleton className="h-6 w-44" />
        <Skeleton className={cn('mt-2 h-4 w-72 max-w-full', skeletonSubtle)} />
      </header>
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="grid shrink-0 grid-cols-4 gap-3 border-b border-sea-light/30 bg-sea-foam/50 px-5 py-3 sm:px-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className={cn('h-3.5 w-full max-w-[5rem]', skeletonSubtle)} />
          ))}
        </div>
        <ul className="divide-y divide-sea-light/20">
          {Array.from({ length: rowCount }).map((_, i) => (
            <li key={i} className="flex items-center gap-3 px-5 py-3.5 sm:px-6">
              <Skeleton className="size-10 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <Skeleton className="h-4 w-36" />
                <Skeleton className={cn('h-3 w-48 max-w-full', skeletonSubtle)} />
                <Skeleton className={cn('h-3 w-28', skeletonSubtle)} />
              </div>
              <Skeleton
                className={cn('hidden h-6 w-16 shrink-0 rounded-lg sm:block', skeletonSubtle)}
              />
              <Skeleton
                className={cn('hidden h-6 w-14 shrink-0 sm:block', skeletonSubtle)}
              />
              <Skeleton
                className={cn('hidden h-4 w-20 shrink-0 sm:block', skeletonSubtle)}
              />
            </li>
          ))}
        </ul>
      </div>
    </DashboardCardSkeleton>
  );
}

type DashboardSkeletonProps = {
  label?: string;
};

/** Skeleton layout mirroring the loaded dashboard grid for consistent alignment. */
export function DashboardSkeleton({
  label = 'Loading dashboard…',
}: DashboardSkeletonProps) {
  return (
    <div className="space-y-6 sm:space-y-8" aria-busy="true" aria-label={label}>
      <KpiGridSkeleton />
      <QuickActionsSkeleton />

      <div className={DASHBOARD_MIDDLE_GRID}>
        <div className={cn(DASHBOARD_MIDDLE_CELL, 'min-h-[22rem]')}>
          <RoleDistributionSkeleton />
        </div>
        <div className={cn(DASHBOARD_MIDDLE_CELL, 'min-h-[22rem]')}>
          <AuthProviderCardSkeleton />
        </div>
        <div className={cn(DASHBOARD_MIDDLE_CELL, 'min-h-[22rem]')}>
          <NotificationPrefsCardSkeleton />
        </div>
      </div>

      <div className={DASHBOARD_BOTTOM_GRID}>
        <div className={DASHBOARD_BOTTOM_MAIN_CELL}>
          <AccountHealthCardSkeleton />
        </div>
        <div className={DASHBOARD_BOTTOM_SIDE_CELL}>
          <LimitControlSkeleton />
          <WalletRewardsPanelSkeleton />
        </div>
      </div>

      <div className="flex w-full flex-col gap-3">
        <LimitControlSkeleton />
        <RecentUsersTableSkeleton />
      </div>
    </div>
  );
}
