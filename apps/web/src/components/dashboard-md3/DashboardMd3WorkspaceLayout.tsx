import { copy } from '@epis2/design-system';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { useAuth } from '../../auth/AuthContext.js';
import { useClinicalNavigate, type DashboardTab } from '../../routes/clinicalNavigate.js';
import { useEpisSession } from '../../session/EpisSessionContext.js';
import { useAiStatusQuery } from '../../query/hooks/useAiStatusQuery.js';
import { visibleDashboardNavDestinations } from '../../dashboard-md3/dashboardNavDestinations.js';
import {
  DEFAULT_DASHBOARD_SCOPE,
  activeScopeFilterChips,
  type DashboardScopeFilters,
} from '../../dashboard-md3/dashboardScopeFilters.js';
import { dashboardCommandSuggestionLabels } from '../../dashboard-md3/dashboardCommandSuggestions.js';
import type { DashboardKpiItem } from './EpisDashboardMd3KpiStrip.js';
import { EpisDashboardMd3Shell } from './EpisDashboardMd3Shell.js';
import { EpisDashboardMd3TopBar } from './EpisDashboardMd3TopBar.js';
import { EpisDashboardMd3ScopeBar } from './EpisDashboardMd3ScopeBar.js';
import { EpisDashboardMd3NavigationRail } from './EpisDashboardMd3NavigationRail.js';
import { EpisDashboardMd3KpiStrip } from './EpisDashboardMd3KpiStrip.js';
import { EpisDashboardMd3MainGrid } from './EpisDashboardMd3MainGrid.js';
import {
  EpisDashboardMd3DetailPane,
} from './EpisDashboardMd3DetailPane.js';
import type { DashboardDetailSelection } from './EpisDashboardMd3MainGrid.js';
import { EpisDashboardMd3CommandBar } from './EpisDashboardMd3CommandBar.js';
import { EpisDashboardMd3StatusBar } from './EpisDashboardMd3StatusBar.js';

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
  onOpenCommandPalette?: () => void;
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
  onOpenCommandPalette,
  patientId,
  selectionCount = 0,
  scopeFilters = DEFAULT_DASHBOARD_SCOPE,
  onClearScopeFilters,
  lastUpdatedLabel,
}: DashboardMd3WorkspaceLayoutProps) {
  const navigate = useClinicalNavigate();
  const { openCommandCenter, openClassicMode } = useEpisSession();
  const { session } = useAuth();
  const { aiAvailable } = useAiStatusQuery();
  const [moreOpen, setMoreOpen] = useState(false);
  const [detailCollapsed, setDetailCollapsed] = useState(false);

  const role = session?.user.role;
  const roleLabel = role ? (copy.roles[role as keyof typeof copy.roles] ?? role) : undefined;
  const nav = useMemo(() => visibleDashboardNavDestinations(allowedTabs), [allowedTabs]);
  const filterCount = activeScopeFilterChips(scopeFilters).length;
  const suggestions = dashboardCommandSuggestionLabels();

  const openClassic = patientId ? () => openClassicMode(patientId) : undefined;

  return (
    <EpisDashboardMd3Shell
      topBar={
        <EpisDashboardMd3TopBar
          clinicianLabel={session?.user.displayName}
          roleLabel={roleLabel}
          serviceLabel={scopeFilters.service}
          timestampLabel={new Date().toLocaleString('es-CL')}
          onBackToCommand={() => openCommandCenter(patientId)}
          onOpenClassicMode={openClassic}
          classicModeDisabled={!patientId}
          {...(onOpenCommandPalette ? { onOpenCommandPalette } : {})}
        />
      }
      scopeBar={
        <EpisDashboardMd3ScopeBar
          filters={scopeFilters}
          {...(onClearScopeFilters ? { onClearFilters: onClearScopeFilters } : {})}
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
          onOpenChart={
            patientId
              ? () =>
                  void navigate({
                    to: '/espacio/ficha',
                    search: { patientId },
                  })
              : undefined
          }
        />
      }
      commandBar={
        <EpisDashboardMd3CommandBar
          query={commandQuery}
          onQueryChange={onCommandQueryChange}
          onSubmit={onCommandSubmit}
          suggestions={suggestions}
          onSuggestionSelect={onCommandSuggestion}
        />
      }
      statusBar={
        <EpisDashboardMd3StatusBar
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
  );
}
