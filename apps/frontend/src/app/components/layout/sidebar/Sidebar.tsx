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
} from 'utils/userDisplay';
import { cn } from 'utils/twm';

import SidebarBrand from './SidebarBrand';
import SidebarGroup from './SidebarGroup';
import SidebarProfile from './SidebarProfile';
import SidebarRecent from './SidebarRecent';
import SidebarSearch from './SidebarSearch';
import SidebarSkeleton from './SidebarSkeleton';
import SidebarToggle from './SidebarToggle';
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
  const { recent } = useRecentRoutes();

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
    <div className={cn('flex h-full min-h-0 flex-col', className)}>
      <SidebarBrand collapsed={collapsed} isLoading={isLoading} />

      <SidebarSearch
        collapsed={collapsed}
        value={searchQuery}
        onChange={onSearchChange}
        onClear={onSearchClear}
      />

      <nav
        id={SIDEBAR_NAV_ID}
        className={cn(
          'travel-sidebar-scroll flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden',
          collapsed ? 'px-2' : 'px-2',
        )}
        aria-label="Main navigation"
      >
        {isLoading ? (
          <SidebarSkeleton collapsed={collapsed} />
        ) : filteredGroups.length === 0 ? (
          <p
            className={cn(
              'px-3 py-6 text-center text-[12px] text-white/40',
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
            onNavigate={onNavigate}
          />
        )}
      </nav>

      <SidebarToggle collapsed={collapsed} />

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
}: {
  children: React.ReactNode;
  collapsed: boolean;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        'travel-sidebar relative flex shrink-0 flex-col overflow-hidden',
        'border-r border-white/10 shadow-[4px_0_48px_-16px_rgba(15,76,110,0.45)]',
        'transition-[width] duration-300 ease-out',
        className,
      )}
      style={{
        width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH,
      }}
      aria-label="Travel navigation"
    >
      <div className="travel-sidebar-glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="travel-sidebar-mesh pointer-events-none absolute inset-0" aria-hidden />
      <div className="travel-sidebar-shine pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative z-[1] flex h-full min-h-0 flex-col">
        {children}
      </div>
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
      className="sticky top-[70px] z-40 hidden h-[calc(100vh-70px)] lg:flex"
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
          'travel-sidebar w-[min(100vw,288px)] max-w-[288px] border-0 p-0',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
        )}
      >
        <div className="travel-sidebar-glow pointer-events-none absolute inset-0" aria-hidden />
        <div className="travel-sidebar-mesh pointer-events-none absolute inset-0" aria-hidden />
        <div className="travel-sidebar-shine pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative z-[1] flex h-full flex-col pt-3">
          <SidebarPanel
            {...panelProps}
            collapsed={false}
            animatedActive={false}
            onNavigate={closeMobile}
          />
        </div>
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
