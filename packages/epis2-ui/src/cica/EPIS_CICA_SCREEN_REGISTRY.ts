import type { CicaLayoutProfile } from './cicaTokens.js';

export type CicaScreenDefinition = {
  id: string;
  route: string;
  intent: string;
  primaryAction: string;
  layoutProfile: CicaLayoutProfile;
  forbiddenLegacy?: boolean;
  requiredSignals?: readonly string[];
};

/** Registro canónico — rutas más específicas primero (match exacto). */
export const EPIS_CICA_SCREEN_REGISTRY: readonly CicaScreenDefinition[] = [
  {
    id: 'patient-search',
    route: '/app/buscar',
    intent: 'Encontrar paciente y abrir ficha',
    primaryAction: 'Buscar',
    layoutProfile: 'patient-search',
    forbiddenLegacy: true,
  },
  {
    id: 'census',
    route: '/app/censo',
    intent: 'Elegir paciente desde lista clínica',
    primaryAction: 'Abrir ficha',
    layoutProfile: 'census',
    forbiddenLegacy: true,
  },
  {
    id: 'recent-patients',
    route: '/app/recientes',
    intent: 'Retomar pacientes abiertos recientemente',
    primaryAction: 'Abrir ficha',
    layoutProfile: 'census',
    forbiddenLegacy: true,
  },
  {
    id: 'my-work',
    route: '/app/mi-trabajo',
    intent: 'Revisar pendientes del profesional',
    primaryAction: 'Abrir tarea',
    layoutProfile: 'census',
    forbiddenLegacy: true,
  },
  {
    id: 'agenda',
    route: '/app/agenda',
    intent: 'Consultar agenda de guardia',
    primaryAction: 'Ver turno',
    layoutProfile: 'census',
    forbiddenLegacy: true,
  },
  {
    id: 'new-evolution',
    route: '/app/pacientes/:patientId/evoluciones/nueva',
    intent: 'Escribir evolución clínica',
    primaryAction: 'Guardar borrador',
    layoutProfile: 'letter-document',
    requiredSignals: ['patient', 'demo', 'draft-status'],
    forbiddenLegacy: true,
  },
  {
    id: 'evolution-book',
    route: '/app/pacientes/:patientId/evoluciones/libro',
    intent: 'Leer evoluciones como libro clínico',
    primaryAction: 'Nueva evolución',
    layoutProfile: 'book-reader',
    requiredSignals: ['patient', 'demo'],
    forbiddenLegacy: true,
  },
  {
    id: 'evolution-detail',
    route: '/app/pacientes/:patientId/evoluciones/:evolutionId',
    intent: 'Leer una evolución en página carta',
    primaryAction: 'Editar borrador',
    layoutProfile: 'letter-document',
    requiredSignals: ['patient', 'demo'],
    forbiddenLegacy: true,
  },
  {
    id: 'patient-evolutions',
    route: '/app/pacientes/:patientId/evoluciones',
    intent: 'Revisar historia evolutiva',
    primaryAction: 'Nueva evolución',
    layoutProfile: 'classic-chart',
    requiredSignals: ['patient', 'demo'],
    forbiddenLegacy: true,
  },
  {
    id: 'new-prescription',
    route: '/app/pacientes/:patientId/indicaciones/nueva',
    intent: 'Escribir prescripción médica',
    primaryAction: 'Guardar borrador',
    layoutProfile: 'letter-document',
    requiredSignals: ['patient', 'demo', 'draft-status'],
    forbiddenLegacy: true,
  },
  {
    id: 'new-document',
    route: '/app/pacientes/:patientId/documentos/nuevo',
    intent: 'Emitir certificado médico',
    primaryAction: 'Guardar borrador',
    layoutProfile: 'letter-document',
    requiredSignals: ['patient', 'demo', 'draft-status'],
    forbiddenLegacy: true,
  },
  {
    id: 'new-epicrisis',
    route: '/app/pacientes/:patientId/epicrisis/nueva',
    intent: 'Redactar epicrisis de alta',
    primaryAction: 'Guardar borrador',
    layoutProfile: 'letter-document',
    requiredSignals: ['patient', 'demo', 'draft-status'],
    forbiddenLegacy: true,
  },
  {
    id: 'patient-admission',
    route: '/app/pacientes/:patientId/ingreso',
    intent: 'Revisar datos de ingreso clínico',
    primaryAction: 'Editar ingreso',
    layoutProfile: 'classic-chart',
    requiredSignals: ['patient', 'demo'],
    forbiddenLegacy: true,
  },
  {
    id: 'patient-medications',
    route: '/app/pacientes/:patientId/medicamentos',
    intent: 'Revisar receta y fármacos activos',
    primaryAction: 'Nueva prescripción',
    layoutProfile: 'classic-chart',
    requiredSignals: ['patient', 'demo'],
    forbiddenLegacy: true,
  },
  {
    id: 'patient-interconsultas',
    route: '/app/pacientes/:patientId/interconsultas',
    intent: 'Gestionar interconsultas del episodio',
    primaryAction: 'Solicitar interconsulta',
    layoutProfile: 'classic-chart',
    requiredSignals: ['patient', 'demo'],
    forbiddenLegacy: true,
  },
  {
    id: 'patient-procedures',
    route: '/app/pacientes/:patientId/procedimientos',
    intent: 'Revisar procedimientos y pabellón',
    primaryAction: 'Registrar procedimiento',
    layoutProfile: 'classic-chart',
    requiredSignals: ['patient', 'demo'],
    forbiddenLegacy: true,
  },
  {
    id: 'patient-discharge',
    route: '/app/pacientes/:patientId/alta',
    intent: 'Preparar epicrisis y alta',
    primaryAction: 'Nueva epicrisis',
    layoutProfile: 'classic-chart',
    requiredSignals: ['patient', 'demo'],
    forbiddenLegacy: true,
  },
  {
    id: 'patient-timeline',
    route: '/app/pacientes/:patientId/timeline',
    intent: 'Recorrer línea de tiempo clínica',
    primaryAction: 'Filtrar eventos',
    layoutProfile: 'classic-chart',
    requiredSignals: ['patient', 'demo'],
    forbiddenLegacy: true,
  },
  {
    id: 'patient-audit',
    route: '/app/pacientes/:patientId/auditoria',
    intent: 'Auditar trazas y accesos',
    primaryAction: 'Exportar trazas',
    layoutProfile: 'classic-chart',
    requiredSignals: ['patient', 'demo'],
    forbiddenLegacy: true,
  },
  {
    id: 'paper-day',
    route: '/app/pacientes/:patientId/papel/dia/:date',
    intent: 'Leer hoja clínica diaria',
    primaryAction: 'Imprimir',
    layoutProfile: 'paper-mode',
    requiredSignals: ['patient', 'demo', 'draft-status'],
    forbiddenLegacy: true,
  },
  {
    id: 'paper-book',
    route: '/app/pacientes/:patientId/papel/libro',
    intent: 'Recorrer libro clínico del episodio',
    primaryAction: 'Abrir hoy',
    layoutProfile: 'paper-mode',
    requiredSignals: ['patient', 'demo'],
    forbiddenLegacy: true,
  },
  {
    id: 'patient-summary',
    route: '/app/pacientes/:patientId/resumen',
    intent: 'Comprender situación clínica del paciente',
    primaryAction: 'Nueva evolución',
    layoutProfile: 'classic-chart',
    requiredSignals: ['patient', 'demo', 'ai-state'],
    forbiddenLegacy: true,
  },
  {
    id: 'patient-orders',
    route: '/app/pacientes/:patientId/indicaciones',
    intent: 'Revisar y agregar indicaciones',
    primaryAction: 'Agregar indicación',
    layoutProfile: 'classic-chart',
    requiredSignals: ['patient', 'demo'],
    forbiddenLegacy: true,
  },
  {
    id: 'patient-exams',
    route: '/app/pacientes/:patientId/examenes',
    intent: 'Revisar resultados y tendencias',
    primaryAction: 'Ver resultados',
    layoutProfile: 'results',
    requiredSignals: ['patient', 'demo'],
    forbiddenLegacy: true,
  },
  {
    id: 'patient-documents',
    route: '/app/pacientes/:patientId/documentos',
    intent: 'Revisar documentos clínicos',
    primaryAction: 'Nuevo documento',
    layoutProfile: 'classic-chart',
    requiredSignals: ['patient', 'demo'],
    forbiddenLegacy: true,
  },
] as const;

export function findCicaScreenById(id: string): CicaScreenDefinition | undefined {
  return EPIS_CICA_SCREEN_REGISTRY.find((s) => s.id === id);
}

export function findCicaScreenByRoutePrefix(pathname: string): CicaScreenDefinition | undefined {
  return EPIS_CICA_SCREEN_REGISTRY.find((s) => {
    const pattern = s.route.replace(/:[^/]+/g, '[^/]+');
    return new RegExp(`^${pattern}$`).test(pathname);
  });
}
