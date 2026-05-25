import React, { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { LogOut, Settings } from 'lucide-react';

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
};

export default function SidebarProfile({
  profile,
  collapsed,
  isLoading,
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
          'border-t border-white/8 p-3',
          collapsed ? 'flex flex-col items-center gap-2' : 'space-y-2',
        )}
      >
        <Skeleton className={cn(collapsed ? 'size-11' : 'h-[4.5rem] w-full')} />
      </div>
    );
  }

  const settingsHref = profile.href ?? '/settings';

  const avatarBlock = (
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
  );

  const actionRow = (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative mt-2.5 flex gap-1.5"
    >
      <Link
        to={settingsHref}
        className={cn(
          'flex flex-1 items-center justify-center gap-1.5 rounded-xl py-1.5 text-[11px] font-semibold',
          'bg-white/10 text-white/80 ring-1 ring-white/15 transition-all',
          'hover:bg-white/15 hover:text-white',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60',
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
          'bg-rose-500/20 text-rose-200 ring-1 ring-rose-400/35 transition-all',
          'hover:bg-rose-500/30 hover:text-white hover:shadow-sm',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/50',
        )}
        aria-label="Log out"
      >
        <LogOut size={28} aria-hidden />
      </button>
    </motion.div>
  );

  const expandedCard = (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className={cn(
        'group relative overflow-hidden rounded-2xl p-2.5 transition-all duration-300',
        'bg-gradient-to-br from-white/[0.08] to-white/[0.02] ring-1 ring-white/12',
        'hover:from-white/[0.12] hover:to-white/[0.04] hover:ring-white/20',
      )}
    >
      <Link
        to={settingsHref}
        className={cn(
          'relative flex items-center gap-3 rounded-xl outline-none',
          'focus-visible:ring-2 focus-visible:ring-cyan-300/60',
        )}
        aria-label={`Profile: ${profile.name}`}
      >
        {avatarBlock}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold text-white">
            {profile.name}
          </p>
          <p className="truncate text-[11px] text-white/45">{profile.role}</p>
        </div>
      </Link>
      {actionRow}
    </motion.div>
  );

  const collapsedAvatarLink = (
    <Link
      to={settingsHref}
      className={cn(
        'group flex size-11 items-center justify-center rounded-2xl outline-none transition-all duration-300',
        'bg-gradient-to-br from-white/[0.08] to-white/[0.02] ring-1 ring-white/12',
        'hover:from-white/[0.12] hover:to-white/[0.04] hover:ring-white/20',
        'focus-visible:ring-2 focus-visible:ring-cyan-300/60',
      )}
      aria-label={`Profile: ${profile.name}`}
    >
      {avatarBlock}
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
        'mt-auto border-t border-white/8 p-3',
        collapsed ? 'flex flex-col items-center gap-2' : 'space-y-2',
      )}
    >
      {collapsed
        ? wrapWithTooltip(collapsedAvatarLink, `${profile.name} · ${profile.role}`)
        : expandedCard}

      {collapsed && (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className={cn(
                'flex size-20 items-center justify-center rounded-2xl',
                'bg-rose-500/20 text-rose-200 ring-1 ring-rose-400/35',
                'hover:bg-rose-500/30 hover:text-white',
              )}
              aria-label="Log out"
            >
              <LogOut size={32} />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent side="right">Log out</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
