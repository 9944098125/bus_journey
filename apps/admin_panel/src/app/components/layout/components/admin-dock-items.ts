import {
  BarChart3,
  Bus,
  LayoutDashboard,
  LogIn,
  LogOut,
  Route,
  Settings,
  Users,
} from 'lucide-react';

export interface AdminDockLinkItem {
  title: string;
  icon: typeof LayoutDashboard;
  path: string;
  action?: never;
}

export interface AdminDockActionItem {
  title: string;
  icon: typeof LayoutDashboard;
  action: 'logout';
  path?: never;
}

export type AdminDockItem = AdminDockLinkItem | AdminDockActionItem;

const dockAuthenticatedItems: AdminDockItem[] = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/',
  },
  {
    title: 'Fleet',
    icon: Bus,
    path: '/fleet',
  },
  {
    title: 'Routes',
    icon: Route,
    path: '/routes',
  },
  {
    title: 'Passengers',
    icon: Users,
    path: '/passengers',
  },
  {
    title: 'Analytics',
    icon: BarChart3,
    path: '/analytics',
  },
  {
    title: 'Settings',
    icon: Settings,
    path: '/settings',
  },
  {
    title: 'Logout',
    icon: LogOut,
    action: 'logout',
  },
];

const dockGuestItems: AdminDockItem[] = [
  {
    title: 'Login',
    icon: LogIn,
    path: '/login',
  },
];

export const getAdminDockItems = (isLoggedIn: boolean): AdminDockItem[] =>
  isLoggedIn ? dockAuthenticatedItems : dockGuestItems;
