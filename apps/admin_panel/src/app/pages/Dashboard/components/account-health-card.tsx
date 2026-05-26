import React from 'react';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

import { Progress } from 'app/components/ui/progress';

import { DASHBOARD_KPIS } from '../utils/dashboard-mock-data';

export function AccountHealthCard() {
  const k = DASHBOARD_KPIS;
  const verifiedPct = Math.round((k.verifiedUsers / k.totalUsers) * 100);
  const activePct = Math.round((k.activeUsers / k.totalUsers) * 100);
  const inactivePct = Math.round((k.inactiveUsers / k.totalUsers) * 100);
  const pendingPct = Math.round((k.pendingVerification / k.totalUsers) * 100);

  const metrics = [
    {
      label: 'Verified',
      field: 'is_verified',
      value: verifiedPct,
      count: k.verifiedUsers,
      icon: CheckCircle2,
      color: 'from-emerald-500 to-teal-500',
      textColor: 'text-emerald-600',
    },
    {
      label: 'Active',
      field: 'is_active',
      value: activePct,
      count: k.activeUsers,
      icon: CheckCircle2,
      color: 'from-sea-mid to-sea-bright',
      textColor: 'text-sea-mid',
    },
    {
      label: 'Pending verification',
      field: 'is_verified: false',
      value: pendingPct,
      count: k.pendingVerification,
      icon: AlertCircle,
      color: 'from-amber-500 to-orange-500',
      textColor: 'text-amber-600',
    },
    {
      label: 'Inactive',
      field: 'is_active: false',
      value: inactivePct,
      count: k.inactiveUsers,
      icon: XCircle,
      color: 'from-slate-400 to-slate-500',
      textColor: 'text-slate-600',
    },
  ];

  return (
    <article className="admin-card-surface rounded-2xl border p-5 sm:p-6">
      <header className="mb-5">
        <h2 className="text-[1.6rem] font-bold text-sea-deep">Account health</h2>
        <p className="mt-0.5 text-[1.2rem] text-sea-mid/70">
          Verification & activation flags on the user model
        </p>
      </header>
      <ul className="grid gap-4 sm:grid-cols-2">
        {metrics.map(m => {
          const Icon = m.icon;
          return (
            <li
              key={m.label}
              className="rounded-xl border border-sea-light/40 bg-white/40 p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`size-4 ${m.textColor}`} aria-hidden />
                  <span className="font-semibold text-sea-deep">{m.label}</span>
                </div>
                <span className={`text-[1.3rem] font-bold ${m.textColor}`}>
                  {m.value}%
                </span>
              </div>
              <Progress
                value={m.value}
                indicatorClassName={`bg-gradient-to-r ${m.color}`}
              />
              <p className="mt-2 text-[1.1rem] text-sea-mid/65">
                {m.count.toLocaleString('en-IN')} users ·{' '}
                <span className="font-mono text-[1rem]">{m.field}</span>
              </p>
            </li>
          );
        })}
      </ul>
    </article>
  );
}
