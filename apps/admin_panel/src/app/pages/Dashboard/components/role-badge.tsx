import React from 'react';

import { cn } from 'utils/twm';
import type { UserRole } from 'types/user';

import { ROLE_LABELS, ROLE_STYLES } from '../utils/dashboard-utils';

type RoleBadgeProps = {
  role: UserRole;
  className?: string;
};

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const styles = ROLE_STYLES[role];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg px-2 py-0.5 text-[1.1rem] font-semibold ring-1',
        styles.bg,
        styles.text,
        styles.ring,
        className,
      )}
    >
      {ROLE_LABELS[role]}
    </span>
  );
}
