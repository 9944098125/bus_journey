import React from 'react';
import { Gift, Wallet } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from 'app/components/ui/tabs';
import { cn } from 'utils/twm';

import {
  DASHBOARD_KPIS,
  TOP_REWARD_USERS,
  TOP_WALLET_USERS,
} from '../utils/dashboard-mock-data';
import { formatCurrency } from '../utils/dashboard-utils';

function UserRankRow({
  rank,
  name,
  value,
  valueLabel,
}: {
  rank: number;
  name: string;
  value: number;
  valueLabel: string;
}) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map(p => p[0])
    .join('')
    .toUpperCase();

  return (
    <li className="flex items-center gap-3 rounded-xl border border-sea-light/35 bg-sea-foam/30 px-3 py-2.5">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-sea-deep/10 text-[1.1rem] font-bold text-sea-deep">
        {rank}
      </span>
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sea-mid to-sea-bright text-[1.1rem] font-bold text-white"
        aria-hidden
      >
        {initials}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-sea-deep">{name}</p>
        <p className="text-[1.05rem] text-sea-mid/65">{valueLabel}</p>
      </div>
      <span className="shrink-0 font-bold text-sea-deep">
        {valueLabel === 'wallet_balance'
          ? formatCurrency(value)
          : value.toLocaleString('en-IN')}
      </span>
    </li>
  );
}

export function WalletRewardsPanel() {
  return (
    <article className="admin-card-surface rounded-2xl border p-5 sm:p-6">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[1.6rem] font-bold text-sea-deep">
            Wallet & rewards
          </h2>
          <p className="mt-0.5 text-[1.2rem] text-sea-mid/70">
            Numeric fields from IUser — min 0
          </p>
        </div>
        <div className="flex gap-2">
          <span className="inline-flex items-center gap-1 rounded-lg bg-sea-pale/60 px-2 py-1 text-[1.05rem] font-semibold text-sea-deep">
            <Wallet className="size-3.5" aria-hidden />
            {formatCurrency(DASHBOARD_KPIS.totalWalletBalance)}
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg bg-violet-100 px-2 py-1 text-[1.05rem] font-semibold text-violet-800">
            <Gift className="size-3.5" aria-hidden />
            {DASHBOARD_KPIS.totalRewardPoints.toLocaleString('en-IN')} pts
          </span>
        </div>
      </header>

      <Tabs defaultValue="wallet" className="w-full">
        <TabsList
          className={cn(
            'mb-4 grid w-full grid-cols-2 gap-1 rounded-xl border border-sea-light/50 bg-sea-foam/80 p-1',
          )}
        >
          <TabsTrigger
            value="wallet"
            className={cn(
              'rounded-lg py-2 text-[1.2rem] font-semibold text-sea-mid/80 transition-all',
              'data-[state=active]:bg-white data-[state=active]:text-sea-deep data-[state=active]:shadow-sm',
            )}
          >
            Top wallets
          </TabsTrigger>
          <TabsTrigger
            value="rewards"
            className={cn(
              'rounded-lg py-2 text-[1.2rem] font-semibold text-sea-mid/80 transition-all',
              'data-[state=active]:bg-white data-[state=active]:text-sea-deep data-[state=active]:shadow-sm',
            )}
          >
            Top rewards
          </TabsTrigger>
        </TabsList>
        <TabsContent value="wallet" className="mt-0">
          <ul className="space-y-2">
            {TOP_WALLET_USERS.map((u, i) => (
              <UserRankRow
                key={u.id}
                rank={i + 1}
                name={u.full_name}
                value={u.wallet_balance}
                valueLabel="wallet_balance"
              />
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="rewards" className="mt-0">
          <ul className="space-y-2">
            {TOP_REWARD_USERS.map((u, i) => (
              <UserRankRow
                key={u.id}
                rank={i + 1}
                name={u.full_name}
                value={u.reward_points}
                valueLabel="reward_points"
              />
            ))}
          </ul>
        </TabsContent>
      </Tabs>
    </article>
  );
}
