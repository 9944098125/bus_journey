import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { cn } from 'utils/twm';

import SidebarItem from './SidebarItem';
import type { SidebarNavGroup } from './sidebar.types';

type SidebarGroupProps = {
  group: SidebarNavGroup;
  collapsed: boolean;
  onNavigate?: () => void;
  animatedActive?: boolean;
};

export default function SidebarGroup({
  group,
  collapsed,
  onNavigate,
  animatedActive,
}: SidebarGroupProps) {
  return (
    <section
      className={cn('flex flex-col', collapsed ? 'gap-0.5' : 'gap-1')}
      aria-labelledby={`sidebar-group-${group.id}`}
    >
      <AnimatePresence mode="wait">
        {!collapsed && (
          <motion.h2
            id={`sidebar-group-${group.id}`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="px-3 pb-1 pt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 first:pt-1"
          >
            {group.label}
          </motion.h2>
        )}
      </AnimatePresence>

      <ul className="flex list-none flex-col gap-0.5 p-0" role="list">
        {group.items.map(item => (
          <li key={item.id} role="none">
            <SidebarItem
              item={item}
              collapsed={collapsed}
              onNavigate={onNavigate}
              animatedActive={animatedActive}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
