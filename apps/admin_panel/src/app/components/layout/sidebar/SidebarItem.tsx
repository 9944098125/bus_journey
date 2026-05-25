import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from 'app/components/ui/tooltip';
import { cn } from 'utils/twm';

import type { SidebarNavItem } from './sidebar.types';

type SidebarItemProps = {
  item: SidebarNavItem;
  collapsed: boolean;
  onNavigate?: () => void;
  animatedActive?: boolean;
};

const badgeStyles = {
  default: 'bg-white/15 text-white/90',
  warning: 'bg-amber-400/20 text-amber-200 ring-1 ring-amber-400/30',
  success: 'bg-emerald-400/20 text-emerald-200 ring-1 ring-emerald-400/35',
  destructive: 'bg-rose-400/20 text-rose-100 ring-1 ring-rose-400/35',
} as const;

function SidebarBadge({
  badge,
  variant = 'default',
  collapsed,
}: {
  badge: number | string;
  variant?: keyof typeof badgeStyles;
  collapsed: boolean;
}) {
  const isLive = typeof badge === 'string';

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-2xl text-[10px] font-bold uppercase tracking-wide',
        badgeStyles[variant],
        collapsed
          ? 'absolute -right-0.5 -top-0.5 size-2 rounded-full p-0 ring-2 ring-[#0c1a2e]'
          : isLive
            ? 'px-2 py-0.5'
            : 'min-w-[1.25rem] px-1.5 py-0.5',
      )}
      aria-label={typeof badge === 'number' ? `${badge} notifications` : badge}
    >
      {!collapsed && (typeof badge === 'number' ? (badge > 99 ? '99+' : badge) : badge)}
    </span>
  );
}

function SidebarItemContent({
  item,
  isActive,
  collapsed,
  animatedActive,
}: {
  item: SidebarNavItem;
  isActive: boolean;
  collapsed: boolean;
  animatedActive: boolean;
}) {
  const Icon = item.icon;

  return (
    <>
      {isActive &&
        (animatedActive ? (
          <motion.span
            layoutId="sidebar-active-pill"
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/14 via-white/10 to-white/6 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] ring-1 ring-white/15"
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            aria-hidden
          />
        ) : (
          <span
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/14 via-white/10 to-white/6 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] ring-1 ring-white/15"
            aria-hidden
          />
        ))}

      <motion.span
        className={cn(
          'relative z-[1] flex shrink-0 items-center justify-center rounded-2xl transition-colors duration-300',
          collapsed ? 'size-10' : 'size-9',
          isActive
            ? 'bg-white/12 text-white shadow-[0_8px_24px_-8px_rgba(0,180,216,0.55)]'
            : 'bg-white/0 text-white/55 group-hover:bg-white/8 group-hover:text-white/90',
        )}
        whileHover={{ scale: 1.04, rotate: collapsed ? 0 : -2 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 420, damping: 22 }}
      >
        <Icon
          size={collapsed ? 20 : 18}
          strokeWidth={isActive ? 2.25 : 2}
          className="transition-transform duration-300 group-hover:scale-105"
          aria-hidden
        />
      </motion.span>

      {!collapsed && (
        <motion.span
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-[1] min-w-0 flex-1 truncate text-[13px] font-semibold tracking-tight"
        >
          <span className={cn(isActive ? 'text-white' : 'text-white/65 group-hover:text-white/90')}>
            {item.title}
          </span>
        </motion.span>
      )}

      {item.badge !== undefined && (
        <span className={cn('relative z-[1]', collapsed && 'absolute right-1 top-1')}>
          <SidebarBadge
            badge={item.badge}
            variant={item.badgeVariant}
            collapsed={collapsed}
          />
        </span>
      )}
    </>
  );
}

export default function SidebarItem({
  item,
  collapsed,
  onNavigate,
  animatedActive = true,
}: SidebarItemProps) {
  const link = (
    <NavLink
      to={item.href}
      end={item.href === '/'}
      onClick={onNavigate}
      aria-label={item.title}
      tabIndex={item.disabled ? -1 : 0}
      className={({ isActive }) =>
        cn(
          'group relative flex w-full items-center rounded-2xl outline-none transition-[padding,background] duration-300',
          'focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
          collapsed ? 'justify-center px-0 py-2' : 'gap-3 px-2.5 py-2',
          item.disabled && 'pointer-events-none opacity-40',
          !isActive && 'hover:bg-white/[0.04]',
        )
      }
    >
      {({ isActive }) => (
        <SidebarItemContent
          item={item}
          isActive={isActive}
          collapsed={collapsed}
          animatedActive={animatedActive}
        />
      )}
    </NavLink>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={12}>
          {item.title}
          {item.badge !== undefined && (
            <span className="ml-2 opacity-70">
              ({typeof item.badge === 'number' ? item.badge : item.badge})
            </span>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return link;
}
