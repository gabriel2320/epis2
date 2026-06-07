import { EPIS2_COMMAND_DEFINITIONS } from './definitions.js';
import type { ClinicalIntent } from './types.js';

export type PhraseSuiteEntry = {
  phrase: string;
  intent: ClinicalIntent;
};

const PREFIXES = ['', 'por favor ', 'necesito ', 'quiero '];
const PATIENT_SUFFIXES = ['', ' al paciente', ' del paciente demo', ' paciente'];

const DASHBOARD_INTENTS = new Set<ClinicalIntent>([
  'open_dashboard',
  'open_dashboard_work',
  'open_dashboard_service',
  'open_dashboard_quality',
  'admit_patient_hospital',
]);

function expandPhrase(base: string, intent: ClinicalIntent): PhraseSuiteEntry[] {
  const entries: PhraseSuiteEntry[] = [{ phrase: base, intent }];
  if (intent !== 'search_patient') {
    for (const prefix of PREFIXES) {
      if (prefix) entries.push({ phrase: `${prefix}${base}`, intent });
    }
  }
  if (
    intent !== 'search_patient' &&
    !base.includes('paciente') &&
    !DASHBOARD_INTENTS.has(intent) &&
    intent !== 'open_dashboard_patient'
  ) {
    for (const suffix of PATIENT_SUFFIXES) {
      if (suffix) entries.push({ phrase: `${base}${suffix}`, intent });
    }
  }
  return entries;
}

/** Suite estática ≥100 frases para gates EPIS2-05. */
export function buildCommandPhraseSuite(): PhraseSuiteEntry[] {
  const seen = new Set<string>();
  const out: PhraseSuiteEntry[] = [];

  const push = (entry: PhraseSuiteEntry) => {
    const key = entry.phrase.trim().toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    out.push(entry);
  };

  for (const def of EPIS2_COMMAND_DEFINITIONS) {
    for (const alias of def.aliasesEs) {
      for (const expanded of expandPhrase(alias, def.intent)) {
        push(expanded);
      }
    }
  }

  const extras: PhraseSuiteEntry[] = [
    { phrase: 'buscar paciente garcia', intent: 'search_patient' },
    { phrase: 'busca paciente lopez', intent: 'search_patient' },
    { phrase: 'resume ultimas 24 horas del paciente', intent: 'summarize_patient' },
    { phrase: 'resumir historia clinica', intent: 'summarize_patient' },
    { phrase: 'ver sintesis clinica', intent: 'summarize_patient' },
    { phrase: 'evolucionar nota de hoy', intent: 'create_evolution_draft' },
    { phrase: 'escribir evolucion diaria', intent: 'create_evolution_draft' },
    { phrase: 'nota evolucion medica', intent: 'create_evolution_draft' },
    { phrase: 'generar epicrisis de alta', intent: 'prepare_discharge_draft' },
    { phrase: 'preparar alta medica', intent: 'prepare_discharge_draft' },
    { phrase: 'egreso del paciente', intent: 'prepare_discharge_draft' },
    { phrase: 'receta de amoxicilina', intent: 'prepare_prescription' },
    { phrase: 'prescribe paracetamol 500 mg', intent: 'prepare_prescription' },
    { phrase: 'preparar prescripcion', intent: 'prepare_prescription' },
    { phrase: 'orden laboratorio hemograma', intent: 'request_laboratory' },
    { phrase: 'solicitar analitica completa', intent: 'request_laboratory' },
    { phrase: 'pedir estudios de lab', intent: 'request_laboratory' },
    { phrase: 'crear evolucion', intent: 'create_evolution_draft' },
    { phrase: 'solicitar tac', intent: 'request_imaging' },
    { phrase: 'hacer interconsulta cardiologia', intent: 'request_referral' },
    { phrase: 'emitir receta', intent: 'prepare_prescription' },
    { phrase: 'preparar alta', intent: 'prepare_discharge_draft' },
    { phrase: 'abrir farmacia', intent: 'prepare_pharmacy_review' },
    { phrase: 'registrar alergia', intent: 'register_allergy' },
    { phrase: 'registrar problema', intent: 'register_problem' },
  ];

  for (const e of extras) push(e);

  return out;
}

export const COMMAND_PHRASE_SUITE = buildCommandPhraseSuite();
