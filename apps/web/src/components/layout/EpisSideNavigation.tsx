import type { ReactNode } from 'react';
import {
  Epis2NavigationRailFooter,
  useEpis2NavigationRailItems,
} from '../../navigation/epis2NavigationRail.js';

/** Hook — rail lateral fijo con destinos filtrados por rol. */
export function useEpisSideNavigation(footer?: ReactNode) {
  const sideNavItems = useEpis2NavigationRailItems();
  const sideNavFooter = footer ?? <Epis2NavigationRailFooter />;
  return { sideNavItems, sideNavFooter };
}
