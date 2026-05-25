import { useMemo } from 'react';

import { sidebarNavGroups } from './sidebar-items';
import type { SidebarNavGroup } from './sidebar.types';

export function useSidebarFilter(query: string): SidebarNavGroup[] {
  const normalized = query.trim().toLowerCase();

  return useMemo(() => {
    if (!normalized) {
      return sidebarNavGroups;
    }

    return sidebarNavGroups
      .map(group => ({
        ...group,
        items: group.items.filter(item => {
          const haystack = [
            item.title,
            group.label,
            ...(item.keywords ?? []),
          ]
            .join(' ')
            .toLowerCase();

          return haystack.includes(normalized);
        }),
      }))
      .filter(group => group.items.length > 0);
  }, [normalized]);
}
