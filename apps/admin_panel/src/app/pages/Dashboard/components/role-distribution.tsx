import React from 'react';
import { Shield, UserCog, Users } from 'lucide-react';

import { Progress } from 'app/components/ui/progress';
import { cn } from 'utils/twm';
import type { UserRole } from 'types/user';

import { ROLE_LABELS } from '../utils/dashboard-utils';
import { useDashboardData } from '../hooks/use-dashboard';
import { RoleBadge } from './role-badge';

const ROLE_ICONS: Record<UserRole, typeof Users> = {
  USER: Users,
  ADMIN: Shield,
  OPERATOR: UserCog,
};

const ROLE_BAR_COLORS: Record<UserRole, string> = {
  USER: 'from-sea-mid to-sea-bright',
  ADMIN: 'from-violet-500 to-purple-500',
  OPERATOR: 'from-amber-500 to-orange-500',
};

export function RoleDistribution() {
  const { analytics } = useDashboardData();
  const roleBreakdown = analytics.roleBreakdown;

  return (
    <article className="admin-card-surface flex h-full w-full min-h-[22rem] flex-col rounded-2xl border p-5 sm:p-6">
      <header className="mb-5">
        <h2 className="text-[1.6rem] font-bold text-sea-deep">Role breakdown</h2>
        <p className="mt-0.5 text-[1.2rem] text-sea-mid/70">
          Distribution by <code className="text-sea-mid">role</code> enum
        </p>
      </header>
      <ul className="space-y-4">
        {roleBreakdown.map(item => {
          const Icon = ROLE_ICONS[item.role];
          return (
            <li key={item.role}>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'flex size-8 items-center justify-center rounded-lg bg-gradient-to-br text-white',
                      ROLE_BAR_COLORS[item.role],
                    )}
                  >
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <RoleBadge role={item.role} />
                </div>
                <span className="text-[1.25rem] font-bold text-sea-deep">
                  {item.count.toLocaleString('en-IN')}
                  <span className="ml-1 text-[1.1rem] font-medium text-sea-mid/65">
                    ({item.percentage}%)
                  </span>
                </span>
              </div>
              <Progress
                value={item.percentage}
                indicatorClassName={cn(
                  'bg-gradient-to-r',
                  ROLE_BAR_COLORS[item.role],
                )}
                aria-label={`${ROLE_LABELS[item.role]} ${item.percentage}%`}
              />
            </li>
          );
        })}
      </ul>
    </article>
  );
}
