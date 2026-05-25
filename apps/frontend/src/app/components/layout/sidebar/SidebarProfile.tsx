import React, { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Moon, Settings, Sun } from 'lucide-react';

import { useGlobalSlice } from 'app/slice';
import { useSidebar } from 'app/components/layout/sidebar-context';
import { Skeleton } from 'app/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from 'app/components/ui/tooltip';
import { cn } from 'utils/twm';

import type { SidebarProfile as SidebarProfileType } from './sidebar.types';

type SidebarProfileProps = {
  profile: SidebarProfileType;
  collapsed: boolean;
  isLoading?: boolean;
  isAuthenticated: boolean;
};

export default function SidebarProfile({
  profile,
  collapsed,
  isLoading,
  isAuthenticated,
}: SidebarProfileProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { actions } = useGlobalSlice();
  const { isDark, toggleDark } = useSidebar();

  const handleLogout = useCallback(() => {
    dispatch(actions.logout());
    navigate('/login', { replace: true });
  }, [actions, dispatch, navigate]);

  if (isLoading) {
    return (
      <div
        className={cn(
          'border-t border-white/10 p-3',
          collapsed ? 'flex flex-col items-center gap-2' : 'space-y-2',
        )}
      >
        <Skeleton className={cn(collapsed ? 'size-11' : 'h-[4.5rem] w-full')} />
        {!collapsed && <Skeleton className="h-9 w-full" />}
      </div>
    );
  }

  const settingsHref = profile.settingsHref ?? '/settings';

  const profileCard = (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl transition-all duration-300',
        'bg-gradient-to-br from-white/[0.1] via-white/[0.05] to-transparent',
        'ring-1 ring-white/15 hover:ring-white/25',
        'hover:shadow-[0_12px_32px_-12px_rgba(56,189,248,0.35)]',
        collapsed ? 'p-0' : 'p-2.5',
      )}
    >
      <div
        className={cn(
          'flex items-center',
          collapsed ? 'justify-center' : 'gap-3',
        )}
      >
        <div className="relative shrink-0">
          <div
            className={cn(
              'overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/20',
              collapsed ? 'size-10' : 'size-11',
            )}
          >
            {profile.avatarSrc ? (
              <img
                src={profile.avatarSrc}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              <span className="flex size-full items-center justify-center bg-gradient-to-br from-[#ff7b54]/30 to-[#38bdf8]/30 text-xs font-bold text-white">
                {profile.initials}
              </span>
            )}
          </div>
          {profile.isOnline !== false && (
            <span
              className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-[#1a3348] bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.85)]"
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
              <p className="truncate text-[11px] text-white/45">{profile.email}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!collapsed && isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2.5 flex gap-1.5"
        >
          <Link
            to={settingsHref}
            className={cn(
              'flex flex-1 items-center justify-center gap-1.5 rounded-xl py-1.5 text-[11px] font-semibold',
              'bg-white/8 text-white/75 ring-1 ring-white/10 transition-colors',
              'hover:bg-white/12 hover:text-white',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/60',
            )}
            aria-label="Settings"
          >
            <Settings size={13} aria-hidden />
            Settings
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className={cn(
              'flex items-center justify-center rounded-xl px-2.5 py-1.5',
              'bg-rose-500/15 text-rose-100 ring-1 ring-rose-400/25 transition-colors',
              'hover:bg-rose-500/25 hover:text-white',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/60',
            )}
            aria-label="Log out"
          >
            <LogOut size={14} aria-hidden />
          </button>
        </motion.div>
      )}
    </div>
  );

  const themeToggle = (
    <button
      type="button"
      onClick={toggleDark}
      className={cn(
        'flex items-center justify-center rounded-2xl transition-all duration-300',
        'bg-white/6 text-white/55 ring-1 ring-white/10',
        'hover:bg-white/10 hover:text-white/90',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/60',
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

  const guestCta = !isAuthenticated && !collapsed && (
    <Link
      to="/login"
      className={cn(
        'flex h-9 w-full items-center justify-center rounded-2xl text-[12px] font-semibold',
        'bg-gradient-to-r from-[#ff7b54] to-[#38bdf8] text-white shadow-lg',
        'hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/60',
      )}
    >
      Sign in to continue
    </Link>
  );

  const wrapWithTooltip = (node: React.ReactNode, label: string) =>
    collapsed ? (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{node}</TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    ) : (
      node
    );

  return (
    <div
      className={cn(
        'mt-auto border-t border-white/10 p-3',
        collapsed ? 'flex flex-col items-center gap-2' : 'space-y-2',
      )}
    >
      {wrapWithTooltip(
        isAuthenticated ? (
          <Link
            to="/profile"
            className="block outline-none focus-visible:ring-2 focus-visible:ring-sky-300/60 rounded-2xl"
            aria-label={`Profile: ${profile.name}`}
          >
            {profileCard}
          </Link>
        ) : (
          profileCard
        ),
        `${profile.name} · ${profile.email}`,
      )}

      {guestCta}

      {collapsed && isAuthenticated && (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={handleLogout}
              className={cn(
                'flex size-10 items-center justify-center rounded-2xl',
                'bg-rose-500/15 text-rose-100 ring-1 ring-rose-400/25',
                'hover:bg-rose-500/25',
              )}
              aria-label="Log out"
            >
              <LogOut size={16} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">Log out</TooltipContent>
        </Tooltip>
      )}

      {wrapWithTooltip(themeToggle, isDark ? 'Light mode' : 'Dark mode')}
    </div>
  );
}
