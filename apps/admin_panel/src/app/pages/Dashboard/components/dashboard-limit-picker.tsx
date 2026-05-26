import React from 'react';
import { Loader2 } from 'lucide-react';

import { cn } from 'utils/twm';

type DashboardLimitPickerProps = {
  id: string;
  label: string;
  description: string;
  value: number;
  options: readonly number[];
  onChange: (value: number) => void;
  formatOption?: (value: number) => string;
  disabled?: boolean;
  isUpdating?: boolean;
  className?: string;
};

const defaultFormatOption = (value: number) => String(value);

export function DashboardLimitPicker({
  id,
  label,
  description,
  value,
  options,
  onChange,
  formatOption = defaultFormatOption,
  disabled = false,
  isUpdating = false,
  className,
}: DashboardLimitPickerProps) {
  const isDisabled = disabled || isUpdating;

  return (
    <div
      className={cn(
        'admin-card-surface w-full shrink-0 rounded-2xl border border-sea-light/45 bg-gradient-to-br from-white via-white to-sea-foam/40 p-4 shadow-sm sm:p-5',
        className,
      )}
      role="group"
      aria-labelledby={`${id}-label`}
      aria-describedby={`${id}-description`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p
              id={`${id}-label`}
              className="text-[1.25rem] font-semibold text-sea-deep"
            >
              {label}
            </p>
            {isUpdating && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sea-pale/70 px-2.5 py-0.5 text-[1.05rem] font-medium text-sea-mid">
                <Loader2
                  className="size-3.5 animate-spin text-sea-bright"
                  aria-hidden
                />
                Updating…
              </span>
            )}
          </div>
          <p
            id={`${id}-description`}
            className="mt-1 text-[1.15rem] leading-snug text-sea-mid/75"
          >
            {description}
          </p>
        </div>
        <p className="shrink-0 rounded-xl bg-sea-deep/8 px-3 py-1.5 text-[1.1rem] font-semibold text-sea-deep sm:text-right">
          Showing{' '}
          <span className="tabular-nums text-sea-bright">{value}</span>
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {options.map(option => {
          const isSelected = option === value;

          return (
            <button
              key={option}
              type="button"
              disabled={isDisabled}
              aria-pressed={isSelected}
              onClick={() => {
                if (!isSelected) {
                  onChange(option);
                }
              }}
              className={cn(
                'min-w-[3.6rem] rounded-xl border px-3.5 py-2 text-[1.15rem] font-semibold tabular-nums transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea-mid/30 focus-visible:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50',
                isSelected
                  ? 'border-sea-mid bg-gradient-to-br from-sea-mid to-sea-bright text-white shadow-md shadow-sea-mid/25'
                  : 'border-sea-light/55 bg-white text-sea-mid hover:border-sea-mid/40 hover:bg-sea-foam/80 hover:text-sea-deep active:scale-[0.98]',
              )}
            >
              {formatOption(option)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
