import type { ClinicalIntent } from './types.js';

/** Rutas del espacio clínico — destino tras resolver comando. */
export const INTENT_ROUTE_PATHS: Record<ClinicalIntent, string> = {
  search_patient: '/espacio/buscar-paciente',
  open_patient_chart: '/espacio/ficha',
  summarize_patient: '/espacio/resumen',
  create_evolution_draft: '/espacio/evolucion',
  prepare_discharge_draft: '/espacio/epicrisis',
  prepare_prescription: '/espacio/receta',
  request_laboratory: '/espacio/laboratorio',
  request_referral: '/espacio/interconsulta',
  request_imaging: '/espacio/imagenologia',
  request_procedure: '/espacio/procedimiento',
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
  create_medical_certificate: '/espacio/certificado',
  respond_referral: '/espacio/informe-interconsulta',
  register_allergy: '/espacio/alergia',
  register_problem: '/espacio/problema',
};

/** Rutas que antes eran botones en ficha — deben resolverse vía comando. */
export const WORKSPACE_QUICK_ROUTE_INTENTS: Record<string, ClinicalIntent> = {
  '/espacio/ficha': 'open_patient_chart',
  '/espacio/resumen': 'summarize_patient',
  '/espacio/ambulatorio': 'create_outpatient_visit',
  '/espacio/evolucion': 'create_evolution_draft',
  '/espacio/epicrisis': 'prepare_discharge_draft',
  '/espacio/receta': 'prepare_prescription',
  '/espacio/laboratorio': 'request_laboratory',
  '/espacio/imagenologia': 'request_imaging',
  '/espacio/procedimiento': 'request_procedure',
  '/espacio/interconsulta': 'request_referral',
  '/espacio/certificado': 'create_medical_certificate',
  '/espacio/alergia': 'register_allergy',
  '/espacio/problema': 'register_problem',
  '/espacio/conciliacion': 'reconcile_medications',
  '/espacio/enfermeria': 'create_nursing_note',
  '/espacio/mar': 'record_medication_administration',
  '/espacio/farmacia': 'prepare_pharmacy_review',
  '/espacio/ingreso': 'admit_patient_hospital',
  '/espacio/traslado': 'transfer_patient',
  '/espacio/resultados': 'open_results_inbox',
};

export const DASHBOARD_TAB_BY_INTENT: Partial<Record<ClinicalIntent, string>> = {
  open_dashboard: 'work',
  open_dashboard_work: 'work',
  open_dashboard_patient: 'patient',
  open_dashboard_service: 'service',
  open_dashboard_quality: 'quality',
};
