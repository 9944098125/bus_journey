import React from 'react';
import { useSelector } from 'react-redux';
import { Sparkles, Users } from 'lucide-react';

import { selectUser } from 'app/slice/selectors';
import { getUserDisplayName } from 'utils/user-display';

type DashboardHeaderProps = {
  isLive?: boolean;
  isRefreshing?: boolean;
};

export function DashboardHeader({
  isLive = false,
  isRefreshing = false,
}: DashboardHeaderProps) {
  const user = useSelector(selectUser);
  const displayName = getUserDisplayName(user);
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <header className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="mb-1 flex items-center gap-2 text-[1.2rem] font-medium uppercase tracking-widest text-sea-mid/80">
          <Sparkles className="size-3.5 text-sea-bright" aria-hidden />
          Operations overview
        </p>
        <h1 className="bg-gradient-to-r from-sea-deep via-sea-mid to-sea-bright bg-clip-text text-[2.4rem] font-bold leading-tight text-transparent sm:text-[2.8rem]">
          Welcome back, {displayName.split(' ')[0]}
        </h1>
        <p className="mt-1 max-w-xl text-[1.35rem] text-sea-mid/75">
          User directory health, roles, wallets, and verification — live from
          your database.
        </p>
      </div>
      <div className="admin-card-surface flex shrink-0 items-center gap-3 rounded-2xl border px-4 py-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-sea-mid to-sea-bright text-white shadow-md shadow-sea-mid/25">
          <Users className="size-5" strokeWidth={2} aria-hidden />
        </div>
        <div className="text-left">
          <p className="text-[1.1rem] font-medium text-sea-mid/70">{today}</p>
          <p className="text-[1.25rem] font-semibold text-sea-deep">
            {isRefreshing
              ? 'Refreshing…'
              : isLive
                ? 'Live data'
                : 'Loading…'}
          </p>
        </div>
      </div>
    </header>
  );
}
