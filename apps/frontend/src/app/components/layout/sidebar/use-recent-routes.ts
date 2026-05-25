import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import {
  MAX_RECENT_ROUTES,
  SIDEBAR_RECENT_KEY,
} from './sidebar.constants';
import { sidebarNavGroups } from './sidebar-items';
import type { RecentRouteEntry } from './sidebar.types';

const routeTitleMap = new Map(
  sidebarNavGroups.flatMap(group =>
    group.items.map(item => [item.href, item.title] as const),
  ),
);

function readRecent(): RecentRouteEntry[] {
  try {
    const raw = localStorage.getItem(SIDEBAR_RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentRouteEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRecent(entries: RecentRouteEntry[]) {
  try {
    localStorage.setItem(SIDEBAR_RECENT_KEY, JSON.stringify(entries));
  } catch {
    // ignore
  }
}

export function useRecentRoutes() {
  const { pathname } = useLocation();
  const [recent, setRecent] = useState<RecentRouteEntry[]>(readRecent);

  const recordVisit = useCallback((href: string) => {
    const title = routeTitleMap.get(href);
    if (!title || href === '/login' || href === '/register') return;

    setRecent(prev => {
      const next: RecentRouteEntry[] = [
        {
          id: href,
          title,
          href,
          visitedAt: Date.now(),
        },
        ...prev.filter(entry => entry.href !== href),
      ].slice(0, MAX_RECENT_ROUTES);

      writeRecent(next);
      return next;
    });
  }, []);

  useEffect(() => {
    recordVisit(pathname);
  }, [pathname, recordVisit]);

  const clearRecent = useCallback(() => {
    writeRecent([]);
    setRecent([]);
  }, []);

  return { recent, clearRecent };
}
