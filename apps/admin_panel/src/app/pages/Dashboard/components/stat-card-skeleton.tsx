import React from 'react';

import { Skeleton } from 'app/components/ui/skeleton';
import { cn } from 'utils/twm';

/** Mirrors `StatCard` shell and inner layout for loading state. */
export function StatCardSkeleton({ className }: { className?: string }) {
  return (
    <article
      aria-hidden
      className={cn(
        'admin-card-surface relative flex h-full w-full min-h-[11rem] flex-col overflow-hidden rounded-2xl border p-5 sm:min-h-[12rem] sm:p-6',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-2.5">
          <Skeleton className="h-[1.35rem] w-[58%] max-w-[10rem] rounded-md" />
          <Skeleton className="h-[2.8rem] w-[50%] max-w-[8rem] rounded-lg" />
          <Skeleton className="h-[1.2rem] w-[72%] max-w-[12rem] rounded-md" />
        </div>
        <Skeleton className="size-14 shrink-0 rounded-xl sm:size-16" />
      </div>
    </article>
  );
}
