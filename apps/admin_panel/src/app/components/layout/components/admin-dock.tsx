import React, { useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { useGlobalSlice } from 'app/slice';
import { selectToken, selectUser } from 'app/slice/selectors';
import { hasStoredAuth } from 'utils/authStorage';
import { useMediaQuery } from 'utils/hooks/use-media-query';
import { cn } from 'utils/twm';
import { useSidebar } from 'app/components/layout/sidebar-context';

import AdminSidebarToggle from './admin-sidebar-toggle';
import { getAdminDockItems, type AdminDockItem } from './admin-dock-items';

function getDockItemKey(item: AdminDockItem) {
  return item.action ?? item.path;
}

type DockLinkProps = {
  item: AdminDockItem;
  isActive: boolean;
  expanded: boolean;
};

function DockLinkContent({ item, isActive, expanded }: DockLinkProps) {
  const Icon = item.icon;

  return (
    <>
      <span
        className={cn(
          'flex shrink-0 items-center justify-center rounded-xl text-white transition-all duration-300',
          expanded ? 'size-9' : 'size-10',
          isActive ? 'bg-white/20 opacity-100' : 'opacity-50',
        )}
      >
        <Icon size={expanded ? 20 : 22} strokeWidth={isActive ? 2.25 : 2} />
      </span>
      {expanded ? (
        <span
          className={cn(
            'truncate text-sm font-semibold text-white transition-opacity',
            isActive ? 'opacity-100' : 'opacity-50',
          )}
        >
          {item.title}
        </span>
      ) : (
        <span
          className={cn(
            'pointer-events-none absolute left-[calc(100%+0.5rem)] top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-lg border border-sea-light/60 bg-sea-deep/95 px-3 py-1.5 text-xs font-semibold text-sea-pale opacity-0 shadow-lg transition-all duration-200',
            'group-hover:translate-x-0 group-hover:opacity-100',
            'before:absolute before:right-full before:top-1/2 before:-translate-y-1/2 before:border-[5px] before:border-transparent before:border-r-sea-deep/95 before:content-[""]',
          )}
          aria-hidden
        >
          {item.title}
        </span>
      )}
    </>
  );
}

export default function AdminDock() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const isLoggedIn = Boolean(user && token) && hasStoredAuth();
  const { actions } = useGlobalSlice();
  const { isOpen } = useSidebar();
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  const sidebarExpanded = isOpen && isLargeScreen;
  const dockItems = getAdminDockItems(isLoggedIn);

  const handleLogout = useCallback(() => {
    dispatch(actions.logout());
    navigate('/login', { replace: true });
  }, [actions, dispatch, navigate]);

  return (
    <aside
      className={cn(
        'admin-sidebar-gradient sticky top-[64px] z-40 flex shrink-0 flex-col border-r border-sea-mid/25 py-4 shadow-[4px_0_28px_-10px_rgba(2,48,71,0.4)] transition-[width] duration-300 ease-in-out',
        sidebarExpanded ? 'w-1/6' : 'w-[var(--sidebar-width-collapsed)]',
      )}
      aria-label="Admin navigation"
      aria-expanded={sidebarExpanded}
    >
      <nav
        className={cn(
          'flex flex-1 flex-col gap-1.5 overflow-y-auto overflow-x-hidden',
          sidebarExpanded ? 'px-3' : 'items-center px-2',
        )}
        id="LIST_SCROLLBAR"
      >
        {dockItems.map(item => {
          const itemClass = cn(
            'group relative flex w-full items-center justify-start rounded-xl transition-all duration-300',
            sidebarExpanded ? 'gap-3 px-3 py-2.5' : 'flex-col items-center py-2',
            'hover:scale-[1.01] active:scale-[0.99]',
            !sidebarExpanded && 'hover:scale-[1.02] active:scale-[0.98]',
          );

          if (item.action === 'logout') {
            return (
              <button
                key={getDockItemKey(item)}
                type="button"
                onClick={handleLogout}
                aria-label={item.title}
                className={cn(
                  itemClass,
                  'cursor-pointer border-0 bg-transparent p-0 font-inherit text-left appearance-none',
                )}
              >
                <DockLinkContent
                  item={item}
                  isActive={false}
                  expanded={sidebarExpanded}
                />
              </button>
            );
          }

          return (
            <NavLink
              key={getDockItemKey(item)}
              to={item.path}
              aria-label={item.title}
              className={({ isActive }) =>
                cn(
                  itemClass,
                  isActive && sidebarExpanded && 'bg-white/10',
                )
              }
            >
              {({ isActive }) => (
                <DockLinkContent
                  item={item}
                  isActive={isActive}
                  expanded={sidebarExpanded}
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      {isLargeScreen && <AdminSidebarToggle expanded={sidebarExpanded} />}
    </aside>
  );
}
