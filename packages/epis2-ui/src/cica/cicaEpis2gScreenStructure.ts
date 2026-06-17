import type { CicaScreenId } from './cicaRoutes.js';

/** Shell composicional epis2g → MUI CICA. */
export type CicaEpis2gShell =
  | 'system-workspace'
  | 'patient-panel'
  | 'patient-letter'
  | 'patient-list'
  | 'patient-book'
  | 'patient-paper';

export type CicaEpis2gBlock = {
  id: string;
  title: string;
  /** Acento borde superior — token epis2g. */
  accent?: 'sky' | 'indigo' | 'teal' | 'amber' | 'rose' | 'emerald' | 'slate';
  /** Columnas en grid lg (12 cols). */
  span?: number;
};

export type CicaEpis2gScreenStructure = {
  screenId: CicaScreenId;
  /** Tab epis2g SidebarCICA / App renderTabContent. */
  epis2gTab: string;
  shell: CicaEpis2gShell;
  blocks: readonly CicaEpis2gBlock[];
  workspaceTitle?: string;
  workspaceSubtitle?: string;
};

/** Mapa estructural donante epis2g — una fila = una pantalla App.tsx. */
export const EPIS2G_SCREEN_STRUCTURE: readonly CicaEpis2gScreenStructure[] = [
  {
    screenId: 'patient-search',
    epis2gTab: 'buscar',
    shell: 'system-workspace',
    workspaceTitle: 'Buscar Pacientes',
    workspaceSubtitle:
      'Encuentre pacientes mediante RUT, nombre completo o diagnósticos asociados.',
    blocks: [
      { id: 'search-input', title: 'Búsqueda clínica', accent: 'slate' },
      { id: 'service-filters', title: 'Filtro por servicio', accent: 'slate' },
      { id: 'patient-list', title: 'Resultados', accent: 'sky' },
    ],
  },
  {
    screenId: 'census',
    epis2gTab: 'censo',
    shell: 'system-workspace',
    workspaceTitle: 'Censo de Pacientes',
    workspaceSubtitle: 'Listado operacional consolidado de las camas críticas de la unidad.',
    blocks: [
      { id: 'search-input', title: 'Búsqueda clínica', accent: 'slate' },
      { id: 'service-filters', title: 'Filtro por servicio', accent: 'slate' },
      { id: 'patient-list', title: 'Censo activo', accent: 'sky' },
    ],
  },
  {
    screenId: 'recent-patients',
    epis2gTab: 'recientes',
    shell: 'system-workspace',
    workspaceTitle: 'Expedientes Recientes',
    workspaceSubtitle:
      'Acceso rápido a los últimos expedientes clínicos consultados por su usuario.',
    blocks: [{ id: 'recent-grid', title: 'Recorridos últimas horas', accent: 'indigo', span: 12 }],
  },
  {
    screenId: 'my-work',
    epis2gTab: 'mi-trabajo',
    shell: 'system-workspace',
    workspaceTitle: 'Mi Bandeja de Trabajo',
    workspaceSubtitle:
      'Tareas, firmas electrónicas pendientes y borradores de evolución por resolver hoy.',
    blocks: [
      { id: 'copilot-banner', title: 'Copiloto clínico', accent: 'indigo', span: 12 },
      { id: 'task-list', title: 'Tareas en bandeja', accent: 'amber', span: 12 },
    ],
  },
  {
    screenId: 'agenda',
    epis2gTab: 'agenda',
    shell: 'system-workspace',
    workspaceTitle: 'Agenda Quirúrgica de Guardia',
    workspaceSubtitle:
      'Visitas clínicas, pases de guardia y juntas médicas programadas para su turno.',
    blocks: [
      { id: 'agenda-timeline', title: 'Actividades cronometradas de hoy', accent: 'emerald', span: 12 },
    ],
  },
  {
    screenId: 'patient-summary',
    epis2gTab: 'resumen',
    shell: 'patient-panel',
    blocks: [
      { id: 'problems', title: 'Problemas de ingreso activos', accent: 'sky', span: 5 },
      { id: 'latest-evolution', title: 'Última evolución', accent: 'indigo', span: 7 },
      { id: 'active-orders', title: 'Indicaciones activas', accent: 'teal', span: 6 },
      { id: 'key-labs', title: 'Exámenes clave', accent: 'amber', span: 6 },
      { id: 'active-meds', title: 'Fármacos activos', accent: 'rose', span: 12 },
    ],
  },
  {
    screenId: 'patient-evolutions',
    epis2gTab: 'evoluciones',
    shell: 'patient-list',
    blocks: [
      { id: 'evolution-list', title: 'Historia evolutiva', accent: 'indigo', span: 12 },
    ],
  },
  {
    screenId: 'evolution-book',
    epis2gTab: 'evoluciones-libro',
    shell: 'patient-book',
    blocks: [{ id: 'book-pages', title: 'Libro de evoluciones', accent: 'indigo', span: 12 }],
  },
  {
    screenId: 'patient-admission',
    epis2gTab: 'ingreso',
    shell: 'patient-letter',
    blocks: [
      { id: 'anamnesis', title: 'Anamnesis', accent: 'sky', span: 12 },
      { id: 'morbid-background', title: 'Antecedentes mórbidos', accent: 'slate', span: 12 },
      { id: 'physical-exam', title: 'Examen físico', accent: 'teal', span: 12 },
      { id: 'admission-plan', title: 'Plan inicial', accent: 'emerald', span: 12 },
    ],
  },
  {
    screenId: 'patient-orders',
    epis2gTab: 'indicaciones',
    shell: 'patient-panel',
    blocks: [
      { id: 'order-compose', title: 'Nueva indicación', accent: 'teal', span: 12 },
      { id: 'order-list', title: 'Indicaciones del episodio', accent: 'teal', span: 12 },
    ],
  },
  {
    screenId: 'patient-exams',
    epis2gTab: 'examenes',
    shell: 'patient-panel',
    blocks: [{ id: 'lab-results', title: 'Resultados y tendencias', accent: 'amber', span: 12 }],
  },
  {
    screenId: 'patient-medications',
    epis2gTab: 'medicamentos',
    shell: 'patient-panel',
    blocks: [
      { id: 'med-compose', title: 'Prescripción', accent: 'rose', span: 12 },
      { id: 'med-list', title: 'Fármacos activos', accent: 'rose', span: 12 },
    ],
  },
  {
    screenId: 'patient-interconsultas',
    epis2gTab: 'interconsultas',
    shell: 'patient-list',
    blocks: [{ id: 'referral-list', title: 'Interconsultas', accent: 'indigo', span: 12 }],
  },
  {
    screenId: 'patient-procedures',
    epis2gTab: 'procedimientos',
    shell: 'patient-list',
    blocks: [{ id: 'procedure-log', title: 'Procedimientos / pabellón', accent: 'slate', span: 12 }],
  },
  {
    screenId: 'patient-documents',
    epis2gTab: 'documentos',
    shell: 'patient-panel',
    blocks: [{ id: 'document-list', title: 'Documentos y certificados', accent: 'slate', span: 12 }],
  },
  {
    screenId: 'patient-discharge',
    epis2gTab: 'alta',
    shell: 'patient-letter',
    blocks: [
      { id: 'discharge-summary', title: 'Epicrisis de alta', accent: 'emerald', span: 12 },
    ],
  },
  {
    screenId: 'patient-timeline',
    epis2gTab: 'timeline',
    shell: 'patient-list',
    blocks: [{ id: 'timeline-groups', title: 'Línea de tiempo', accent: 'indigo', span: 12 }],
  },
  {
    screenId: 'patient-audit',
    epis2gTab: 'auditoria',
    shell: 'patient-list',
    blocks: [{ id: 'audit-table', title: 'Trazas de auditoría', accent: 'slate', span: 12 }],
  },
  {
    screenId: 'new-evolution',
    epis2gTab: 'nueva-evolucion',
    shell: 'patient-letter',
    blocks: [{ id: 'soap-form', title: 'Evolución SOAP', accent: 'indigo', span: 12 }],
  },
  {
    screenId: 'evolution-detail',
    epis2gTab: 'evolucion-detalle',
    shell: 'patient-letter',
    blocks: [{ id: 'evolution-read', title: 'Evolución firmada', accent: 'indigo', span: 12 }],
  },
  {
    screenId: 'new-prescription',
    epis2gTab: 'nueva-receta',
    shell: 'patient-letter',
    blocks: [{ id: 'prescription-form', title: 'Prescripción médica', accent: 'teal', span: 12 }],
  },
  {
    screenId: 'new-document',
    epis2gTab: 'nuevo-documento',
    shell: 'patient-letter',
    blocks: [{ id: 'document-form', title: 'Certificado / documento', accent: 'slate', span: 12 }],
  },
  {
    screenId: 'new-epicrisis',
    epis2gTab: 'nueva-epicrisis',
    shell: 'patient-letter',
    blocks: [{ id: 'epicrisis-form', title: 'Epicrisis de alta', accent: 'emerald', span: 12 }],
  },
  {
    screenId: 'paper-day',
    epis2gTab: 'papel',
    shell: 'patient-paper',
    blocks: [{ id: 'paper-sheet', title: 'Hoja clínica diaria', accent: 'slate', span: 12 }],
  },
  {
    screenId: 'paper-book',
    epis2gTab: 'papel-libro',
    shell: 'patient-book',
    blocks: [{ id: 'paper-index', title: 'Libro clínico', accent: 'slate', span: 12 }],
  },
] as const;

export function findEpis2gScreenStructure(
  screenId: CicaScreenId,
): CicaEpis2gScreenStructure | undefined {
  return EPIS2G_SCREEN_STRUCTURE.find((s) => s.screenId === screenId);
}

export function epis2gStructureScreenIds(): CicaScreenId[] {
  return EPIS2G_SCREEN_STRUCTURE.map((s) => s.screenId);
}
