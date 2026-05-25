import { sidebarNavGroups } from './sidebar-items';

const allNavItems = sidebarNavGroups.flatMap(group => group.items);

/** Sidebar destinations that require a signed-in user */
export const sidebarProtectedHrefs = allNavItems
  .filter(item => item.requiresAuth)
  .map(item => item.href);
