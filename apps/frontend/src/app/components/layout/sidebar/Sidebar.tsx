import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

import { selectUser } from 'app/slice/selectors';
import { Sheet, SheetContent } from 'app/components/ui/sheet';
import { TooltipProvider } from 'app/components/ui/tooltip';
import { useSidebar } from 'app/components/layout/sidebar-context';
import { useMediaQuery } from 'utils/hooks/use-media-query';
import {
  getUserDisplayName,
  getUserEmail,
  getUserInitials,
  getUserProfilePicture,
} from 'utils/user-display';
import { cn } from 'utils/twm';

import SidebarGroup from './sidebar-group';
import SidebarProfile from './sidebar-profile';
import SidebarRecent from './sidebar-recent';
import SidebarSearch from './sidebar-search';
import SidebarSkeleton from './sidebar-skeleton';
import SidebarToggle from './sidebar-toggle';
import {
  SIDEBAR_COLLAPSED_WIDTH,
  SIDEBAR_DESKTOP_BREAKPOINT,
  SIDEBAR_EXPANDED_WIDTH,
  SIDEBAR_NAV_ID,
} from './sidebar.constants';
import { useRecentRoutes } from './use-recent-routes';
import { useSidebarFilter } from './use-sidebar-filter';
import type { SidebarProfile as SidebarProfileType } from './sidebar.types';

type SidebarPanelProps = {
  collapsed: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
  onNavigate?: () => void;
  animatedActive?: boolean;
  className?: string;
};

function SidebarPanel({
  collapsed,
  isLoading,
  isAuthenticated,
  searchQuery,
  onSearchChange,
  onSearchClear,
  onNavigate,
  animatedActive = true,
  className,
}: SidebarPanelProps) {
  const user = useSelector(selectUser);
  const filteredGroups = useSidebarFilter(searchQuery, { isAuthenticated });
  const { recent, clearRecent } = useRecentRoutes();

  const profile: SidebarProfileType = useMemo(
    () => ({
      name: getUserDisplayName(user),
      email: getUserEmail(user),
      avatarSrc: getUserProfilePicture(user),
      initials: getUserInitials(user),
      isOnline: Boolean(user),
      settingsHref: '/settings',
    }),
    [user],
  );

  return (
    <div className={cn('relative z-[1] flex h-full min-h-0 flex-col', className)}>
      <SidebarSearch
        collapsed={collapsed}
        value={searchQuery}
        onChange={onSearchChange}
        onClear={onSearchClear}
      />

      <nav
        id={SIDEBAR_NAV_ID}
        className={cn(
          'travel-sidebar-scroll flex min-h-0 flex-1 flex-col items-center overflow-y-auto overflow-x-hidden',
          collapsed ? 'px-2' : 'px-2',
        )}
        aria-label="Main navigation"
      >
        {isLoading ? (
          <SidebarSkeleton collapsed={collapsed} />
        ) : filteredGroups.length === 0 ? (
          <p
            className={cn(
              'px-3 py-6 text-center text-[12px] text-plum-600/55',
              collapsed && 'px-1 text-[10px]',
            )}
          >
            {collapsed ? '—' : 'No destinations match your search'}
          </p>
        ) : (
          filteredGroups.map(group => (
            <SidebarGroup
              key={group.id}
              group={group}
              collapsed={collapsed}
              onNavigate={onNavigate}
              animatedActive={animatedActive}
            />
          ))
        )}

        {!isLoading && (
          <SidebarRecent
            collapsed={collapsed}
            recent={recent}
            onClearRecent={clearRecent}
            onNavigate={onNavigate}
          />
        )}
      </nav>

      {!onNavigate && <SidebarToggle collapsed={collapsed} />}

      <SidebarProfile
        profile={profile}
        collapsed={collapsed}
        isLoading={isLoading}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
}

function SidebarSurface({
  children,
  collapsed,
  className,
  fullWidth = false,
}: {
  children: React.ReactNode;
  collapsed: boolean;
  className?: string;
  fullWidth?: boolean;
}) {
  return (
    <aside
      className={cn(
        'travel-sidebar journey-sidebar-shell relative flex shrink-0 flex-col overflow-hidden',
        'transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
        fullWidth && 'w-full',
        className,
      )}
      style={
        fullWidth
          ? undefined
          : {
              width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH,
            }
      }
      aria-label="Travel navigation"
    >
      <span className="journey-sidebar-orb journey-sidebar-orb--primary" aria-hidden />
      <span className="journey-sidebar-orb journey-sidebar-orb--accent" aria-hidden />
      <span className="journey-sidebar-rail" aria-hidden />
      <span className="journey-sidebar-edge" aria-hidden />
      <div className="relative z-[1] flex h-full min-h-0 flex-col">{children}</div>
    </aside>
  );
}

export default function Sidebar() {
  const { isOpen, isMobileOpen, setMobileOpen, isLoading } = useSidebar();
  const user = useSelector(selectUser);
  const isAuthenticated = Boolean(user);
  const isLargeScreen = useMediaQuery(SIDEBAR_DESKTOP_BREAKPOINT);
  const collapsed = !isOpen || !isLargeScreen;
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchClear = useCallback(() => setSearchQuery(''), []);
  const closeMobile = useCallback(() => setMobileOpen(false), [setMobileOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isMobileOpen, setMobileOpen]);

  useEffect(() => {
    const nav = document.getElementById(SIDEBAR_NAV_ID);
    if (!nav) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
      const links = Array.from(
        nav.querySelectorAll<HTMLAnchorElement>('a[href]:not([aria-disabled])'),
      );
      const index = links.indexOf(document.activeElement as HTMLAnchorElement);
      if (e.key === 'Home') {
        e.preventDefault();
        links[0]?.focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        links[links.length - 1]?.focus();
      } else if (e.key === 'ArrowDown' && index < links.length - 1) {
        e.preventDefault();
        links[index + 1]?.focus();
      } else if (e.key === 'ArrowUp' && index > 0) {
        e.preventDefault();
        links[index - 1]?.focus();
      }
    };

    nav.addEventListener('keydown', onKeyDown);
    return () => nav.removeEventListener('keydown', onKeyDown);
  }, [collapsed, isLoading]);

  const panelProps = {
    collapsed,
    isLoading,
    isAuthenticated,
    searchQuery,
    onSearchChange: setSearchQuery,
    onSearchClear: handleSearchClear,
  };

  const desktopSidebar = (
    <motion.div
      initial={false}
      animate={{ opacity: 1 }}
      className="sticky top-[70px] z-40 hidden h-[calc(100vh-70px)] lg:flex lg:pl-1"
    >
      <SidebarSurface collapsed={collapsed && isLargeScreen}>
        <SidebarPanel {...panelProps} />
      </SidebarSurface>
    </motion.div>
  );

  const mobileDrawer = (
    <Sheet open={isMobileOpen} onOpenChange={setMobileOpen}>
      <SheetContent
        side="left"
        className={cn(
          'journey-sidebar-mobile-sheet travel-sidebar',
          'h-full w-[min(100vw,300px)] max-w-[300px] border-0 p-0 sm:max-w-[300px]',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left',
        )}
      >
        <span className="journey-sidebar-orb journey-sidebar-orb--primary" aria-hidden />
        <span className="journey-sidebar-orb journey-sidebar-orb--accent" aria-hidden />
        <span className="journey-sidebar-rail" aria-hidden />
        <SidebarSurface collapsed={false} fullWidth className="h-full border-0 shadow-none">
          <SidebarPanel
            {...panelProps}
            collapsed={false}
            animatedActive={false}
            onNavigate={closeMobile}
            className="pt-3"
          />
        </SidebarSurface>
      </SheetContent>
    </Sheet>
  );

  return (
    <TooltipProvider delayDuration={120}>
      {desktopSidebar}
      {mobileDrawer}
    </TooltipProvider>
  );
}
