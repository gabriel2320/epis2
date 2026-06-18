import { copy } from '@epis2/design-system';
import { findCicaScreenById } from './EPIS_CICA_SCREEN_REGISTRY.js';
import { buildCicaPath, type CicaScreenId } from './cicaRoutes.js';
import {
  CICA_PATIENT_MORE_NAV,
  CICA_PATIENT_PRIMARY_NAV,
  CLINICAL_CHART_TAB_REGISTRY,
  buildCicaChartTabPath,
  chartTabLabelEs,
  type CicaPatientNavEntry,
} from './clinicalChartTabRegistry.js';

export type CicaSidebarItem = {
  id: string;
  label: string;
  href?: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  testId?: string;
  /** Próximamente — visible pero no navegable. */
  planned?: boolean;
};

export type CicaSidebarSection = {
  id: string;
  title: string;
  items: readonly CicaSidebarItem[];
};

export type CicaSidebarNavContext = {
  pathname: string;
  patientId?: string | undefined;
  onNavigate: (to: string) => void;
};

function isActivePath(pathname: string, target: string): boolean {
  return pathname === target || pathname.startsWith(`${target}/`);
}

function isActiveMatch(pathname: string, fragment: string): boolean {
  return pathname.includes(fragment);
}

/** Nivel 1 — sistema (siempre visible). Orden master tree §3.1. */
export function buildCicaSystemSidebarSections(ctx: CicaSidebarNavContext): CicaSidebarSection[] {
  const { pathname, onNavigate } = ctx;

  const systemScreens = (
    [
      { id: 'search', screenId: 'patient-search', label: copy.clinicalNav.search },
      { id: 'census', screenId: 'census', label: copy.clinicalNav.census },
      { id: 'agenda', screenId: 'agenda', label: 'Agenda guardia' },
      { id: 'my-work', screenId: 'my-work', label: 'Mi trabajo' },
      { id: 'recent', screenId: 'recent-patients', label: 'Recientes' },
    ] as const
  ).filter((entry) => findCicaScreenById(entry.screenId)?.navVisible !== false);

  return [
    {
      id: 'system',
      title: 'Entrada clínica',
      items: systemScreens.map((entry) => {
        const href = buildCicaPath(entry.screenId);
        return {
          id: entry.id,
          label: entry.label,
          active: isActivePath(pathname, href),
          onClick: () => onNavigate(href),
          testId: `cica-sidebar-${entry.id}`,
        };
      }),
    },
  ];
}

function mapPatientNavEntries(
  ctx: CicaSidebarNavContext,
  order: readonly CicaPatientNavEntry[],
): CicaSidebarItem[] {
  const { pathname, patientId, onNavigate } = ctx;
  if (!patientId) return [];

  return order.map((entry) => {
    if (entry.kind === 'tab') {
      const tab = CLINICAL_CHART_TAB_REGISTRY.find((t) => t.id === entry.tabId);
      if (!tab) {
        return { id: entry.tabId, label: chartTabLabelEs(entry.tabId), disabled: true };
      }
      const href = buildCicaChartTabPath(entry.tabId, patientId);
      return {
        id: tab.id,
        label: tab.labelEs,
        href,
        active:
          tab.pathKind === 'paper-day'
            ? pathname.includes('/papel/dia/')
            : pathname.includes(`/${tab.segment}`) &&
              !pathname.includes('/evoluciones/libro') &&
              !pathname.includes('/papel/libro'),
        onClick: () => onNavigate(href),
        testId: `cica-sidebar-patient-${tab.id}`,
      };
    }

    if (entry.planned) {
      return {
        id: entry.id,
        label: entry.labelEs,
        disabled: true,
        planned: true,
        testId: `cica-sidebar-patient-${entry.id}`,
      };
    }

    const href = buildCicaPath(entry.screenId as CicaScreenId, { patientId });
    return {
      id: entry.id,
      label: entry.labelEs,
      active: isActiveMatch(pathname, entry.pathMatch),
      onClick: () => onNavigate(href),
      testId: `cica-sidebar-patient-${entry.id}`,
    };
  });
}

/** Nivel 2 — paciente visible (cuando hay patientId). */
export function buildCicaPatientSidebarSection(
  ctx: CicaSidebarNavContext,
): CicaSidebarSection | null {
  if (!ctx.patientId) return null;

  return {
    id: 'patient',
    title: 'Paciente actual',
    items: mapPatientNavEntries(ctx, CICA_PATIENT_PRIMARY_NAV),
  };
}

/** Overflow «Más» — secciones secundarias de ficha. */
export function buildCicaPatientMoreSidebarSection(
  ctx: CicaSidebarNavContext,
): CicaSidebarSection | null {
  if (!ctx.patientId) return null;

  return {
    id: 'patient-more',
    title: 'Más',
    items: mapPatientNavEntries(ctx, CICA_PATIENT_MORE_NAV),
  };
}

/** Herramientas — pie de sidebar. */
export function buildCicaToolsSidebarSection(ctx: CicaSidebarNavContext): CicaSidebarSection {
  return {
    id: 'tools',
    title: 'Herramientas',
    items: [
      {
        id: 'appearance',
        label: 'Apariencia',
        onClick: () => ctx.onNavigate('/preferencias-apariencia'),
        testId: 'cica-sidebar-appearance',
      },
    ],
  };
}

export function buildCicaSidebarSections(ctx: CicaSidebarNavContext): CicaSidebarSection[] {
  const sections = [...buildCicaSystemSidebarSections(ctx)];
  const patient = buildCicaPatientSidebarSection(ctx);
  const patientMore = buildCicaPatientMoreSidebarSection(ctx);
  if (patient) sections.push(patient);
  if (patientMore) sections.push(patientMore);
  sections.push(buildCicaToolsSidebarSection(ctx));
  return sections;
}
