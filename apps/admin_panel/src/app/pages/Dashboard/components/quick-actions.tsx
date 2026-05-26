import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Shield,
  UserCog,
  Users,
  Wallet,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { cn } from 'utils/twm';

import { useDashboardData } from '../hooks/use-dashboard';

type ActionConfig = {
  key: 'customers' | 'admins' | 'operators' | 'payments';
  title: string;
  description: (count: number, extra?: number) => string;
  icon: LucideIcon;
  color: string;
};

const ACTION_CONFIG: ActionConfig[] = [
  {
    key: 'customers',
    title: 'All customers',
    description: count => `${count.toLocaleString('en-IN')} USER accounts`,
    icon: Users,
    color: 'from-sea-mid to-sea-bright',
  },
  {
    key: 'admins',
    title: 'Admins & roles',
    description: count => `${count.toLocaleString('en-IN')} ADMIN accounts`,
    icon: Shield,
    color: 'from-violet-500 to-purple-600',
  },
  {
    key: 'operators',
    title: 'Operators',
    description: (count, active) =>
      `${count.toLocaleString('en-IN')} total · ${(active ?? 0).toLocaleString('en-IN')} active`,
    icon: UserCog,
    color: 'from-amber-500 to-orange-500',
  },
  {
    key: 'payments',
    title: 'Payments',
    description: () => 'Wallet top-ups & transactions',
    icon: Wallet,
    color: 'from-emerald-500 to-teal-600',
  },
];

export function QuickActions() {
  const { quickActions } = useDashboardData();

  return (
    <section aria-label="Quick actions">
      <h2 className="mb-3 text-[1.4rem] font-bold text-sea-deep">Quick actions</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {ACTION_CONFIG.map(action => {
          const Icon = action.icon;
          const item = quickActions[action.key];

          return (
            <Link
              key={action.key}
              to={item.href}
              className={cn(
                'admin-card-surface group flex items-center gap-3 rounded-2xl border p-4 transition-all',
                'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sea-mid/15',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea-bright',
              )}
            >
              <div
                className={cn(
                  'flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md',
                  action.color,
                )}
              >
                <Icon className="size-5" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sea-deep group-hover:text-sea-mid">
                  {action.title}
                </p>
                <p className="text-[1.1rem] text-sea-mid/65">
                  {action.description(item.count, item.activeCount)}
                </p>
              </div>
              <ArrowRight
                className="size-4 shrink-0 text-sea-mid/40 transition-transform group-hover:translate-x-0.5 group-hover:text-sea-bright"
                aria-hidden
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
