import React from 'react';
import { Bell, Mail, MessageSquare } from 'lucide-react';

import { Progress } from 'app/components/ui/progress';
import { Switch } from 'app/components/ui/switch';

import { useDashboardData } from '../hooks/use-dashboard';

export function NotificationPrefsCard() {
  const { analytics } = useDashboardData();
  const prefs = analytics.notificationPreferences;

  return (
    <article className="admin-card-surface flex h-full w-full min-h-[22rem] flex-col rounded-2xl border p-5 sm:p-6">
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
            <span className="font-bold text-sea-deep">
              {prefs.emailOptInPercent}%
            </span>
          </div>
          <Progress value={prefs.emailOptInPercent} />
          <p className="mt-1 text-[1.1rem] text-sea-mid/65">
            {prefs.emailNotificationsOn.toLocaleString('en-IN')} users enabled
          </p>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="size-4 text-sea-mid" aria-hidden />
              <span className="font-semibold text-sea-deep">SMS opt-in</span>
            </div>
            <span className="font-bold text-sea-deep">{prefs.smsOptInPercent}%</span>
          </div>
          <Progress
            value={prefs.smsOptInPercent}
            indicatorClassName="bg-gradient-to-r from-violet-500 to-purple-500"
          />
          <p className="mt-1 text-[1.1rem] text-sea-mid/65">
            {prefs.smsNotificationsOn.toLocaleString('en-IN')} users enabled
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-dashed border-sea-light/60 bg-sea-foam/40 p-4">
        <p className="mb-3 text-[1.15rem] font-medium text-sea-mid/80">
          Platform-wide preference summary
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
          <label className="flex cursor-default items-center gap-3">
            <Switch
              checked={prefs.emailOptInPercent > 50}
              disabled
              aria-readonly
            />
            <span className="text-[1.2rem] text-sea-deep">Email majority on</span>
          </label>
          <label className="flex cursor-default items-center gap-3">
            <Switch
              checked={prefs.smsOptInPercent > 50}
              disabled
              aria-readonly
            />
            <span className="text-[1.2rem] text-sea-deep">SMS majority on</span>
          </label>
        </div>
      </div>
    </article>
  );
}
