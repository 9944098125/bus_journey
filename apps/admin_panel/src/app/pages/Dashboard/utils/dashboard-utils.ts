import type { AuthProvider, UserRole } from 'types/user';

export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(amount) ? amount : 0);

export const formatCompact = (n: number): string =>
  new Intl.NumberFormat('en-IN', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n);

export const formatRelativeTime = (iso: string | null): string => {
  if (!iso) return 'Never';

  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

export const ROLE_LABELS: Record<UserRole, string> = {
  USER: 'Passenger',
  ADMIN: 'Admin',
  OPERATOR: 'Operator',
};

export const ROLE_STYLES: Record<
  UserRole,
  { bg: string; text: string; ring: string }
> = {
  USER: {
    bg: 'bg-sea-pale/80',
    text: 'text-sea-deep',
    ring: 'ring-sea-light/60',
  },
  ADMIN: {
    bg: 'bg-violet-100',
    text: 'text-violet-800',
    ring: 'ring-violet-200/80',
  },
  OPERATOR: {
    bg: 'bg-amber-100',
    text: 'text-amber-900',
    ring: 'ring-amber-200/80',
  },
};

export const AUTH_PROVIDER_LABELS: Record<AuthProvider, string> = {
  LOCAL: 'Email & password',
  GOOGLE: 'Google SSO',
};
