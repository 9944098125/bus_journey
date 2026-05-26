import React from 'react';
import { Bell, Mail, MessageSquare } from 'lucide-react';

import { Progress } from 'app/components/ui/progress';
import { Switch } from 'app/components/ui/switch';

import { DASHBOARD_KPIS } from '../utils/dashboard-mock-data';

export function NotificationPrefsCard() {
  const k = DASHBOARD_KPIS;
  const emailPct = Math.round((k.emailNotificationsOn / k.totalUsers) * 100);
  const smsPct = Math.round((k.smsNotificationsOn / k.totalUsers) * 100);

  return (
    <article className="admin-card-surface rounded-2xl border p-5 sm:p-6">
      <header className="mb-5 flex items-center gap-2">
        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-sea-mid to-sea-bright text-white">
          <Bell className="size-5" aria-hidden />
        </div>
        <div>
          <h2 className="text-[1.6rem] font-bold text-sea-deep">
            Notification preferences
          </h2>
          <p className="text-[1.2rem] text-sea-mid/70">
            <code className="text-sea-mid">preferences.email_notifications</code>{' '}
            &amp; <code className="text-sea-mid">sms_notifications</code>
          </p>
        </div>
      </header>

      <div className="space-y-5">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="size-4 text-sea-mid" aria-hidden />
              <span className="font-semibold text-sea-deep">Email opt-in</span>
            </div>
            <span className="font-bold text-sea-deep">{emailPct}%</span>
          </div>
          <Progress value={emailPct} />
          <p className="mt-1 text-[1.1rem] text-sea-mid/65">
            {k.emailNotificationsOn.toLocaleString('en-IN')} users enabled
          </p>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="size-4 text-sea-mid" aria-hidden />
              <span className="font-semibold text-sea-deep">SMS opt-in</span>
            </div>
            <span className="font-bold text-sea-deep">{smsPct}%</span>
          </div>
          <Progress
            value={smsPct}
            indicatorClassName="bg-gradient-to-r from-violet-500 to-purple-500"
          />
          <p className="mt-1 text-[1.1rem] text-sea-mid/65">
            {k.smsNotificationsOn.toLocaleString('en-IN')} users enabled
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-dashed border-sea-light/60 bg-sea-foam/40 p-4">
        <p className="mb-3 text-[1.15rem] font-medium text-sea-mid/80">
          Example preference toggles (static preview)
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
          <label className="flex cursor-default items-center gap-3">
            <Switch checked disabled aria-readonly />
            <span className="text-[1.2rem] text-sea-deep">Email alerts</span>
          </label>
          <label className="flex cursor-default items-center gap-3">
            <Switch checked={false} disabled aria-readonly />
            <span className="text-[1.2rem] text-sea-deep">SMS alerts</span>
          </label>
        </div>
      </div>
    </article>
  );
}
