import { copy } from '@epis2/design-system';
import {
  AdminPanelSettingsIcon,
  BiotechIcon,
  CalendarMonthIcon,
  EpisAppearancePreferencesLink,
  EpisThemeModeToggle,
  ForumIcon,
  HealthAndSafetyIcon,
  LocalHospitalIcon,
  MonitorHeartIcon,
  PersonSearchIcon,
  ScienceIcon,
  SettingsIcon,
  TerminalIcon,
} from '@epis2/epis2-ui';
import type { EpisClinicalWorkspaceId, EpisNavigationRailItem } from '@epis2/epis2-ui';
import { useRouterState } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { useClinicalNavigate } from '../routes/clinicalNavigate.js';
import type { ClinicalNavigateOptions } from '../routes/clinicalNavigate.js';
import {
  CLINICAL_WORKSPACE_ORDER,
  getClinicalWorkspaceDefinition,
  getWorkspaceDefaultRoute,
  parseClinicalRoute,
  routeMatchesPath,
  type WorkspaceRouteTarget,
} from './clinicalWorkspaceRegistry.js';
import { useClinicalWorkspace } from './useClinicalWorkspace.js';
import { resolveWorkspaceCopyKey } from './workspaceCopy.js';

function toNavigateOptions(target: WorkspaceRouteTarget): ClinicalNavigateOptions {
  return target as ClinicalNavigateOptions;
}

const WORKSPACE_ICONS: Record<EpisClinicalWorkspaceId, ReactNode> = {
  command: <TerminalIcon />,
  reception: <ForumIcon />,
  ambulatory: <LocalHospitalIcon />,
  emergency: <HealthAndSafetyIcon />,
  icu: <MonitorHeartIcon />,
  or: <BiotechIcon />,
  quality_iaas: <HealthAndSafetyIcon />,
  admin_system: <AdminPanelSettingsIcon />,
};

const CONTEXTUAL_ICONS: Record<string, ReactNode> = {
  'daily-agenda': <CalendarMonthIcon />,
  'waiting-room': <ForumIcon />,
  honorarios: <ScienceIcon />,
  patients: <PersonSearchIcon />,
  'quality-kpi': <HealthAndSafetyIcon />,
  epi: <ScienceIcon />,
  iaas: <HealthAndSafetyIcon />,
  'bed-mgmt': <LocalHospitalIcon />,
  'emr-config': <SettingsIcon />,
  roles: <PersonSearchIcon />,
  hardware: <MonitorHeartIcon />,
  interop: <ScienceIcon />,
  'forms-studio': <SettingsIcon />,
  'or-schedule': <CalendarMonthIcon />,
  'or-rooms': <BiotechIcon />,
};

/** Ítems del Navigation Rail — N0 conmutador de workspace + árbol contextual. */
export function useEpis2NavigationRailItems(): EpisNavigationRailItem[] {
  const navigate = useClinicalNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const searchStr = useRouterState({ select: (s) => s.location.searchStr });
  const { activeWorkspace, setWorkspace, canUseWorkspace } = useClinicalWorkspace();

  const isAgenda = pathname.startsWith('/epis2/dashboard');
  const isSearch =
    pathname.startsWith('/espacio/buscar-paciente') || pathname.startsWith('/espacio/ficha');
  const isSettings = pathname.startsWith('/preferencias-apariencia');

  const switcherItems: EpisNavigationRailItem[] = CLINICAL_WORKSPACE_ORDER.map((workspaceId) => {
    const def = getClinicalWorkspaceDefinition(workspaceId);
    return {
      id: `workspace-${workspaceId}`,
      label: resolveWorkspaceCopyKey(def.labelKey),
      icon: WORKSPACE_ICONS[workspaceId],
      active: activeWorkspace === workspaceId,
      disabled: !canUseWorkspace(workspaceId),
      onClick: () => {
        setWorkspace(workspaceId);
        const target = getWorkspaceDefaultRoute(workspaceId);
        void navigate(toNavigateOptions(target));
      },
      'data-testid': `epis2-nav-workspace-${workspaceId}`,
    };
  });

  const contextualItems: EpisNavigationRailItem[] =
    activeWorkspace === 'command'
      ? [
          {
            id: 'agenda',
            label: copy.patientChart.rail.agenda,
            icon: <CalendarMonthIcon />,
            active: isAgenda,
            onClick: () => void navigate({ to: '/epis2/dashboard', search: { tab: 'work' } }),
            'data-testid': 'epis2-nav-agenda',
          },
          {
            id: 'search',
            label: copy.patientChart.rail.search,
            icon: <PersonSearchIcon />,
            active: isSearch,
            onClick: () => void navigate({ to: '/espacio/buscar-paciente' }),
            'data-testid': 'epis2-nav-search',
          },
          {
            id: 'messages',
            label: copy.patientChart.rail.messages,
            icon: <ForumIcon />,
            disabled: true,
            'data-testid': 'epis2-nav-messages',
          },
          {
            id: 'settings',
            label: copy.patientChart.rail.settings,
            icon: <SettingsIcon />,
            active: isSettings,
            onClick: () => void navigate({ to: '/preferencias-apariencia' }),
            'data-testid': 'epis2-nav-settings',
          },
        ]
      : [
          ...getClinicalWorkspaceDefinition(activeWorkspace).railItems.map((item) => ({
            id: item.id,
            label: resolveWorkspaceCopyKey(item.labelKey),
            icon: CONTEXTUAL_ICONS[item.id] ?? <LocalHospitalIcon />,
            active: routeMatchesPath(pathname, searchStr, item.route),
            disabled: item.disabled,
            onClick: item.disabled
              ? undefined
              : () => {
                  void navigate(toNavigateOptions(parseClinicalRoute(item.route)));
                },
            'data-testid': `epis2-nav-${item.id}`,
          })),
          {
            id: 'settings',
            label: copy.patientChart.rail.settings,
            icon: <SettingsIcon />,
            active: isSettings,
            onClick: () => void navigate({ to: '/preferencias-apariencia' }),
            'data-testid': 'epis2-nav-settings',
          },
        ];

  return [
    ...switcherItems,
    { id: 'workspace-divider', label: '', variant: 'divider' as const },
    ...contextualItems,
  ];
}

export function Epis2NavigationRailFooter() {
  return (
    <>
      <EpisAppearancePreferencesLink />
      <EpisThemeModeToggle />
    </>
  );
}
