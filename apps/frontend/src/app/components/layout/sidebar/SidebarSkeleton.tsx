import React from 'react';

import { Skeleton } from 'app/components/ui/skeleton';
import { cn } from 'utils/twm';

type SidebarSkeletonProps = {
  collapsed: boolean;
};

export default function SidebarSkeleton({ collapsed }: SidebarSkeletonProps) {
  return (
    <div
      className={cn(
        'flex flex-1 flex-col gap-3 px-3 py-2',
        collapsed && 'items-center px-2',
      )}
      aria-busy="true"
      aria-label="Loading navigation"
    >
      {Array.from({ length: collapsed ? 6 : 8 }).map((_, i) => (
        <div
          key={i}
          className={cn('flex items-center gap-3', collapsed && 'justify-center')}
        >
          <Skeleton className={cn(collapsed ? 'size-10' : 'size-9 shrink-0')} />
          {!collapsed && <Skeleton className="h-3 flex-1" />}
        </div>
      ))}
    </div>
  );
}
