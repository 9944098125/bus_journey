import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock3, ArrowUpRight, Trash2 } from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from 'app/components/ui/tooltip';
import { cn } from 'utils/twm';

import { SIDEBAR_NAV_COLUMN } from './sidebar.constants';
import type { RecentRouteEntry } from './sidebar.types';

type SidebarRecentProps = {
  collapsed: boolean;
  recent: RecentRouteEntry[];
  onClearRecent: () => void;
  onNavigate?: () => void;
};

export default function SidebarRecent({
  collapsed,
  recent,
  onClearRecent,
  onNavigate,
}: SidebarRecentProps) {
  if (recent.length === 0) return null;

  return (
    <section
      className={cn(
        'mt-1 rounded-2xl border border-plum-600/10 bg-white/35 px-1 py-2 backdrop-blur-sm',
        collapsed ? 'w-full px-0.5' : SIDEBAR_NAV_COLUMN,
      )}
      aria-label="Recently visited"
    >
      <AnimatePresence mode="wait">
        {!collapsed && (
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1.5 px-2 pb-1.5 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-plum-700/45"
          >
            <Clock3 size={11} className="text-plum-500" aria-hidden />
            Recent stops
          </motion.h2>
        )}
      </AnimatePresence>

      <ul className="flex list-none flex-col gap-0.5 p-0" role="list">
        {recent.map((entry, index) => (
          <li key={entry.id} role="none" className="w-full">
            <NavLink
              to={entry.href}
              onClick={onNavigate}
              title={collapsed ? entry.title : undefined}
              className={({ isActive }) =>
                cn(
                  'group flex w-full items-center rounded-xl text-[12px] font-medium transition-all duration-300',
                  'hover:bg-plum-600/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-plum-500/45',
                  collapsed
                    ? 'justify-center px-0 py-2'
                    : 'justify-start gap-2 px-2 py-1.5',
                  isActive
                    ? 'bg-white/75 text-plum-900 shadow-sm ring-1 ring-plum-600/10'
                    : 'text-plum-700/55 hover:text-plum-900',
                )
              }
            >
              {!collapsed && (
                <span className="flex size-5 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-plum-600/18 to-plum-400/22 text-[9px] font-bold text-plum-700/70">
                  {index + 1}
                </span>
              )}
              <span className={cn('truncate', collapsed && 'sr-only')}>
                {entry.title}
              </span>
              {!collapsed && (
                <ArrowUpRight
                  size={12}
                  className="shrink-0 text-plum-500 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-70"
                  aria-hidden
                />
              )}
              {collapsed && (
                <span
                  className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-white/85 to-plum-100/85 text-[10px] font-bold text-plum-700/70 ring-1 ring-plum-600/10"
                  aria-hidden
                >
                  {index + 1}
                </span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>

      <div
        className={cn(
          'mt-1 border-t border-plum-600/8 pt-1.5',
          collapsed ? 'flex justify-center px-0.5' : 'px-1',
        )}
      >
        {collapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={onClearRecent}
                className={cn(
                  'flex size-8 items-center justify-center rounded-xl',
                  'text-plum-700/50 transition-colors hover:bg-plum-600/[0.08] hover:text-plum-800',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-plum-500/45',
                )}
                aria-label="Clear all recent stops"
              >
                <Trash2 size={14} aria-hidden />
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="border-plum-700/15 bg-plum-900 font-medium text-white"
            >
              Clear recent stops
            </TooltipContent>
          </Tooltip>
        ) : (
          <button
            type="button"
            onClick={onClearRecent}
            className={cn(
              'flex w-full items-center justify-center gap-1.5 rounded-xl px-2 py-1.5',
              'text-[11px] font-medium text-plum-700/50 transition-colors',
              'hover:bg-plum-600/[0.06] hover:text-plum-800',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-plum-500/45',
            )}
          >
            <Trash2 size={12} aria-hidden />
            Clear recent stops
          </button>
        )}
      </div>
    </section>
  );
}
