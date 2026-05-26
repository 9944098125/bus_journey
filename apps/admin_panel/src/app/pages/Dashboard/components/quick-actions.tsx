import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Shield,
  UserPlus,
  Users,
  Wallet,
} from 'lucide-react';

import { cn } from 'utils/twm';

const actions = [
  {
    title: 'All customers',
    description: 'Browse USER role accounts',
    href: '/customers',
    icon: Users,
    color: 'from-sea-mid to-sea-bright',
  },
  {
    title: 'Admins & roles',
    description: 'ADMIN & OPERATOR management',
    href: '/admins',
    icon: Shield,
    color: 'from-violet-500 to-purple-600',
  },
  {
    title: 'Payments',
    description: 'Wallet top-ups & transactions',
    href: '/payments',
    icon: Wallet,
    color: 'from-emerald-500 to-teal-600',
  },
  {
    title: 'Invite operator',
    description: 'Create OPERATOR account',
    href: '/operators',
    icon: UserPlus,
    color: 'from-amber-500 to-orange-500',
  },
] as const;

export function QuickActions() {
  return (
    <section aria-label="Quick actions">
      <h2 className="mb-3 text-[1.4rem] font-bold text-sea-deep">Quick actions</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map(action => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              to={action.href}
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
                <p className="text-[1.1rem] text-sea-mid/65">{action.description}</p>
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
