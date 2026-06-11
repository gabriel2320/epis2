import type { ClinicalIntent } from './types.js';

/** Familias clínicas del Command Engine (agrupación UX, no segundo registry). */
export type CommandFamily =
  | 'search_patient'
  | 'open_chart'
  | 'daily_evolution'
  | 'medical_order'
  | 'laboratory_request'
  | 'laboratory_review'
  | 'imaging_review'
  | 'referral'
  | 'pharmacy_mar'
  | 'discharge'
  | 'print_document'
  | 'ai_assist'
  | 'navigation';

export type CommandSafetyLevel = 'read' | 'draft' | 'order' | 'sign';
export type CommandActionType = 'navigate' | 'open_form' | 'open_panel' | 'ai_assist' | 'search';

export type CommandRequiredContext = 'patient' | 'encounter' | 'draft';

export type CommandCategory =
  | 'search'
  | 'documentation'
  | 'orders'
  | 'review'
  | 'pharmacy'
  | 'discharge'
  | 'navigation'
  | 'assist';

export type SecureCommandMeta = {
  family: CommandFamily;
  description: string;
  category: CommandCategory;
  requiredContext: readonly CommandRequiredContext[];
  safetyLevel: CommandSafetyLevel;
  actionType: CommandActionType;
  confirmationRequired: boolean;
  examples: readonly string[];
  formId?: string;
};

export const INTENT_SECURE_METADATA: Record<ClinicalIntent, SecureCommandMeta> = {
  search_patient: {
    family: 'search_patient',
    description: 'Buscar paciente por nombre, RUT o código demo.',
    category: 'search',
    requiredContext: [],
    safetyLevel: 'read',
    actionType: 'search',
    confirmationRequired: false,
    examples: ['buscar paciente Juan', 'encontrar paciente'],
  },
  open_patient_chart: {
    family: 'open_chart',
    description: 'Abrir la ficha clínica del paciente activo.',
    category: 'navigation',
    requiredContext: ['patient'],
    safetyLevel: 'read',
    actionType: 'navigate',
    confirmationRequired: false,
    examples: ['abrir ficha', 'ver ficha', 'ir a la ficha'],
  },
  summarize_patient: {
    family: 'ai_assist',
    description: 'Resumen clínico o asistencia IA sobre el caso activo.',
    category: 'assist',
    requiredContext: ['patient'],
    safetyLevel: 'read',
    actionType: 'ai_assist',
    confirmationRequired: false,
    examples: ['resumir caso', 'preguntar a la IA por este paciente'],
    formId: 'clinical_summary',
  },
  create_evolution_draft: {
    family: 'daily_evolution',
    description: 'Crear borrador de evolución o nota SOAP.',
    category: 'documentation',
    requiredContext: ['patient'],
    safetyLevel: 'draft',
    actionType: 'open_form',
    confirmationRequired: false,
    examples: ['hacer evolución', 'escribir SOAP'],
    formId: 'evolution_note',
  },
  prepare_discharge_draft: {
    family: 'discharge',
    description: 'Preparar epicrisis o documentos de alta.',
    category: 'discharge',
    requiredContext: ['patient'],
    safetyLevel: 'draft',
    actionType: 'open_form',
    confirmationRequired: true,
    examples: ['preparar alta', 'dejarlo listo para irse'],
    formId: 'discharge_summary',
  },
  prepare_prescription: {
    family: 'medical_order',
    description: 'Preparar receta o prescripción (borrador).',
    category: 'orders',
    requiredContext: ['patient'],
    safetyLevel: 'order',
    actionType: 'open_form',
    confirmationRequired: true,
    examples: ['imprimir receta', 'preparar receta'],
    formId: 'prescription',
  },
  request_laboratory: {
    family: 'laboratory_request',
    description: 'Solicitar estudios de laboratorio.',
    category: 'orders',
    requiredContext: ['patient'],
    safetyLevel: 'order',
    actionType: 'open_form',
    confirmationRequired: true,
    examples: ['solicitar hemograma', 'pedir analítica'],
    formId: 'lab_order',
  },
  request_referral: {
    family: 'referral',
    description: 'Crear interconsulta a especialidad.',
    category: 'orders',
    requiredContext: ['patient'],
    safetyLevel: 'order',
    actionType: 'open_form',
    confirmationRequired: true,
    examples: ['crear interconsulta a cardiología'],
    formId: 'referral_request',
  },
  request_imaging: {
    family: 'imaging_review',
    description: 'Solicitar estudio de imagenología.',
    category: 'orders',
    requiredContext: ['patient'],
    safetyLevel: 'order',
    actionType: 'open_form',
    confirmationRequired: true,
    examples: ['pedir TAC de tórax'],
    formId: 'imaging_order',
  },
  request_procedure: {
    family: 'medical_order',
    description: 'Solicitar procedimiento diagnóstico o terapéutico.',
    category: 'orders',
    requiredContext: ['patient', 'encounter'],
    safetyLevel: 'order',
    actionType: 'open_form',
    confirmationRequired: true,
    examples: ['solicitar endoscopia', 'pedir biopsia', 'orden de procedimiento'],
    formId: 'procedure_request',
  },
  create_nursing_note: {
    family: 'daily_evolution',
    description: 'Nota de enfermería o cuidados.',
    category: 'documentation',
    requiredContext: ['patient'],
    safetyLevel: 'draft',
    actionType: 'open_form',
    confirmationRequired: false,
    examples: ['nota de enfermería'],
    formId: 'nursing_note',
  },
  record_medication_administration: {
    family: 'pharmacy_mar',
    description: 'Registrar administración MAR.',
    category: 'pharmacy',
    requiredContext: ['patient'],
    safetyLevel: 'order',
    actionType: 'open_form',
    confirmationRequired: true,
    examples: ['ver MAR', 'administrar medicamento'],
    formId: 'mar_entry',
  },
  prepare_pharmacy_review: {
    family: 'pharmacy_mar',
    description: 'Revisión farmacéutica o antibióticos.',
    category: 'pharmacy',
    requiredContext: ['patient'],
    safetyLevel: 'draft',
    actionType: 'open_form',
    confirmationRequired: false,
    examples: ['revisar antibióticos'],
    formId: 'pharmacy_review',
  },
  open_dashboard: {
    family: 'navigation',
    description: 'Abrir modo tablero.',
    category: 'navigation',
    requiredContext: [],
    safetyLevel: 'read',
    actionType: 'navigate',
    confirmationRequired: false,
    examples: ['abrir tablero'],
  },
  open_dashboard_work: {
    family: 'navigation',
    description: 'Ver mi trabajo y tareas pendientes.',
    category: 'navigation',
    requiredContext: [],
    safetyLevel: 'read',
    actionType: 'navigate',
    confirmationRequired: false,
    examples: ['ver mi trabajo'],
  },
  open_dashboard_patient: {
    family: 'open_chart',
    description: 'Tablero del paciente activo.',
    category: 'navigation',
    requiredContext: ['patient'],
    safetyLevel: 'read',
    actionType: 'navigate',
    confirmationRequired: false,
    examples: ['tablero del paciente'],
  },
  open_dashboard_service: {
    family: 'navigation',
    description: 'Tablero del servicio.',
    category: 'navigation',
    requiredContext: [],
    safetyLevel: 'read',
    actionType: 'navigate',
    confirmationRequired: false,
    examples: ['tablero del servicio'],
  },
  open_dashboard_quality: {
    family: 'navigation',
    description: 'Tablero de calidad y auditoría.',
    category: 'navigation',
    requiredContext: [],
    safetyLevel: 'read',
    actionType: 'navigate',
    confirmationRequired: false,
    examples: ['tablero de calidad'],
  },
  admit_patient_hospital: {
    family: 'medical_order',
    description: 'Ingreso hospitalario.',
    category: 'orders',
    requiredContext: ['patient'],
    safetyLevel: 'order',
    actionType: 'open_form',
    confirmationRequired: true,
    examples: ['ingreso hospitalario'],
    formId: 'hospital_admission',
  },
  open_results_inbox: {
    family: 'laboratory_review',
    description: 'Revisar resultados, laboratorio o exámenes.',
    category: 'review',
    requiredContext: ['patient'],
    safetyLevel: 'read',
    actionType: 'open_panel',
    confirmationRequired: false,
    examples: ['ver exámenes de hoy', 'revisar hemograma'],
    formId: 'results_inbox',
  },
  reconcile_medications: {
    family: 'pharmacy_mar',
    description: 'Conciliar o revisar medicamentos.',
    category: 'pharmacy',
    requiredContext: ['patient'],
    safetyLevel: 'draft',
    actionType: 'open_form',
    confirmationRequired: false,
    examples: ['revisar medicamentos'],
    formId: 'med_reconciliation',
  },
  transfer_patient: {
    family: 'medical_order',
    description: 'Nota de traslado.',
    category: 'orders',
    requiredContext: ['patient'],
    safetyLevel: 'draft',
    actionType: 'open_form',
    confirmationRequired: true,
    examples: ['trasladar paciente'],
    formId: 'transfer_note',
  },
  create_outpatient_visit: {
    family: 'daily_evolution',
    description: 'Consulta ambulatoria.',
    category: 'documentation',
    requiredContext: ['patient'],
    safetyLevel: 'draft',
    actionType: 'open_form',
    confirmationRequired: false,
    examples: ['consulta ambulatoria'],
    formId: 'outpatient_visit',
  },
  create_medical_certificate: {
    family: 'print_document',
    description: 'Certificado médico o reposo.',
    category: 'documentation',
    requiredContext: ['patient'],
    safetyLevel: 'draft',
    actionType: 'open_form',
    confirmationRequired: true,
    examples: ['imprimir certificado'],
    formId: 'medical_certificate',
  },
  respond_referral: {
    family: 'referral',
    description: 'Informe de interconsulta.',
    category: 'documentation',
    requiredContext: ['patient'],
    safetyLevel: 'draft',
    actionType: 'open_form',
    confirmationRequired: false,
    examples: ['informe de interconsulta'],
    formId: 'referral_response',
  },
  register_allergy: {
    family: 'medical_order',
    description: 'Registrar alergia.',
    category: 'documentation',
    requiredContext: ['patient'],
    safetyLevel: 'draft',
    actionType: 'open_form',
    confirmationRequired: false,
    examples: ['registrar alergia'],
    formId: 'allergy_entry',
  },
  register_problem: {
    family: 'medical_order',
    description: 'Registrar problema clínico.',
    category: 'documentation',
    requiredContext: ['patient'],
    safetyLevel: 'draft',
    actionType: 'open_form',
    confirmationRequired: false,
    examples: ['registrar problema'],
    formId: 'clinical_problem_entry',
  },
  paper_order_soap: {
    family: 'daily_evolution',
    description: 'Insertar u ordenar contenido clínico en sección SOAP (modo papel).',
    category: 'assist',
    requiredContext: ['patient'],
    safetyLevel: 'draft',
    actionType: 'ai_assist',
    confirmationRequired: false,
    examples: ['ordenar en soap', 'anotar orden en sección V'],
    formId: 'paper_chart',
  },
  paper_summarize_24h: {
    family: 'ai_assist',
    description: 'Resumir últimas 24 horas en ficha papel.',
    category: 'assist',
    requiredContext: ['patient'],
    safetyLevel: 'read',
    actionType: 'ai_assist',
    confirmationRequired: false,
    examples: ['resumir últimas 24h', 'síntesis último día'],
    formId: 'paper_chart',
  },
  paper_prepare_print: {
    family: 'print_document',
    description: 'Preparar vista impresión ficha papel.',
    category: 'documentation',
    requiredContext: ['patient'],
    safetyLevel: 'read',
    actionType: 'navigate',
    confirmationRequired: false,
    examples: ['preparar impresión', 'vista previa impresión'],
  },
  paper_prepare_discharge_draft: {
    family: 'discharge',
    description: 'Borrador epicrisis en sección VII (modo papel).',
    category: 'documentation',
    requiredContext: ['patient'],
    safetyLevel: 'draft',
    actionType: 'ai_assist',
    confirmationRequired: true,
    examples: ['preparar epicrisis borrador', 'completar alta en ficha'],
    formId: 'paper_chart',
  },
  paper_create_prescription_a5: {
    family: 'medical_order',
    description: 'Receta formato A5 desde ficha papel.',
    category: 'orders',
    requiredContext: ['patient'],
    safetyLevel: 'draft',
    actionType: 'open_form',
    confirmationRequired: false,
    examples: ['crear receta A5', 'receta formato a5'],
    formId: 'prescription',
  },
  paper_detect_pending: {
    family: 'ai_assist',
    description: 'Detectar pendientes y borradores IA sin confirmar en ficha papel.',
    category: 'assist',
    requiredContext: ['patient'],
    safetyLevel: 'read',
    actionType: 'ai_assist',
    confirmationRequired: false,
    examples: ['detectar pendientes', 'revisar borradores IA'],
    formId: 'paper_chart',
  },
};

export function getSecureCommandMeta(intent: ClinicalIntent): SecureCommandMeta {
  return INTENT_SECURE_METADATA[intent];
}
