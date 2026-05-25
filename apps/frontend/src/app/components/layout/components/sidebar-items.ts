import {
  Bus,
  Clock3,
  CreditCard,
  History,
  Home,
  LogIn,
  LogOut,
  MapPinned,
  Search,
  Ticket,
  User,
  UserPlus,
} from 'lucide-react';

export interface SidebarLinkItem {
  title: string;
  icon: typeof Home;
  path: string;
  action?: never;
}

export interface SidebarActionItem {
  title: string;
  icon: typeof Home;
  action: 'logout';
  path?: never;
}

export type SidebarItem = SidebarLinkItem | SidebarActionItem;

export const sidebarPublicItems: SidebarItem[] = [
  {
    title: 'Home',
    icon: Home,
    path: '/',
  },
  {
    title: 'Search Buses',
    icon: Search,
    path: '/search',
  },
];

export const sidebarAuthenticatedItems: SidebarItem[] = [
  {
    title: 'Book a Bus',
    icon: Bus,
    path: '/buses',
  },
  {
    title: 'My Bookings',
    icon: Ticket,
    path: '/bookings',
  },
  {
    title: 'Upcoming Trips',
    icon: Clock3,
    path: '/bookings/upcoming',
  },
  {
    title: 'Travel History',
    icon: History,
    path: '/bookings/history',
  },
  {
    title: 'Track Bus',
    icon: MapPinned,
    path: '/track-bus',
  },
  {
    title: 'Payment Methods',
    icon: CreditCard,
    path: '/payment-methods',
  },
  {
    title: 'Profile',
    icon: User,
    path: '/profile',
  },
  {
    title: 'Logout',
    icon: LogOut,
    action: 'logout',
  },
];

export const sidebarGuestItems: SidebarItem[] = [
  {
    title: 'Login',
    icon: LogIn,
    path: '/login',
  },
  {
    title: 'Registration',
    icon: UserPlus,
    path: '/register',
  },
];

export const getSidebarItems = (isLoggedIn: boolean): SidebarItem[] => [
  ...sidebarPublicItems,
  ...(isLoggedIn ? sidebarAuthenticatedItems : sidebarGuestItems),
];
