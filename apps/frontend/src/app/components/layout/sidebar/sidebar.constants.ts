import type { SidebarBranding } from './sidebar.types';

export const SIDEBAR_BRAND: SidebarBranding = {
  title: 'Bus Journey',
  subtitle: 'Travel smarter, go further',
  logoSrc: '/logo.png',
  logoAlt: 'Bus Journey logo',
};

export const SIDEBAR_OPEN_KEY = 'bj-travel-sidebar-open';
export const SIDEBAR_DARK_KEY = 'bj-travel-sidebar-dark';
export const SIDEBAR_RECENT_KEY = 'bj-travel-sidebar-recent';
export const SIDEBAR_LOADING_MS = 520;

export const SIDEBAR_EXPANDED_WIDTH = 288;
export const SIDEBAR_COLLAPSED_WIDTH = 76;

export const SIDEBAR_DESKTOP_BREAKPOINT = '(min-width: 1024px)';
export const SIDEBAR_NAV_ID = 'travel-sidebar-nav';

export const MAX_RECENT_ROUTES = 4;
