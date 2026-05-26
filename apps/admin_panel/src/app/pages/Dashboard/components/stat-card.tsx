import React from 'react';
import type { LucideIcon } from 'lucide-react';

import { cn } from 'utils/twm';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from 'app/components/ui/tooltip';

type StatCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { label: string; positive?: boolean };
  tooltip?: string;
  accent?: 'default' | 'success' | 'warning' | 'violet';
  className?: string;
};

const accentMap = {
  default: 'from-sea-mid to-sea-bright',
  success: 'from-emerald-500 to-teal-500',
  warning: 'from-amber-500 to-orange-500',
  violet: 'from-violet-500 to-purple-500',
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  tooltip,
  accent = 'default',
  className,
}: StatCardProps) {
  const card = (
    <article
      className={cn(
        'admin-card-surface group relative flex h-full w-full min-h-[11rem] flex-col overflow-hidden rounded-2xl border p-5 transition-shadow hover:shadow-lg hover:shadow-sea-mid/10 sm:min-h-[12rem] sm:p-6',
        className,
      )}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-gradient-to-br from-sea-bright/15 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[1.35rem] font-medium text-sea-mid/75">{title}</p>
          <p className="mt-1.5 break-words text-[2.4rem] font-bold leading-tight tracking-tight text-sea-deep sm:text-[2.8rem]">
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-[1.2rem] text-sea-mid/65">{subtitle}</p>
          )}
          {trend && (
            <p
              className={cn(
                'mt-2 text-[1.1rem] font-semibold',
                trend.positive ? 'text-emerald-600' : 'text-amber-600',
              )}
            >
              {trend.label}
            </p>
          )}
        </div>
        <div
          className={cn(
            'flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg sm:size-16',
            accentMap[accent],
            accent === 'default' && 'shadow-sea-mid/25',
          )}
        >
          <Icon className="size-6 sm:size-7" strokeWidth={2} aria-hidden />
        </div>
      </div>
    </article>
  );

  if (!tooltip) return card;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex h-full w-full min-w-0 cursor-default">{card}</div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[220px]">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}
