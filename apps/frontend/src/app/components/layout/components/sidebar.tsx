import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft } from 'lucide-react';
import { Button } from 'app/components/ui/button';
import { useGlobalSlice } from 'app/slice';
import { selectUser } from 'app/slice/selectors';
import { getSidebarItems, type SidebarItem } from './sidebar-items';
import { useSidebarCollapsed } from '../hooks/useSidebarCollapsed';
import { cn } from 'utils/twm';

const CHEVRON_SLOT_PX = 22;
const MIN_OPEN_ARROWS = 2;
const MAX_OPEN_ARROWS = 12;

function SidebarToggleChevrons({ collapsed }: { collapsed: boolean }) {
  const [arrowCount, setArrowCount] = useState(MIN_OPEN_ARROWS);
  const measureRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (collapsed) {
      setArrowCount(1);
      return;
    }

    const el = measureRef.current?.closest('button');
    if (!el) return;

    const updateCount = () => {
      const width = el.getBoundingClientRect().width;
      const next = Math.max(
        MIN_OPEN_ARROWS,
        Math.min(MAX_OPEN_ARROWS, Math.floor((width - 20) / CHEVRON_SLOT_PX)),
      );
      setArrowCount(prev => (prev === next ? prev : next));
    };

    updateCount();
    const observer = new ResizeObserver(updateCount);
    observer.observe(el);
    return () => observer.disconnect();
  }, [collapsed]);

  const chevronClass = cn(
    'shrink-0 drop-shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.34,1.2,0.64,1)] motion-reduce:transition-none',
    'group-hover/toggle:scale-110',
    collapsed ? 'rotate-180' : 'rotate-0',
  );

  if (collapsed) {
    return (
      <ChevronLeft
        size={22}
        strokeWidth={2.75}
        className={chevronClass}
        aria-hidden
      />
    );
  }

  return (
    <span
      ref={measureRef}
      className="relative z-[1] flex w-full items-center justify-evenly gap-0"
      aria-hidden
    >
      {Array.from({ length: arrowCount }, (_, index) => (
        <ChevronLeft
          key={index}
          size={20}
          strokeWidth={2.5}
          className={chevronClass}
        />
      ))}
    </span>
  );
}

function getSidebarItemKey(item: SidebarItem) {
  return item.action ?? item.path;
}

function getSidebarItemClassName(
  collapsed: boolean,
  showExpandedLabels: boolean,
  isActive: boolean,
) {
  return cn(
    'group relative flex min-h-[3rem] w-full items-center rounded-2xl border-l-4 font-medium touch-manipulation',
    'transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none',
    collapsed
      ? 'justify-center gap-0 px-2 py-3'
      : 'justify-center gap-0 px-2 py-3 lg:min-h-0 lg:justify-start lg:gap-3 lg:px-3.5 lg:py-4 lg:text-sm',
    isActive
      ? cn(
          'border-amber-300 bg-gradient-to-r from-[#5c0a1a] via-[#722F37] to-[#8B2635] text-white shadow-lg shadow-[#722F37]/40',
          '[&_svg]:scale-110 [&_svg]:text-rose-50 [&_svg]:drop-shadow-sm',
          showExpandedLabels &&
            'lg:[&_span.nav-label]:font-semibold lg:[&_span.nav-label]:tracking-wide',
        )
      : cn(
          'border-transparent text-[#4a1520]',
          'hover:border-rose-300/70 hover:bg-gradient-to-r hover:from-rose-50 hover:to-[#fce8e8] hover:text-[#722F37] hover:shadow-md',
          'active:scale-[0.92]',
          !collapsed && 'lg:hover:translate-x-1 lg:active:scale-[0.98]',
          '[&_svg]:text-[#8B2635] [&_svg]:transition-all [&_svg]:duration-300',
          'group-hover:[&_svg]:scale-110 group-hover:[&_svg]:text-[#5c0a1a]',
          showExpandedLabels &&
            'lg:group-hover:[&_span.nav-label]:font-medium',
        ),
  );
}

type SidebarItemContentProps = {
  item: SidebarItem;
  collapsed: boolean;
  showExpandedLabels: boolean;
  isActive: boolean;
};

function SidebarItemContent({
  item,
  collapsed,
  showExpandedLabels,
  isActive,
}: SidebarItemContentProps) {
  const Icon = item.icon;

  return (
    <>
      <span className="relative flex shrink-0 items-center justify-center rounded-xl p-1.5 transition-transform duration-300 motion-reduce:transition-none">
        <Icon
          size={22}
          strokeWidth={isActive ? 2.25 : 2}
          className="transition-transform duration-300 motion-reduce:transition-none"
        />
        {isActive && (
          <span
            className={cn(
              'absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-amber-300 shadow-[0_0_6px_rgba(251,191,36,0.9)]',
              !collapsed && 'lg:hidden',
            )}
            aria-hidden
          />
        )}
      </span>

      <span
        className={cn(
          'nav-label hidden overflow-hidden whitespace-nowrap lg:inline',
          'transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none',
          showExpandedLabels
            ? 'max-w-[11rem] translate-x-0 opacity-100'
            : 'max-w-0 -translate-x-2 opacity-0',
        )}
      >
        {item.title}
      </span>

      <span
        className={cn(
          'pointer-events-none absolute left-[calc(100%+0.625rem)] top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-xl border border-rose-200/90 bg-white/95 px-3.5 py-2 text-xs font-semibold text-[#5c0a1a] shadow-lg shadow-[#722F37]/15 backdrop-blur-sm transition-all duration-300 motion-reduce:transition-none',
          'before:absolute before:right-full before:top-1/2 before:-translate-y-1/2 before:border-[6px] before:border-transparent before:border-r-white/95 before:content-[""]',
          collapsed ? 'block' : 'lg:hidden',
          isActive
            ? 'translate-x-0 scale-100 opacity-100'
            : 'translate-x-1 scale-95 opacity-0 group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:scale-100 group-focus-visible:opacity-100',
        )}
        aria-hidden
      >
        {item.title}
      </span>
    </>
  );
}

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const isLoggedIn = Boolean(user);
  const { collapsed, toggle } = useSidebarCollapsed();
  const { actions } = useGlobalSlice();
  const sidebarItems = useMemo(() => getSidebarItems(isLoggedIn), [isLoggedIn]);

  const showExpandedLabels = !collapsed;

  const handleLogout = useCallback(() => {
    dispatch(actions.logout());
    navigate('/login', { replace: true });
  }, [actions, dispatch, navigate]);

  return (
    <aside
      className={cn(
        'sticky top-[70px] z-40 flex shrink-0 flex-col overflow-hidden',
        'h-[calc(100vh-70px)]',
        'border-r border-rose-200/80 bg-[#fdf8f8]/95',
        'shadow-[4px_0_28px_-14px_rgba(114,47,55,0.22)] backdrop-blur-xl',
        'transition-[width] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none',
        collapsed ? 'w-[4.75rem]' : 'w-[4.75rem] md:w-inherit lg:w-1/6',
      )}
      data-collapsed={collapsed}
    >
      <div
        className={cn(
          'relative shrink-0 border-b border-rose-200/70 px-2 pb-3 pt-3',
          'transition-[padding] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none',
          collapsed ? 'px-1.5' : 'px-2 lg:px-3',
        )}
      >
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-x-3 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-rose-300/50 to-transparent',
            'transition-opacity duration-500',
            collapsed ? 'opacity-0' : 'opacity-100',
          )}
        />

        <div className="relative z-10 w-full">
          <div className="relative w-full">
            <Button
              type="button"
              variant="sidebarToggle"
              size={collapsed ? 'sidebarToggle' : 'sidebarToggleWide'}
              onClick={toggle}
              aria-expanded={!collapsed}
              aria-controls="sidebar-nav"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="w-full transition-[width] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none"
            >
              <SidebarToggleChevrons collapsed={collapsed} />
            </Button>

            {collapsed && (
              <span
                className={cn(
                  'pointer-events-none absolute left-[calc(100%+0.625rem)] top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-xl border border-rose-200/90 bg-white/95 px-3.5 py-2 text-xs font-semibold text-[#5c0a1a] shadow-lg shadow-[#722F37]/15 backdrop-blur-sm',
                  'translate-x-1 scale-95 opacity-0 transition-all duration-300',
                  'before:absolute before:right-full before:top-1/2 before:-translate-y-1/2 before:border-[6px] before:border-transparent before:border-r-white/95 before:content-[""]',
                  'group-hover/toggle:translate-x-0 group-hover/toggle:scale-100 group-hover/toggle:opacity-100 group-focus-visible/toggle:translate-x-0 group-focus-visible/toggle:scale-100 group-focus-visible/toggle:opacity-100',
                )}
                aria-hidden
              >
                Expand
              </span>
            )}
          </div>
        </div>
      </div>

      <nav
        id="sidebar-nav"
        className={cn(
          'flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden py-3',
          'transition-[padding,gap] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none',
          collapsed ? 'px-1.5' : 'px-2 lg:gap-1.5 lg:p-4 lg:pt-3',
        )}
        aria-label="Main navigation"
      >
        {sidebarItems.map(item => {
          if (item.action === 'logout') {
            return (
              <button
                key={getSidebarItemKey(item)}
                type="button"
                onClick={handleLogout}
                aria-label={item.title}
                title={collapsed ? item.title : undefined}
                className={getSidebarItemClassName(
                  collapsed,
                  showExpandedLabels,
                  false,
                )}
              >
                <SidebarItemContent
                  item={item}
                  collapsed={collapsed}
                  showExpandedLabels={showExpandedLabels}
                  isActive={false}
                />
              </button>
            );
          }

          return (
            <NavLink
              key={getSidebarItemKey(item)}
              to={item.path}
              aria-label={item.title}
              title={collapsed ? item.title : undefined}
              className={({ isActive }) =>
                getSidebarItemClassName(
                  collapsed,
                  showExpandedLabels,
                  isActive,
                )
              }
            >
              {({ isActive }) => (
                <SidebarItemContent
                  item={item}
                  collapsed={collapsed}
                  showExpandedLabels={showExpandedLabels}
                  isActive={isActive}
                />
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
