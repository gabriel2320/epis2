import type { AiAssistDraftRequest } from '@epis2/contracts';

export type DraftPromptSpec = {
  blueprintId: AiAssistDraftRequest['blueprintId'];
  taskTitle: string;
  taskDetail: string;
  fieldHints: string;
};

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
];

const catalogById = new Map(DRAFT_PROMPT_CATALOG.map((spec) => [spec.blueprintId, spec]));

export function getDraftPromptSpec(blueprintId: string): DraftPromptSpec | undefined {
  return catalogById.get(blueprintId);
}

export function listDraftPromptSpecs(): DraftPromptSpec[] {
  return [...DRAFT_PROMPT_CATALOG];
}
