import { copy } from '@epis2/design-system';
import { useEpis2ExpandedUp } from '@epis2/epis2-ui';
import { useRouterState } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { useAuth } from '../../auth/AuthContext.js';
import { useActivePatient } from '../../clinical/ActivePatientContext.js';
import { useClinicalNavigate } from '../../routes/clinicalNavigate.js';
import { useAiStatusQuery } from '../../query/hooks/useAiStatusQuery.js';
import {
  resolvePatientChartTabId,
  type PatientChartTabId,
} from '../../clinical/patientChartNavigation.js';
import {
  CLASSIC_ACTION_RAIL_DESTINATIONS,
  CLASSIC_LEFT_NAV_DESTINATIONS,
} from '../../classic-md3/classicNavDestinations.js';
import { EpisTopAppBar } from '../layout/EpisTopAppBar.js';
import {
  EpisClassicMd3ActionRail,
  EpisClassicMd3BottomDock,
  EpisClassicMd3CommandBar,
  EpisClassicMd3LeftNavigation,
  EpisClassicMd3MainPane,
  EpisClassicMd3MobileNav,
  EpisClassicMd3PatientHeader,
  EpisClassicMd3Shell,
  EpisClassicMd3StatusBar,
  EpisClassicMd3SupportingPane,
} from './index.js';

export type ClassicMd3WorkspaceLayoutProps = {
  patientId?: string | undefined;
  patientDisplayName?: string | undefined;
  metaLine?: string | undefined;
  allergyLabels?: readonly string[] | undefined;
  alertLabels?: readonly string[] | undefined;
  mainContent: ReactNode;
  supportingContent?: ReactNode | undefined;
  supportingOpen?: boolean | undefined;
  onSupportingToggle?: (() => void) | undefined;
  commandQuery: string;
  onCommandQueryChange: (value: string) => void;
  onCommandSubmit: () => void;
  commandSuggestions?: readonly string[] | undefined;
  onCommandSuggestion?: ((label: string) => void) | undefined;
  onOpenCommandPalette?: (() => void) | undefined;
  draftStatusLabel?: string | undefined;
};

/** Layout visual modo clásico — props/callbacks únicamente. */
export function ClassicMd3WorkspaceLayout({
  patientId,
  patientDisplayName,
  metaLine,
  allergyLabels,
  alertLabels,
  mainContent,
  supportingContent,
  supportingOpen = true,
  onSupportingToggle,
  commandQuery,
  onCommandQueryChange,
  onCommandSubmit,
  commandSuggestions,
  onCommandSuggestion,
  draftStatusLabel,
}: ClassicMd3WorkspaceLayoutProps) {
  const isLarge = useEpis2ExpandedUp();
  const navigate = useClinicalNavigate();
  const { session } = useAuth();
  const { patient } = useActivePatient();
  const { aiAvailable } = useAiStatusQuery();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const tabToNav: Record<PatientChartTabId, string> = {
    summary: 'summary',
    history: 'history',
    encounter: 'evolution',
    results: 'labs',
    orders: 'orders',
  };
  const activeNavId = tabToNav[resolvePatientChartTabId(pathname)];

  const role = session?.user.role;
  const roleLabel = role ? (copy.roles[role as keyof typeof copy.roles] ?? role) : undefined;

  const navItems = CLASSIC_LEFT_NAV_DESTINATIONS.map((d) => ({
    id: d.id,
    label: d.label,
    group: d.group,
  }));

  const handleNavSelect = (id: string) => {
    const dest = CLASSIC_LEFT_NAV_DESTINATIONS.find((d) => d.id === id);
    if (!dest) return;
    void navigate(dest.target(patientId));
  };

  const handleRailSelect = (id: string) => {
    const dest = CLASSIC_ACTION_RAIL_DESTINATIONS.find((d) => d.id === id);
    if (!dest) return;
    void navigate(dest.target(patientId));
  };

  const supportingVisible = Boolean(supportingContent) && supportingOpen && isLarge;

  return (
    <EpisClassicMd3Shell
      topAppBar={<EpisTopAppBar active="clinical" />}
      patientHeader={
        <EpisClassicMd3PatientHeader
          displayName={patientDisplayName ?? patient?.displayName}
          metaLine={metaLine}
          allergyLabels={allergyLabels}
          alertLabels={alertLabels}
          episodeLabel={copy.classicMd3.episodeOpen}
        />
      }
      mobileNav={
        <EpisClassicMd3MobileNav
          items={navItems}
          activeId={activeNavId}
          onSelect={handleNavSelect}
        />
      }
      leftNavigation={
        <EpisClassicMd3LeftNavigation
          items={navItems}
          activeId={activeNavId}
          onSelect={handleNavSelect}
        />
      }
      mainPane={<EpisClassicMd3MainPane>{mainContent}</EpisClassicMd3MainPane>}
      {...(supportingContent
        ? {
            supportingPane: (
              <EpisClassicMd3SupportingPane
                open={supportingVisible}
                {...(onSupportingToggle ? { onToggle: onSupportingToggle } : {})}
              >
                {supportingContent}
              </EpisClassicMd3SupportingPane>
            ),
          }
        : {})}
      actionRail={
        <EpisClassicMd3ActionRail
          items={CLASSIC_ACTION_RAIL_DESTINATIONS.map((d) => ({ id: d.id, label: d.label }))}
          onSelect={handleRailSelect}
        />
      }
      bottomDock={
        <EpisClassicMd3BottomDock
          commandBar={
            <EpisClassicMd3CommandBar
              embedded
              query={commandQuery}
              onQueryChange={onCommandQueryChange}
              onSubmit={onCommandSubmit}
              {...(commandSuggestions ? { suggestions: commandSuggestions } : {})}
              {...(onCommandSuggestion ? { onSuggestionSelect: onCommandSuggestion } : {})}
            />
          }
          statusBar={
            <EpisClassicMd3StatusBar
              embedded
              draftStatusLabel={draftStatusLabel ?? copy.classicMd3.statusReadOnly}
              userLabel={session?.user.displayName}
              roleLabel={roleLabel}
              aiStatusLabel={aiAvailable ? copy.classicMd3.aiOk : copy.classicMd3.aiDegraded}
              dbStatusLabel={copy.classicMd3.dbOk}
              environmentLabel={copy.classicMd3.statusDemo}
            />
          }
        />
      }
    />
  );
}
