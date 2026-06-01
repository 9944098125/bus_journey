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
  getUserInitials,
  getUserProfilePicture,
} from 'utils/user-display';
import { cn } from 'utils/twm';

import { useBusesSlice, useGetBusesQuery } from 'app/pages/Buses/slice';
import { useOperatorsSlice, useGetOperatorsQuery } from 'app/pages/Operators/slice';
import { useRoutesSlice, useGetRoutesQuery } from 'app/pages/Routes/slice';
import { useJourneysSlice, useGetJourneysQuery } from 'app/pages/Journeys/slice';

import SidebarGroup from './sidebar-group';
import SidebarProfile from './sidebar-profile';
import SidebarSearch from './sidebar-search';
import SidebarSkeleton from './sidebar-skeleton';
import SidebarToggle from './sidebar-toggle';
import {
  SIDEBAR_COLLAPSED_WIDTH,
  SIDEBAR_EXPANDED_WIDTH,
  sidebarNavGroups,
} from './sidebar-items';
import { useSidebarFilter } from './use-sidebar-filter';
import type { SidebarProfile as SidebarProfileType } from './sidebar.types';

type SidebarPanelProps = {
  collapsed: boolean;
  isLoading: boolean;
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
  searchQuery,
  onSearchChange,
  onSearchClear,
  onNavigate,
  animatedActive = true,
  className,
}: SidebarPanelProps) {
  const user = useSelector(selectUser);

  useBusesSlice();
  useOperatorsSlice();
  useRoutesSlice();
  useJourneysSlice();
  const { data: busesResponse } = useGetBusesQuery({ limit: 1 });
  const { data: operatorsResponse } = useGetOperatorsQuery(undefined);
  const { data: routesResponse } = useGetRoutesQuery({ limit: 1 });
  const { data: journeysResponse } = useGetJourneysQuery({ limit: 1 });

  const totalBuses = busesResponse?.total;
  const totalOperators =
    operatorsResponse?.total ?? operatorsResponse?.data?.length;
  const totalRoutes = routesResponse?.total;
  const totalJourneys = journeysResponse?.total;

  const dynamicGroups = useMemo(() => {
    return sidebarNavGroups.map(group => ({
      ...group,
      items: group.items.map(item => {
        if (item.id === 'buses')
          return {
            ...item,
            badge: totalBuses !== undefined ? totalBuses : undefined,
          };
        if (item.id === 'operators')
          return {
            ...item,
            badge:
              totalOperators !== undefined ? totalOperators : undefined,
          };
        if (item.id === 'routes')
          return {
            ...item,
            badge: totalRoutes !== undefined ? totalRoutes : undefined,
          };
        if (item.id === 'journeys')
          return {
            ...item,
            badge: totalJourneys !== undefined ? totalJourneys : undefined,
          };
        return item;
      }),
    }));
  }, [totalBuses, totalOperators, totalRoutes, totalJourneys]);

  const filteredGroups = useSidebarFilter(searchQuery, dynamicGroups);

  const profile: SidebarProfileType = useMemo(
    () => ({
      name: getUserDisplayName(user),
      role: 'Operations Admin',
      avatarSrc: getUserProfilePicture(user),
      initials: getUserInitials(user),
      isOnline: true,
      href: '/settings',
    }),
    [user],
  );

  return (
    <div className={cn('flex h-full min-h-0 flex-col', className)}>
      <SidebarSearch
        collapsed={collapsed}
        value={searchQuery}
        onChange={onSearchChange}
        onClear={onSearchClear}
      />

      <nav
        id="admin-sidebar-nav"
        className={cn(
          'admin-sidebar-scroll flex min-h-0 flex-1 flex-col items-center overflow-y-auto overflow-x-hidden',
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
            {collapsed ? '—' : 'No menu items match your search'}
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
      </nav>

      <SidebarToggle collapsed={collapsed} />

      <SidebarProfile
        profile={profile}
        collapsed={collapsed}
        isLoading={isLoading}
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
        'premium-sidebar relative flex shrink-0 flex-col overflow-hidden',
        'border-r border-white/[0.08] shadow-[4px_0_40px_-12px_rgba(2,48,71,0.55)]',
        'transition-[width] duration-300 ease-out',
        className,
      )}
      style={{
        width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH,
      }}
      aria-label="Admin navigation"
    >
      <div className="premium-sidebar-glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="premium-sidebar-mesh pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative z-[1] flex h-full min-h-0 flex-col">
        {children}
      </div>
    </aside>
  );
}

export default function Sidebar() {
  const { isOpen, isMobileOpen, setMobileOpen, isLoading } = useSidebar();
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
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

  const panelProps = {
    collapsed,
    isLoading,
    searchQuery,
    onSearchChange: setSearchQuery,
    onSearchClear: handleSearchClear,
  };

  const desktopSidebar = (
    <motion.div
      initial={false}
      animate={{ opacity: 1 }}
      className="sticky top-[64px] z-40 hidden h-[calc(100vh-64px)] lg:flex"
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
          'premium-sidebar w-[min(100vw,280px)] max-w-[280px] border-0 p-0',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
        )}
      >
        <div className="premium-sidebar-glow pointer-events-none absolute inset-0" aria-hidden />
        <div className="premium-sidebar-mesh pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative z-[1] flex h-full flex-col pt-4">
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
