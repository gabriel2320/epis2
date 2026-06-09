import { copy } from '@epis2/design-system';
import { useRouterState } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { useAuth } from '../../auth/AuthContext.js';
import { useActivePatient } from '../../clinical/ActivePatientContext.js';
import { useClinicalNavigate } from '../../routes/clinicalNavigate.js';
import { useEpisSession } from '../../session/EpisSessionContext.js';
import { useAiStatusQuery } from '../../query/hooks/useAiStatusQuery.js';
import { resolvePatientChartTabId, type PatientChartTabId } from '../../clinical/patientChartNavigation.js';
import {
  CLASSIC_ACTION_RAIL_DESTINATIONS,
  CLASSIC_LEFT_NAV_DESTINATIONS,
} from '../../classic-md3/classicNavDestinations.js';
import {
  EpisClassicMd3ActionRail,
  EpisClassicMd3CommandBar,
  EpisClassicMd3LeftNavigation,
  EpisClassicMd3MainPane,
  EpisClassicMd3PatientHeader,
  EpisClassicMd3Shell,
  EpisClassicMd3StatusBar,
  EpisClassicMd3SupportingPane,
  EpisClassicMd3TopAppBar,
} from './index.js';

export type ClassicMd3WorkspaceLayoutProps = {
  patientId?: string;
  metaLine?: string;
  allergyLabels?: readonly string[];
  alertLabels?: readonly string[];
  mainContent: ReactNode;
  supportingContent?: ReactNode;
  supportingOpen?: boolean;
  onSupportingToggle?: () => void;
  commandQuery: string;
  onCommandQueryChange: (value: string) => void;
  onCommandSubmit: () => void;
  commandSuggestions?: readonly string[];
  onCommandSuggestion?: (label: string) => void;
  onOpenCommandPalette?: () => void;
  draftStatusLabel?: string;
};

/** Layout visual modo clásico — props/callbacks únicamente. */
export function ClassicMd3WorkspaceLayout({
  patientId,
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
  onOpenCommandPalette,
  draftStatusLabel,
}: ClassicMd3WorkspaceLayoutProps) {
  const navigate = useClinicalNavigate();
  const { openCommandCenter } = useEpisSession();
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

  return (
    <EpisClassicMd3Shell
      topAppBar={
        <EpisClassicMd3TopAppBar
          patientLabel={patient?.displayName}
          clinicianLabel={session?.user.displayName}
          roleLabel={roleLabel}
          serviceLabel={copy.demoBadge}
          timestampLabel={new Date().toLocaleString('es-CL')}
          onBackToCommand={() => openCommandCenter(patientId)}
          {...(onOpenCommandPalette ? { onOpenCommandPalette } : {})}
        />
      }
      patientHeader={
        <EpisClassicMd3PatientHeader
          displayName={patient?.displayName}
          metaLine={metaLine}
          allergyLabels={allergyLabels}
          alertLabels={alertLabels}
          episodeLabel={copy.classicMd3.episodeOpen}
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
                open={supportingOpen}
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
      commandBar={
        <EpisClassicMd3CommandBar
          query={commandQuery}
          onQueryChange={onCommandQueryChange}
          onSubmit={onCommandSubmit}
          {...(commandSuggestions ? { suggestions: commandSuggestions } : {})}
          {...(onCommandSuggestion ? { onSuggestionSelect: onCommandSuggestion } : {})}
        />
      }
      statusBar={
        <EpisClassicMd3StatusBar
          draftStatusLabel={draftStatusLabel ?? copy.classicMd3.statusReadOnly}
          userLabel={session?.user.displayName}
          roleLabel={roleLabel}
          aiStatusLabel={aiAvailable ? copy.classicMd3.aiOk : copy.classicMd3.aiDegraded}
          dbStatusLabel={copy.classicMd3.dbOk}
          environmentLabel={copy.classicMd3.statusDemo}
        />
      }
    />
  );
}
