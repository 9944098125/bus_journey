import {
  Activity,
  BarChart3,
  Bell,
  BookOpen,
  Bus,
  ClipboardList,
  CreditCard,
  FileBarChart,
  FileText,
  Headphones,
  LayoutDashboard,
  Map,
  MapPin,
  MessageSquare,
  Route,
  Settings,
  Shield,
  Star,
  Ticket,
  TicketPercent,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';

import type { SidebarNavGroup } from './sidebar.types';

export const SIDEBAR_EXPANDED_WIDTH = 280;
export const SIDEBAR_COLLAPSED_WIDTH = 72;

/** Centered nav column — items share width so icons align vertically */
export const SIDEBAR_NAV_COLUMN =
  'mx-auto w-full max-w-[220px] min-w-0';

export const sidebarNavGroups: SidebarNavGroup[] = [
  {
    id: 'main',
    label: 'Main',
    items: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        href: '/',
        icon: LayoutDashboard,
        keywords: ['home', 'overview'],
      },
      {
        id: 'analytics',
        title: 'Analytics',
        href: '/analytics',
        icon: BarChart3,
        keywords: ['insights', 'metrics'],
      },
      {
        id: 'live-tracking',
        title: 'Live Tracking',
        href: '/live-tracking',
        icon: MapPin,
        badge: 'Live',
        badgeVariant: 'success',
        keywords: ['gps', 'fleet', 'realtime'],
      },
    ],
  },
  {
    id: 'operations',
    label: 'Operations',
    items: [
      {
        id: 'operators',
        title: 'Operators',
        href: '/operators',
        icon: Users,
        keywords: ['partners', 'vendors'],
      },
      {
        id: 'buses',
        title: 'Buses',
        href: '/buses',
        icon: Bus,
        keywords: ['fleet', 'vehicles'],
      },
      {
        id: 'routes',
        title: 'Routes',
        href: '/routes',
        icon: Route,
        keywords: ['paths', 'stops'],
      },
      {
        id: 'journeys',
        title: 'Journeys',
        href: '/journeys',
        icon: Map,
        keywords: ['trips', 'schedules'],
      },
      {
        id: 'bookings',
        title: 'Bookings',
        href: '/bookings',
        icon: Ticket,
        badge: 24,
        badgeVariant: 'warning',
        keywords: ['reservations', 'tickets'],
      },
    ],
  },
  {
    id: 'customers',
    label: 'Customers',
    items: [
      {
        id: 'customers',
        title: 'Customers',
        href: '/customers',
        icon: Users,
        keywords: ['users', 'passengers'],
      },
      {
        id: 'reviews',
        title: 'Reviews',
        href: '/reviews',
        icon: Star,
        badge: 8,
        keywords: ['ratings', 'feedback'],
      },
      {
        id: 'support',
        title: 'Support Tickets',
        href: '/support',
        icon: Headphones,
        badge: 5,
        badgeVariant: 'destructive',
        keywords: ['help', 'tickets'],
      },
      {
        id: 'notifications',
        title: 'Notifications',
        href: '/notifications',
        icon: Bell,
        badge: 3,
        keywords: ['alerts', 'messages'],
      },
    ],
  },
  {
    id: 'business',
    label: 'Business',
    items: [
      {
        id: 'payments',
        title: 'Payments',
        href: '/payments',
        icon: CreditCard,
        keywords: ['transactions', 'billing'],
      },
      {
        id: 'coupons',
        title: 'Coupons & Offers',
        href: '/coupons',
        icon: TicketPercent,
        keywords: ['discounts', 'promo'],
      },
      {
        id: 'revenue',
        title: 'Revenue',
        href: '/revenue',
        icon: Wallet,
        keywords: ['earnings', 'income'],
      },
      {
        id: 'reports',
        title: 'Reports',
        href: '/reports',
        icon: FileBarChart,
        keywords: ['exports', 'analytics'],
      },
    ],
  },
  {
    id: 'system',
    label: 'System',
    items: [
      {
        id: 'cms',
        title: 'CMS',
        href: '/cms',
        icon: BookOpen,
        keywords: ['content', 'pages'],
      },
      {
        id: 'admins',
        title: 'Admins & Roles',
        href: '/admins',
        icon: Shield,
        keywords: ['permissions', 'rbac'],
      },
      {
        id: 'audit-logs',
        title: 'Audit Logs',
        href: '/audit-logs',
        icon: ClipboardList,
        keywords: ['history', 'security'],
      },
      {
        id: 'settings',
        title: 'Settings',
        href: '/settings',
        icon: Settings,
        keywords: ['preferences', 'config'],
      },
    ],
  },
];

export const sidebarFooterLinks = [
  {
    id: 'activity',
    title: 'System Health',
    href: '/system-health',
    icon: Activity,
  },
  {
    id: 'growth',
    title: 'Growth',
    href: '/growth',
    icon: TrendingUp,
  },
  {
    id: 'messages',
    title: 'Messages',
    href: '/messages',
    icon: MessageSquare,
    badge: 2,
  },
  {
    id: 'docs',
    title: 'Documentation',
    href: '/docs',
    icon: FileText,
  },
] as const;
