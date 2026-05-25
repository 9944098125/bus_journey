import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock3 } from 'lucide-react';

import { cn } from 'utils/twm';

import type { RecentRouteEntry } from './sidebar.types';

type SidebarRecentProps = {
  collapsed: boolean;
  recent: RecentRouteEntry[];
  onNavigate?: () => void;
};

export default function SidebarRecent({
  collapsed,
  recent,
  onNavigate,
}: SidebarRecentProps) {
  if (recent.length === 0) return null;

  return (
    <section
      className={cn('border-t border-white/8 px-2 py-2', collapsed && 'px-1')}
      aria-label="Recently visited"
    >
      <AnimatePresence mode="wait">
        {!collapsed && (
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1.5 px-2 pb-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/35"
          >
            <Clock3 size={11} aria-hidden />
            Recent
          </motion.h2>
        )}
      </AnimatePresence>

      <ul className="flex list-none flex-col gap-0.5 p-0" role="list">
        {recent.map((entry, index) => (
          <li key={entry.id} role="none">
            <NavLink
              to={entry.href}
              onClick={onNavigate}
              title={collapsed ? entry.title : undefined}
              className={({ isActive }) =>
                cn(
                  'group flex items-center rounded-2xl text-[12px] font-medium transition-all duration-300',
                  'hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/60',
                  collapsed
                    ? 'justify-center px-0 py-2'
                    : 'gap-2 px-2.5 py-1.5',
                  isActive ? 'text-white' : 'text-white/50 hover:text-white/85',
                )
              }
            >
              {!collapsed && (
                <span className="size-1.5 shrink-0 rounded-full bg-gradient-to-r from-[#ff7b54] to-[#38bdf8] opacity-70" />
              )}
              <span className={cn('truncate', collapsed && 'sr-only')}>
                {entry.title}
              </span>
              {collapsed && (
                <span
                  className="flex size-8 items-center justify-center rounded-xl bg-white/6 text-[10px] font-bold text-white/70"
                  aria-hidden
                >
                  {index + 1}
                </span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
