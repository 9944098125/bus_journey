import React from 'react';

import { Skeleton } from 'app/components/ui/skeleton';
import { cn } from 'utils/twm';

import { SIDEBAR_NAV_COLUMN } from './sidebar-items';

type SidebarSkeletonProps = {
  collapsed: boolean;
};

export default function SidebarSkeleton({ collapsed }: SidebarSkeletonProps) {
  return (
    <div
      className={cn(
        'flex flex-1 flex-col gap-3 py-2',
        collapsed ? 'items-center px-2' : cn(SIDEBAR_NAV_COLUMN, 'px-1'),
      )}
      aria-busy="true"
      aria-label="Loading navigation"
    >
      {Array.from({ length: collapsed ? 6 : 8 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'flex w-full items-center gap-3',
            collapsed && 'justify-center',
          )}
        >
          <Skeleton className={cn(collapsed ? 'size-11' : 'size-10 shrink-0')} />
          {!collapsed && <Skeleton className="h-3 flex-1" />}
        </div>
      ))}
    </div>
  );
}
