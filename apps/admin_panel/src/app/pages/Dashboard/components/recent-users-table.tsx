import React from 'react';
import { Clock, Mail, Phone } from 'lucide-react';

import { cn } from 'utils/twm';

import { formatRelativeTime } from '../utils/dashboard-utils';
import { useDashboardData, useDashboardLimits } from '../hooks/use-dashboard';
import { RoleBadge } from './role-badge';

function StatusDot({
  active,
  verified,
}: {
  active: boolean;
  verified: boolean;
}) {
  if (!active) {
    return (
      <span
        className="inline-flex items-center gap-1 text-[1.05rem] font-medium text-slate-500"
        title="is_active: false"
      >
        <span className="size-2 rounded-full bg-slate-400" />
        Inactive
      </span>
    );
  }
  if (!verified) {
    return (
      <span
        className="inline-flex items-center gap-1 text-[1.05rem] font-medium text-amber-600"
        title="is_verified: false"
      >
        <span className="size-2 rounded-full bg-amber-500" />
        Unverified
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1 text-[1.05rem] font-medium text-emerald-600"
      title="Active & verified"
    >
      <span className="size-2 rounded-full bg-emerald-500" />
      Active
    </span>
  );
}

export function RecentUsersTable() {
  const { recentAccounts } = useDashboardData();
  const { recentLimit } = useDashboardLimits();

  return (
    <article className="admin-card-surface overflow-hidden rounded-2xl border">
      <header className="border-b border-sea-light/40 px-5 py-4 sm:px-6">
        <h2 className="text-[1.6rem] font-bold text-sea-deep">Recent accounts</h2>
        <p className="mt-0.5 text-[1.2rem] text-sea-mid/70">
          {recentLimit} newest sign-ups — contact, role, status &amp; last login
        </p>
      </header>
      <div className="overflow-x-auto">
        {recentAccounts.length === 0 ? (
          <p className="px-6 py-10 text-center text-[1.3rem] text-sea-mid/70">
            No accounts found yet.
          </p>
        ) : (
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-sea-light/30 bg-sea-foam/50 text-[1.1rem] font-semibold uppercase tracking-wide text-sea-mid/75">
                <th className="px-5 py-3 sm:px-6">User</th>
                <th className="px-3 py-3">Role</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Last login</th>
              </tr>
            </thead>
            <tbody>
              {recentAccounts.map((user, index) => {
                const initials = user.full_name
                  .split(/\s+/)
                  .slice(0, 2)
                  .map(p => p[0])
                  .join('')
                  .toUpperCase();

                return (
                  <tr
                    key={user.id}
                    className={cn(
                      'border-b border-sea-light/20 transition-colors hover:bg-sea-foam/40',
                      index === recentAccounts.length - 1 && 'border-b-0',
                    )}
                  >
                    <td className="px-5 py-3.5 sm:px-6">
                      <div className="flex items-center gap-3">
                        <span
                          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sea-mid to-sea-bright text-[1.15rem] font-bold text-white"
                          aria-hidden
                        >
                          {initials}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-sea-deep">
                            {user.full_name}
                          </p>
                          <p className="flex items-center gap-1 truncate text-[1.1rem] text-sea-mid/70">
                            <Mail className="size-3 shrink-0" aria-hidden />
                            {user.email}
                          </p>
                          <p className="flex items-center gap-1 text-[1.05rem] text-sea-mid/60">
                            <Phone className="size-3 shrink-0" aria-hidden />
                            {user.country_code} {user.phone_number}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3.5">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-3 py-3.5">
                      <StatusDot
                        active={user.is_active ?? true}
                        verified={user.is_verified}
                      />
                    </td>
                    <td className="px-3 py-3.5">
                      <span className="flex items-center gap-1 text-[1.15rem] font-medium text-sea-deep">
                        <Clock className="size-3.5 text-sea-mid" aria-hidden />
                        {formatRelativeTime(user.last_login_at)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </article>
  );
}
