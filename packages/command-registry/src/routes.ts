import type { ClinicalIntent } from './types.js';

/** Rutas del espacio clínico — destino tras resolver comando. */
export const INTENT_ROUTE_PATHS: Record<ClinicalIntent, string> = {
  search_patient: '/espacio/buscar-paciente',
  summarize_patient: '/espacio/resumen',
  create_evolution_draft: '/espacio/evolucion',
  prepare_discharge_draft: '/espacio/epicrisis',
  prepare_prescription: '/espacio/receta',
  request_laboratory: '/espacio/laboratorio',
  request_referral: '/espacio/interconsulta',
  request_imaging: '/espacio/imagenologia',
  create_nursing_note: '/espacio/enfermeria',
  record_medication_administration: '/espacio/mar',
  prepare_pharmacy_review: '/espacio/farmacia',
  open_dashboard: '/epis2/dashboard',
  open_dashboard_work: '/epis2/dashboard',
  open_dashboard_patient: '/epis2/dashboard',
  open_dashboard_service: '/epis2/dashboard',
  open_dashboard_quality: '/epis2/dashboard',
  admit_patient_hospital: '/espacio/ingreso',
  open_results_inbox: '/espacio/resultados',
  reconcile_medications: '/espacio/conciliacion',
  transfer_patient: '/espacio/traslado',
  create_outpatient_visit: '/espacio/ambulatorio',
  respond_referral: '/espacio/informe-interconsulta',
};

export const DASHBOARD_TAB_BY_INTENT: Partial<Record<ClinicalIntent, string>> = {
  open_dashboard: 'work',
  open_dashboard_work: 'work',
  open_dashboard_patient: 'patient',
  open_dashboard_service: 'service',
  open_dashboard_quality: 'quality',
};
