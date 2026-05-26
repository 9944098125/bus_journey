import React from 'react';
import { Globe, KeyRound } from 'lucide-react';

import { Progress } from 'app/components/ui/progress';
import { cn } from 'utils/twm';
import type { AuthProvider } from 'types/user';

import { AUTH_PROVIDER_LABELS, formatCompact } from '../utils/dashboard-utils';
import { useDashboardData } from '../hooks/use-dashboard';

const PROVIDER_ICONS: Record<AuthProvider, typeof KeyRound> = {
  LOCAL: KeyRound,
  GOOGLE: Globe,
};

const PROVIDER_COLORS: Record<AuthProvider, string> = {
  LOCAL: 'from-sea-deep to-sea-mid',
  GOOGLE: 'from-rose-500 to-orange-500',
};

export function AuthProviderCard() {
  const { kpis, analytics } = useDashboardData();
  const authProviderBreakdown = analytics.authProviderBreakdown;

  return (
    <article className="admin-card-surface flex h-full w-full min-h-[22rem] flex-col rounded-2xl border p-5 sm:p-6">
      <header className="mb-5">
        <h2 className="text-[1.6rem] font-bold text-sea-deep">Auth providers</h2>
        <p className="mt-0.5 text-[1.2rem] text-sea-mid/70">
          <code className="text-sea-mid">auth_provider</code> · LOCAL vs GOOGLE
        </p>
      </header>
      <div className="mb-6 grid grid-cols-2 gap-3">
        {authProviderBreakdown.map(item => {
          const Icon = PROVIDER_ICONS[item.provider];
          return (
            <div
              key={item.provider}
              className="rounded-xl border border-sea-light/50 bg-sea-foam/50 p-3"
            >
              <div
                className={cn(
                  'mb-2 flex size-9 items-center justify-center rounded-lg bg-gradient-to-br text-white',
                  PROVIDER_COLORS[item.provider],
                )}
              >
                <Icon className="size-4" aria-hidden />
              </div>
              <p className="text-[1.1rem] font-medium text-sea-mid/70">
                {AUTH_PROVIDER_LABELS[item.provider]}
              </p>
              <p className="text-[1.8rem] font-bold text-sea-deep">
                {formatCompact(item.count)}
              </p>
              <p className="text-[1.1rem] text-sea-mid/60">{item.percentage}%</p>
            </div>
          );
        })}
      </div>
      <div className="space-y-3">
        {authProviderBreakdown.map(item => (
          <div key={item.provider}>
            <div className="mb-1 flex justify-between text-[1.15rem]">
              <span className="font-medium text-sea-deep">{item.provider}</span>
              <span className="text-sea-mid/70">{item.percentage}%</span>
            </div>
            <Progress
              value={item.percentage}
              indicatorClassName={cn(
                'bg-gradient-to-r',
                PROVIDER_COLORS[item.provider],
              )}
            />
          </div>
        ))}
      </div>
      <p className="mt-4 rounded-lg bg-sea-pale/40 px-3 py-2 text-[1.1rem] text-sea-mid/80">
        {formatCompact(kpis.googleAuthUsers)} users signed up via Google SSO —
        password not stored locally.
      </p>
    </article>
  );
}
