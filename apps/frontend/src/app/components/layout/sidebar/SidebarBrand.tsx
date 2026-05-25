import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

import { Skeleton } from 'app/components/ui/skeleton';
import { cn } from 'utils/twm';

import { SIDEBAR_BRAND } from './sidebar.constants';

type SidebarBrandProps = {
  collapsed: boolean;
  isLoading?: boolean;
};

export default function SidebarBrand({ collapsed, isLoading }: SidebarBrandProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          'flex items-center gap-3 border-b border-white/10 px-3 pb-4 pt-2',
          collapsed && 'justify-center px-2',
        )}
      >
        <Skeleton className="size-12 shrink-0 rounded-2xl" />
        {!collapsed && (
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-2.5 w-36" />
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to="/"
      className={cn(
        'group flex items-center gap-3 rounded-2xl border-b border-white/10 px-3 pb-4 pt-2 outline-none transition-colors',
        'hover:bg-white/[0.04] focus-visible:ring-2 focus-visible:ring-sky-300/60',
        collapsed ? 'justify-center px-2' : '',
      )}
      aria-label={`${SIDEBAR_BRAND.title} home`}
    >
      <motion.div
        className={cn(
          'relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl',
          'bg-gradient-to-br from-[#ff7b54]/40 via-white/12 to-[#38bdf8]/25',
          'shadow-[0_0_32px_-6px_rgba(255,123,84,0.65),0_12px_32px_-12px_rgba(56,189,248,0.5)]',
          'ring-1 ring-white/25 backdrop-blur-md',
          collapsed ? 'size-11' : 'size-12',
        )}
        whileHover={{ scale: 1.04 }}
        transition={{ type: 'spring', stiffness: 400, damping: 24 }}
      >
        <span
          className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_30%_20%,rgba(255,200,150,0.45),transparent_55%)]"
          aria-hidden
        />
        <span
          className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-[#ff7b54]/30 to-[#38bdf8]/20 blur-md opacity-80 group-hover:opacity-100"
          aria-hidden
        />
        <img
          src={SIDEBAR_BRAND.logoSrc}
          alt={SIDEBAR_BRAND.logoAlt}
          className="relative z-[1] size-8 rounded-xl object-cover"
          width={32}
          height={32}
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
            <p className="truncate bg-gradient-to-r from-white via-white to-sky-100 bg-clip-text text-[15px] font-bold tracking-tight text-transparent">
              {SIDEBAR_BRAND.title}
            </p>
            <p className="truncate text-[11px] font-medium text-white/50">
              {SIDEBAR_BRAND.subtitle}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </Link>
  );
}
