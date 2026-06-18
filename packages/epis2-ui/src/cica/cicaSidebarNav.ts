import { copy } from '@epis2/design-system';
import { buildCicaPath, todayIsoDate, type CicaScreenId } from './cicaRoutes.js';
import { CICA_CHART_TAB_REGISTRY, type CicaChartTabId } from './CICA_CHART_TAB_REGISTRY.js';

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

  const systemScreens: { id: string; screenId: CicaScreenId; label: string }[] = [
    { id: 'search', screenId: 'patient-search', label: copy.clinicalNav.search },
    { id: 'census', screenId: 'census', label: copy.clinicalNav.census },
    { id: 'agenda', screenId: 'agenda', label: 'Agenda guardia' },
    { id: 'my-work', screenId: 'my-work', label: 'Mi trabajo' },
    { id: 'recent', screenId: 'recent-patients', label: 'Recientes' },
  ];

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

type PatientNavEntry =
  | { kind: 'tab'; tabId: CicaChartTabId }
  | {
      kind: 'screen';
      id: string;
      screenId: CicaScreenId;
      label: string;
      pathMatch: string;
      planned?: boolean;
    };

/** L2 visible — master tree §3.2 (tabs + medicamentos + papel). */
const PATIENT_PRIMARY_ORDER: readonly PatientNavEntry[] = [
  { kind: 'tab', tabId: 'resumen' },
  { kind: 'tab', tabId: 'evoluciones' },
  { kind: 'tab', tabId: 'indicaciones' },
  { kind: 'tab', tabId: 'examenes' },
  {
    kind: 'screen',
    id: 'medicamentos',
    screenId: 'patient-medications',
    label: copy.chartModes.navMeds,
    pathMatch: '/medicamentos',
  },
  { kind: 'tab', tabId: 'documentos' },
  { kind: 'tab', tabId: 'papel' },
];

/** Overflow «Más» — master tree §3.2. */
const PATIENT_MORE_ORDER: readonly PatientNavEntry[] = [
  {
    kind: 'screen',
    id: 'ingreso',
    screenId: 'patient-admission',
    label: 'Ingreso clínico',
    pathMatch: '/ingreso',
  },
  {
    kind: 'screen',
    id: 'enfermeria',
    screenId: 'patient-admission',
    label: 'Enfermería',
    pathMatch: '/enfermeria',
    planned: true,
  },
  {
    kind: 'screen',
    id: 'interconsultas',
    screenId: 'patient-interconsultas',
    label: 'Interconsultas',
    pathMatch: '/interconsultas',
  },
  {
    kind: 'screen',
    id: 'procedimientos',
    screenId: 'patient-procedures',
    label: 'Procedimientos',
    pathMatch: '/procedimientos',
  },
  {
    kind: 'screen',
    id: 'cirugia',
    screenId: 'patient-procedures',
    label: 'Cirugía',
    pathMatch: '/cirugia',
    planned: true,
  },
  {
    kind: 'screen',
    id: 'uci',
    screenId: 'patient-admission',
    label: 'UCI',
    pathMatch: '/uci',
    planned: true,
  },
  {
    kind: 'screen',
    id: 'alta',
    screenId: 'patient-discharge',
    label: 'Epicrisis / alta',
    pathMatch: '/alta',
  },
  {
    kind: 'screen',
    id: 'timeline',
    screenId: 'patient-timeline',
    label: 'Línea de tiempo',
    pathMatch: '/timeline',
  },
  {
    kind: 'screen',
    id: 'auditoria',
    screenId: 'patient-audit',
    label: copy.chartModes.navAudit,
    pathMatch: '/auditoria',
  },
  {
    kind: 'screen',
    id: 'evolution-book',
    screenId: 'evolution-book',
    label: 'Libro evoluciones',
    pathMatch: '/evoluciones/libro',
  },
  {
    kind: 'screen',
    id: 'paper-book',
    screenId: 'paper-book',
    label: 'Libro clínico',
    pathMatch: '/papel/libro',
  },
];

function tabLabel(tabId: CicaChartTabId): string {
  const labels: Record<CicaChartTabId, string> = {
    resumen: 'Resumen',
    evoluciones: 'Evoluciones',
    indicaciones: 'Indicaciones',
    examenes: 'Exámenes',
    documentos: 'Documentos',
    papel: copy.clinicalNav.paper,
  };
  return labels[tabId];
}

function mapPatientNavEntries(
  ctx: CicaSidebarNavContext,
  order: readonly PatientNavEntry[],
): CicaSidebarItem[] {
  const { pathname, patientId, onNavigate } = ctx;
  if (!patientId) return [];

  return order.map((entry) => {
    if (entry.kind === 'tab') {
      const tab = CICA_CHART_TAB_REGISTRY.find((t) => t.id === entry.tabId);
      if (!tab) {
        return { id: entry.tabId, label: tabLabel(entry.tabId), disabled: true };
      }
      const href =
        tab.pathKind === 'paper-day'
          ? buildCicaPath('paper-day', { patientId, date: todayIsoDate() })
          : buildCicaPath(tab.screenId, { patientId });
      return {
        id: tab.id,
        label: tabLabel(tab.id),
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
        label: entry.label,
        disabled: true,
        planned: true,
        testId: `cica-sidebar-patient-${entry.id}`,
      };
    }

    const href = buildCicaPath(entry.screenId, { patientId });
    return {
      id: entry.id,
      label: entry.label,
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
    items: mapPatientNavEntries(ctx, PATIENT_PRIMARY_ORDER),
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
    items: mapPatientNavEntries(ctx, PATIENT_MORE_ORDER),
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
