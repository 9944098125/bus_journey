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
  default:
    'bg-gradient-to-r from-plum-600/10 to-plum-400/10 text-plum-900 ring-1 ring-plum-600/12',
  warning: 'bg-amber-100 text-amber-800 ring-1 ring-amber-300/50',
  success: 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300/50',
  destructive: 'bg-rose-100 text-rose-800 ring-1 ring-rose-300/50',
  accent: 'bg-plum-100 text-plum-800 ring-1 ring-plum-300/50',
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
          ? 'absolute -right-0.5 -top-0.5 size-2.5 rounded-full p-0 ring-2 ring-white shadow-[0_0_8px_rgba(95,15,64,0.55)]'
          : isLive
            ? 'px-2 py-0.5'
            : 'min-w-[1.25rem] px-1.5 py-0.5',
      )}
      aria-label={typeof badge === 'number' ? `${badge} notifications` : badge}
    >
      {!collapsed &&
        (typeof badge === 'number' ? (badge > 99 ? '99+' : badge) : badge)}
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
      {isActive && (
        <span
          className="absolute left-0 top-1/2 z-[2] h-[60%] w-[3px] -translate-y-1/2 rounded-r-full bg-gradient-to-b from-plum-600 via-plum-400 to-plum-300 shadow-[0_0_12px_rgba(95,15,64,0.55)]"
          aria-hidden
        />
      )}

      {isActive &&
        (animatedActive ? (
          <motion.span
            layoutId="travel-sidebar-active-pill"
            className={cn(
              'absolute inset-0 rounded-2xl',
              'bg-gradient-to-r from-plum-600/14 via-white/75 to-plum-400/14',
              'journey-nav-item-glow ring-1 ring-plum-500/25',
            )}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            aria-hidden
          />
        ) : (
          <span
            className={cn(
              'absolute inset-0 rounded-2xl',
              'bg-gradient-to-r from-plum-600/14 via-white/75 to-plum-400/14',
              'journey-nav-item-glow ring-1 ring-plum-500/25',
            )}
            aria-hidden
          />
        ))}

      <motion.span
        className={cn(
          'relative z-[1] flex shrink-0 items-center justify-center rounded-2xl transition-all duration-300',
          collapsed ? 'size-11' : 'size-10',
          isActive
            ? 'bg-gradient-to-br from-white to-plum-100 text-plum-900 shadow-md'
            : 'bg-transparent text-plum-700/55 group-hover:bg-white/65 group-hover:text-plum-900 group-hover:shadow-sm',
        )}
        whileHover={{ scale: 1.08, rotate: collapsed ? 0 : -4 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 420, damping: 22 }}
      >
        <Icon
          size={collapsed ? 24 : 22}
          strokeWidth={isActive ? 2.35 : 2}
          className={cn(
            'transition-all duration-300',
            isActive && 'drop-shadow-[0_0_6px_rgba(95,15,64,0.4)]',
          )}
          aria-hidden
        />
      </motion.span>

      {!collapsed && (
        <motion.span
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-[1] min-w-0 flex-1 truncate text-[13px] font-semibold tracking-tight"
        >
          <span
            className={cn(
              'transition-colors duration-300',
              isActive
                ? 'text-plum-900'
                : 'text-plum-700/60 group-hover:text-plum-900',
            )}
          >
            {item.title}
          </span>
        </motion.span>
      )}

      {item.badge !== undefined && (
        <span
          className={cn(
            'relative z-[1] shrink-0',
            collapsed ? 'absolute right-1 top-1' : 'ml-auto',
          )}
        >
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
      data-prefetch={item.prefetch ? 'true' : undefined}
      className={({ isActive }) =>
        cn(
          'journey-nav-item-ripple group relative flex items-center rounded-2xl outline-none transition-all duration-300',
          'focus-visible:ring-2 focus-visible:ring-plum-500/45 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
          collapsed
            ? 'w-full justify-center px-0 py-2'
            : 'w-full justify-start gap-3 px-2 py-2',
          item.disabled && 'pointer-events-none opacity-40',
          !isActive && 'hover:bg-plum-600/[0.06]',
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
        <TooltipContent
          side="right"
          sideOffset={14}
          className="border-plum-700/20 bg-plum-900 text-white"
        >
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
