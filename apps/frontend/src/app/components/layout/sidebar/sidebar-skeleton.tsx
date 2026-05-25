import React from 'react';
import { motion } from 'framer-motion';

import { Skeleton } from 'app/components/ui/skeleton';
import { cn } from 'utils/twm';

import { SIDEBAR_NAV_COLUMN } from './sidebar.constants';

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
        <motion.div
          key={i}
          initial={{ opacity: 0.4 }}
          animate={{ opacity: [0.4, 0.85, 0.4] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.08 }}
          className={cn(
            'flex w-full items-center gap-3',
            collapsed && 'justify-center',
          )}
        >
          <Skeleton
            className={cn(
              'rounded-2xl bg-gradient-to-br from-plum-600/10 to-plum-400/10',
              collapsed ? 'size-11' : 'size-10 shrink-0',
            )}
          />
          {!collapsed && (
            <Skeleton className="h-3 flex-1 rounded-xl bg-plum-600/8" />
          )}
        </motion.div>
      ))}
    </div>
  );
}
