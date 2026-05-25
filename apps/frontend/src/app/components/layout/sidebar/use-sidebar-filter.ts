import { useMemo } from 'react';

import { sidebarNavGroups } from './sidebar-items';
import type { SidebarNavGroup } from './sidebar.types';

type UseSidebarFilterOptions = {
  isAuthenticated: boolean;
};

export function useSidebarFilter(
  query: string,
  { isAuthenticated }: UseSidebarFilterOptions,
): SidebarNavGroup[] {
  const normalized = query.trim().toLowerCase();

  return useMemo(() => {
    const authFiltered = sidebarNavGroups
      .map(group => ({
        ...group,
        items: group.items.filter(
          item => !item.requiresAuth || isAuthenticated,
        ),
      }))
      .filter(group => group.items.length > 0);

    if (!normalized) {
      return authFiltered;
    }

    return authFiltered
      .map(group => ({
        ...group,
        items: group.items.filter(item => {
          const haystack = [item.title, group.label, ...(item.keywords ?? [])]
            .join(' ')
            .toLowerCase();

          return haystack.includes(normalized);
        }),
      }))
      .filter(group => group.items.length > 0);
  }, [normalized, isAuthenticated]);
}
