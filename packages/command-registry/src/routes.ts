import type { ClinicalIntent } from './types.js';

/** Rutas del espacio clínico — destino tras resolver comando. */
export const INTENT_ROUTE_PATHS: Record<ClinicalIntent, string> = {
  search_patient: '/espacio/buscar-paciente',
  summarize_patient: '/espacio/resumen',
  create_evolution_draft: '/espacio/evolucion',
  prepare_discharge_draft: '/espacio/epicrisis',
  prepare_prescription: '/espacio/receta',
  request_laboratory: '/espacio/laboratorio',
};
