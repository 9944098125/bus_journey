import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

import { Skeleton } from 'app/components/ui/skeleton';
import { cn } from 'utils/twm';

import { SIDEBAR_BRAND } from './sidebar-items';

type SidebarBrandProps = {
  collapsed: boolean;
  isLoading?: boolean;
};

export default function SidebarBrand({ collapsed, isLoading }: SidebarBrandProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          'flex items-center gap-3 border-b border-white/8 px-3 pb-4 pt-1',
          collapsed && 'justify-center px-2',
        )}
      >
        <Skeleton className="size-11 shrink-0" />
        {!collapsed && (
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-2.5 w-32" />
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to="/"
      className={cn(
        'group flex items-center gap-3 rounded-2xl border-b border-white/8 px-3 pb-4 pt-1 outline-none transition-colors',
        'hover:bg-white/[0.04] focus-visible:ring-2 focus-visible:ring-cyan-300/60',
        collapsed ? 'justify-center px-2' : '',
      )}
      aria-label={`${SIDEBAR_BRAND.title} home`}
    >
      <motion.div
        className={cn(
          'relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl',
          'bg-gradient-to-br from-cyan-400/25 via-white/10 to-white/5',
          'shadow-[0_12px_32px_-12px_rgba(0,180,216,0.65)] ring-1 ring-white/20 backdrop-blur-md',
          collapsed ? 'size-11' : 'size-12',
        )}
        whileHover={{ scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 400, damping: 24 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(144,224,239,0.35),transparent_55%)]" />
        <img
          src={SIDEBAR_BRAND.logoSrc}
          alt={SIDEBAR_BRAND.logoAlt}
          className="relative z-[1] size-7 object-contain"
          width={28}
          height={28}
        />
      </motion.div>

      <AnimatePresence mode="wait">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.22 }}
            className="min-w-0 flex-1"
          >
            <p className="truncate text-[15px] font-bold tracking-tight text-white">
              {SIDEBAR_BRAND.title}
            </p>
            <p className="truncate text-[11px] font-medium text-white/45">
              {SIDEBAR_BRAND.subtitle}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </Link>
  );
}
