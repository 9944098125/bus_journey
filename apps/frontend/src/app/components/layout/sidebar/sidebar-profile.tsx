import React, { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Settings, UserRound } from 'lucide-react';

import { useGlobalSlice } from 'app/slice';
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

  const handleLogout = useCallback(() => {
    dispatch(actions.logout());
    navigate('/login', { replace: true });
  }, [actions, dispatch, navigate]);

  if (isLoading) {
    return (
      <div
        className={cn(
          'border-t border-plum-600/10 p-3',
          collapsed ? 'flex flex-col items-center gap-2' : 'space-y-2',
        )}
      >
        <Skeleton className={cn(collapsed ? 'size-11' : 'h-[4.5rem] w-full')} />
      </div>
    );
  }

  const settingsHref = profile.settingsHref ?? '/settings';

  const profileCard = (
    <motion.div
      whileHover={{ y: collapsed ? 0 : -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className={cn(
        'journey-profile-card group relative overflow-hidden rounded-2xl transition-all duration-300',
        'ring-1 ring-plum-600/10 hover:ring-plum-500/30',
        collapsed ? 'p-0' : 'p-2.5',
      )}
    >
      <span
        className="pointer-events-none absolute -right-6 -top-6 size-20 rounded-full bg-plum-400/18 blur-2xl transition-opacity group-hover:opacity-100"
        aria-hidden
      />
      <div
        className={cn(
          'relative flex items-center',
          collapsed ? 'justify-center' : 'gap-3',
        )}
      >
        <div className="relative shrink-0">
          <div
            className={cn(
              'overflow-hidden rounded-2xl ring-2 ring-white/80',
              'bg-gradient-to-br from-plum-600/18 to-plum-400/22',
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
              <span className="flex size-full items-center justify-center bg-gradient-to-br from-plum-600/30 to-plum-400/35 text-xs font-bold text-plum-900">
                {profile.initials}
              </span>
            )}
          </div>
          {profile.isOnline !== false && (
            <motion.span
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2.2, repeat: Infinity }}
              className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white bg-emerald-500 shadow-[0_0_10px_rgba(52,211,153,0.7)]"
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
              <p className="truncate text-[13px] font-semibold text-plum-900">
                {profile.name}
              </p>
              <p className="truncate text-[11px] text-plum-700/55">{profile.email}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {!collapsed && (
          <UserRound
            size={14}
            className="shrink-0 text-plum-700/30 transition-colors group-hover:text-plum-500"
            aria-hidden
          />
        )}
      </div>

      {!collapsed && isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mt-2.5 flex gap-1.5"
        >
          <Link
            to={settingsHref}
            className={cn(
              'flex flex-1 items-center justify-center gap-1.5 rounded-xl py-1.5 text-[11px] font-semibold',
              'bg-white/75 text-plum-700/80 ring-1 ring-plum-600/10 transition-all',
              'hover:bg-gradient-to-r hover:from-plum-600/10 hover:to-plum-400/10 hover:text-plum-900',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-plum-500/45',
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
              'flex items-center justify-center rounded-xl px-5 py-3',
              'bg-rose-50/90 text-rose-700 ring-1 ring-rose-200/80 transition-all',
              'hover:bg-rose-100 hover:shadow-sm',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/50',
            )}
            aria-label="Log out"
          >
            <LogOut size={28} aria-hidden />
          </button>
        </motion.div>
      )}
    </motion.div>
  );

  const guestCta = !isAuthenticated && !collapsed && (
    <Link
      to="/login"
      className={cn(
        'flex h-10 w-full items-center justify-center gap-2 rounded-2xl text-[12px] font-semibold text-white',
        'bg-gradient-to-r from-plum-700 via-plum-600 to-plum-500 shadow-lg shadow-plum-900/25',
        'transition-all hover:shadow-xl hover:brightness-105',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-plum-400/55',
      )}
    >
      Start your journey
    </Link>
  );

  const wrapWithTooltip = (node: React.ReactNode, label: string) =>
    collapsed ? (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{node}</TooltipTrigger>
        <TooltipContent side="right" className="bg-plum-900 text-white">
          {label}
        </TooltipContent>
      </Tooltip>
    ) : (
      node
    );

  return (
    <div
      className={cn(
        'mt-auto border-t border-plum-600/10 p-3',
        collapsed ? 'flex flex-col items-center gap-2' : 'space-y-2',
      )}
    >
      {wrapWithTooltip(
        isAuthenticated ? (
          <Link
            to="/profile"
            className="block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-plum-500/45"
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
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className={cn(
                'flex size-20 items-center justify-center rounded-2xl',
                'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
                'hover:bg-rose-100',
              )}
              aria-label="Log out"
            >
              <LogOut size={32} />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-plum-900 text-white">
            Log out
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
