import type { LucideIcon } from 'lucide-react';

export type SidebarBadgeVariant = 'default' | 'warning' | 'success' | 'destructive';

export type SidebarNavItem = {
  id: string;
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: number | string;
  badgeVariant?: SidebarBadgeVariant;
  disabled?: boolean;
  keywords?: string[];
};

export type SidebarNavGroup = {
  id: string;
  label: string;
  items: SidebarNavItem[];
};

export type SidebarBranding = {
  title: string;
  subtitle: string;
  logoSrc: string;
  logoAlt?: string;
};

export type SidebarProfile = {
  name: string;
  role: string;
  avatarSrc?: string;
  initials: string;
  isOnline?: boolean;
  href?: string;
};
