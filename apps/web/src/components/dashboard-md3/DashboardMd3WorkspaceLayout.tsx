import { copy } from '@epis2/design-system';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { useAuth } from '../../auth/AuthContext.js';
import { type DashboardTab } from '../../routes/clinicalNavigate.js';
import { useEpisSession } from '../../session/EpisSessionContext.js';
import { useAiStatusQuery } from '../../query/hooks/useAiStatusQuery.js';
import { visibleDashboardNavDestinations } from '../../dashboard-md3/dashboardNavDestinations.js';
import {
  DEFAULT_DASHBOARD_SCOPE,
  activeScopeFilterChips,
  type DashboardScopeFilters,
} from '../../dashboard-md3/dashboardScopeFilters.js';
import { dashboardCommandSuggestionLabels } from '../../dashboard-md3/dashboardCommandSuggestions.js';
import { EpisTopAppBar } from '../layout/EpisTopAppBar.js';
import type { DashboardKpiItem } from './EpisDashboardMd3KpiStrip.js';
import { EpisDashboardMd3Shell } from './EpisDashboardMd3Shell.js';
import { EpisDashboardMd3ScopeBar } from './EpisDashboardMd3ScopeBar.js';
import { EpisDashboardMd3NavigationRail } from './EpisDashboardMd3NavigationRail.js';
import { EpisDashboardMd3MobileNav } from './EpisDashboardMd3MobileNav.js';
import { EpisDashboardMd3KpiStrip } from './EpisDashboardMd3KpiStrip.js';
import { EpisDashboardMd3MainGrid } from './EpisDashboardMd3MainGrid.js';
import { EpisDashboardMd3DetailPane } from './EpisDashboardMd3DetailPane.js';
import type { DashboardDetailSelection } from './EpisDashboardMd3MainGrid.js';
import { EpisDashboardMd3CommandBar } from './EpisDashboardMd3CommandBar.js';
import { EpisDashboardMd3StatusBar } from './EpisDashboardMd3StatusBar.js';
import { EpisDashboardMd3BottomDock } from './EpisDashboardMd3BottomDock.js';

export type DashboardMd3WorkspaceLayoutProps = {
  activeTab: DashboardTab;
  allowedTabs: ReadonlySet<DashboardTab>;
  onTabChange: (tab: DashboardTab) => void;
  mainContent: ReactNode;
  kpiItems?: readonly DashboardKpiItem[];
  detailSelection?: DashboardDetailSelection | null;
  bulkActions?: ReactNode;
  commandQuery: string;
  onCommandQueryChange: (value: string) => void;
  onCommandSubmit: () => void;
  onCommandSuggestion?: (label: string) => void;
  patientId?: string;
  selectionCount?: number;
  scopeFilters?: DashboardScopeFilters;
  onClearScopeFilters?: () => void;
  lastUpdatedLabel?: string;
};

/** Layout visual modo dashboard MD3 — props/callbacks únicamente. */
export function DashboardMd3WorkspaceLayout({
  activeTab,
  allowedTabs,
  onTabChange,
  mainContent,
  kpiItems = [],
  detailSelection,
  bulkActions,
  commandQuery,
  onCommandQueryChange,
  onCommandSubmit,
  onCommandSuggestion,
  patientId,
  selectionCount = 0,
  scopeFilters = DEFAULT_DASHBOARD_SCOPE,
  onClearScopeFilters,
  lastUpdatedLabel,
}: DashboardMd3WorkspaceLayoutProps) {
  const { openClassicMode } = useEpisSession();
  const { session } = useAuth();
  const { aiAvailable } = useAiStatusQuery();
  const [moreOpen, setMoreOpen] = useState(false);
  const [detailCollapsed, setDetailCollapsed] = useState(false);

  const role = session?.user.role;
  const roleLabel = role ? (copy.roles[role as keyof typeof copy.roles] ?? role) : undefined;
  const nav = useMemo(() => visibleDashboardNavDestinations(allowedTabs), [allowedTabs]);
  const filterCount = activeScopeFilterChips(scopeFilters).length;
  const suggestions = dashboardCommandSuggestionLabels();

  const openClassic = patientId ? () => openClassicMode(patientId, activeTab) : undefined;

  return (
    <EpisDashboardMd3Shell
      topBar={<EpisTopAppBar active="dashboard" />}
      scopeBar={
        <EpisDashboardMd3ScopeBar
          filters={scopeFilters}
          {...(onClearScopeFilters ? { onClearFilters: onClearScopeFilters } : {})}
        />
      }
      mobileNav={
        <EpisDashboardMd3MobileNav
          primary={nav.primary}
          more={nav.more}
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
      }
      navigationRail={
        <EpisDashboardMd3NavigationRail
          primary={nav.primary}
          more={nav.more}
          activeTab={activeTab}
          onTabChange={onTabChange}
          moreOpen={moreOpen}
          onMoreToggle={() => setMoreOpen((v) => !v)}
        />
      }
      kpiStrip={<EpisDashboardMd3KpiStrip items={kpiItems} />}
      mainGrid={
        <EpisDashboardMd3MainGrid bulkActions={bulkActions}>{mainContent}</EpisDashboardMd3MainGrid>
      }
      detailPane={
        <EpisDashboardMd3DetailPane
          selection={detailSelection}
          collapsed={detailCollapsed}
          onToggleCollapse={() => setDetailCollapsed((v) => !v)}
          onOpenClassic={openClassic}
          onOpenChart={patientId ? () => openClassicMode(patientId, activeTab) : undefined}
        />
      }
      bottomDock={
        <EpisDashboardMd3BottomDock
          commandBar={
            <EpisDashboardMd3CommandBar
              embedded
              query={commandQuery}
              onQueryChange={onCommandQueryChange}
              onSubmit={onCommandSubmit}
              suggestions={suggestions}
              onSuggestionSelect={onCommandSuggestion}
            />
          }
          statusBar={
            <EpisDashboardMd3StatusBar
              embedded
              lastUpdatedLabel={lastUpdatedLabel ?? new Date().toLocaleTimeString('es-CL')}
              dbStatus="ok"
              aiStatus={aiAvailable ? 'ok' : 'degraded'}
              activeFilterCount={filterCount}
              selectionCount={selectionCount}
              userLabel={session?.user.displayName}
              roleLabel={roleLabel}
              environmentLabel="demo"
            />
          }
        />
      }
    />
  );
}
