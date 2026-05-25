import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Moon, Sun } from 'lucide-react';

import { Skeleton } from 'app/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from 'app/components/ui/tooltip';
import { useSidebar } from 'app/components/layout/sidebar-context';
import { cn } from 'utils/twm';

import type { SidebarProfile as SidebarProfileType } from './sidebar.types';

type SidebarProfileProps = {
  profile: SidebarProfileType;
  collapsed: boolean;
  isLoading?: boolean;
};

export default function SidebarProfile({
  profile,
  collapsed,
  isLoading,
}: SidebarProfileProps) {
  const { isDark, toggleDark } = useSidebar();

  if (isLoading) {
    return (
      <div
        className={cn(
          'border-t border-white/8 p-3',
          collapsed ? 'flex flex-col items-center gap-2' : 'space-y-2',
        )}
      >
        <Skeleton className={cn(collapsed ? 'size-11' : 'h-16 w-full')} />
        {!collapsed && <Skeleton className="h-9 w-full" />}
      </div>
    );
  }

  const profileCard = (
    <Link
      to={profile.href ?? '/settings'}
      className={cn(
        'group flex items-center rounded-2xl outline-none transition-all duration-300',
        'bg-gradient-to-br from-white/[0.08] to-white/[0.02] ring-1 ring-white/12',
        'hover:from-white/[0.12] hover:to-white/[0.04] hover:ring-white/20',
        'focus-visible:ring-2 focus-visible:ring-cyan-300/60',
        collapsed ? 'size-11 justify-center p-0' : 'gap-3 p-2.5',
      )}
      aria-label={`Profile: ${profile.name}`}
    >
      <div className="relative shrink-0">
        <div
          className={cn(
            'overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/15',
            collapsed ? 'size-9' : 'size-10',
          )}
        >
          {profile.avatarSrc ? (
            <img
              src={profile.avatarSrc}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            <span className="flex size-full items-center justify-center text-xs font-bold text-cyan-100">
              {profile.initials}
            </span>
          )}
        </div>
        {profile.isOnline !== false && (
          <span
            className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-[#0c1a2e] bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
            aria-label="Online"
          />
        )}
      </div>

      <AnimatePresence mode="wait">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            className="min-w-0 flex-1"
          >
            <p className="truncate text-[13px] font-semibold text-white">
              {profile.name}
            </p>
            <p className="truncate text-[11px] text-white/45">{profile.role}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {!collapsed && (
        <ChevronRight
          size={16}
          className="shrink-0 text-white/30 transition-transform group-hover:translate-x-0.5 group-hover:text-white/60"
          aria-hidden
        />
      )}
    </Link>
  );

  const themeToggle = (
    <button
      type="button"
      onClick={toggleDark}
      className={cn(
        'flex items-center justify-center rounded-2xl transition-all duration-300',
        'bg-white/5 text-white/55 ring-1 ring-white/10',
        'hover:bg-white/10 hover:text-white/90',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60',
        collapsed ? 'size-10' : 'h-9 w-full gap-2 px-3',
      )}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
      {!collapsed && (
        <span className="text-[12px] font-medium">
          {isDark ? 'Light mode' : 'Dark mode'}
        </span>
      )}
    </button>
  );

  return (
    <div
      className={cn(
        'mt-auto border-t border-white/8 p-3',
        collapsed ? 'flex flex-col items-center gap-2' : 'space-y-2',
      )}
    >
      {collapsed ? (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{profileCard}</TooltipTrigger>
          <TooltipContent side="right">
            {profile.name} · {profile.role}
          </TooltipContent>
        </Tooltip>
      ) : (
        profileCard
      )}

      {collapsed ? (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{themeToggle}</TooltipTrigger>
          <TooltipContent side="right">
            {isDark ? 'Light mode' : 'Dark mode'}
          </TooltipContent>
        </Tooltip>
      ) : (
        themeToggle
      )}
    </div>
  );
}
