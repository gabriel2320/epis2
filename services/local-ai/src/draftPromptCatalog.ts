import type { AiAssistDraftRequest } from '@epis2/contracts';

export type DraftPromptSpec = {
  blueprintId: AiAssistDraftRequest['blueprintId'];
  taskTitle: string;
  taskDetail: string;
  fieldHints: string;
};

/** Versión del catálogo de prompts (trazabilidad V5). */
export const PROMPT_CATALOG_VERSION = 'epis2-prompts-v1.1';

/** Tareas EPIS adaptadas a blueprints EPIS2 (sin RAG ni catálogo OpenMRS). */
export const DRAFT_PROMPT_CATALOG: DraftPromptSpec[] = [
  {
    blueprintId: 'evolution_note',
    taskTitle: 'Evolución médica (SOAP)',
    taskDetail:
      'Redacta borrador de nota de evolución con subjective, objective, assessment y plan breves.',
    fieldHints: 'Enfócate en el encuentro actual; no repitas un resumen longitudinal completo.',
  },
  {
    blueprintId: 'discharge_summary',
    taskTitle: 'Epicrisis / alta hospitalaria',
    taskDetail:
      'Incluye motivo de hospitalización, evolución, diagnósticos principales y plan al alta.',
    fieldHints: 'Si faltan datos de alta, decláralo en evolución o instrucciones.',
  },
  {
    blueprintId: 'prescription',
    taskTitle: 'Receta médica',
    taskDetail:
      'Sugiere medicamento, dosis, cantidad, vía, frecuencia, duración e indicaciones al paciente solo si hay contexto suficiente.',
    fieldHints:
      'Incluye patientInstructions en lenguaje claro para el paciente. Nunca indiques dispensar o firmar; es borrador para revisión.',
  },
  {
    blueprintId: 'lab_request',
    taskTitle: 'Solicitud de laboratorio',
    taskDetail: 'Propón estudios de laboratorio y razón clínica acorde al contexto.',
    fieldHints: 'Prioridad rutina salvo urgencia explícita en contexto.',
  },
  {
    blueprintId: 'nursing_note',
    taskTitle: 'Nota de enfermería',
    taskDetail:
      'Registra signos vitales, cuidados prestados, respuesta del paciente y observaciones relevantes.',
    fieldHints: 'Usa valores plausibles demo; no inventes diagnósticos médicos.',
  },
  {
    blueprintId: 'medication_administration',
    taskTitle: 'Administración medicamentosa (MAR)',
    taskDetail:
      'Documenta medicamento, dosis, vía, horario programado y hora de administración con notas de doble chequeo si aplica.',
    fieldHints: 'Marca doubleCheckConfirmed solo si el contexto indica medicamento de alto riesgo.',
  },
  {
    blueprintId: 'admission_note',
    taskTitle: 'Nota de ingreso hospitalario',
    taskDetail:
      'Redacta motivo de ingreso, resumen clínico y plan inicial para hospitalización demo.',
    fieldHints: 'No indiques cama ocupada; usa 102A si está disponible en contexto.',
  },
  {
    blueprintId: 'allergy_entry',
    taskTitle: 'Registro de alergia',
    taskDetail: 'Propón sustancia, severidad y notas de reacción según contexto del paciente.',
    fieldHints: 'No inventes alergias sin evidencia en contexto longitudinal.',
  },
  {
    blueprintId: 'clinical_problem_entry',
    taskTitle: 'Problema clínico activo',
    taskDetail: 'Describe problema activo en lenguaje clínico breve.',
    fieldHints: 'Estado active salvo resolución explícita en contexto.',
  },
  {
    blueprintId: 'pharmacy_validation',
    taskTitle: 'Validación farmacéutica',
    taskDetail:
      'Propón intervención farmacéutica o conciliación para la medicación activa del paciente.',
    fieldHints:
      'Si hay polifarmacia, sugiere intervención documentada; nunca indiques dispensar sin revisión humana.',
  },
  {
    blueprintId: 'medication_reconciliation',
    taskTitle: 'Conciliación medicamentosa',
    taskDetail:
      'Compara medicamentos domiciliarios e hospitalarios, documenta discrepancias y plan de conciliación.',
    fieldHints:
      'Usa medicación activa del contexto; no elimines medicamentos sin justificación clínica en el plan.',
  },
];

const catalogById = new Map(DRAFT_PROMPT_CATALOG.map((spec) => [spec.blueprintId, spec]));

export function getDraftPromptSpec(blueprintId: string): DraftPromptSpec | undefined {
  return catalogById.get(blueprintId);
}

export function listDraftPromptSpecs(): DraftPromptSpec[] {
  return [...DRAFT_PROMPT_CATALOG];
}
