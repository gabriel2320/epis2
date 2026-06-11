import { EPIS2_COMMAND_DEFINITIONS } from './definitions.js';
import type { ClinicalIntent } from './types.js';

/** Categoría UI del diccionario clínico (barra de comandos + menús). */
export type ClinicalCommandCategory =
  | 'paciente'
  | 'evolucion'
  | 'indicacion'
  | 'laboratorio'
  | 'imagenologia'
  | 'farmacia'
  | 'diagnostico'
  | 'alergia'
  | 'documento'
  | 'ingreso'
  | 'dashboard';

export type ClinicalCommandUiKind = 'action' | 'navigation' | 'form';

export type ClinicalCommandDictionaryEntry = {
  id: string;
  intent: ClinicalIntent;
  labelEs: string;
  synonyms: readonly string[];
  category: ClinicalCommandCategory;
  requiresPatient: boolean;
  uiKind: ClinicalCommandUiKind;
};

const CATEGORY_BY_INTENT: Partial<Record<ClinicalIntent, ClinicalCommandCategory>> = {
  search_patient: 'paciente',
  open_patient_chart: 'paciente',
  summarize_patient: 'paciente',
  create_evolution_draft: 'evolucion',
  prepare_discharge_draft: 'documento',
  prepare_prescription: 'farmacia',
  request_laboratory: 'laboratorio',
  request_imaging: 'imagenologia',
  request_referral: 'documento',
  request_procedure: 'indicacion',
  create_nursing_note: 'evolucion',
  record_medication_administration: 'farmacia',
  prepare_pharmacy_review: 'farmacia',
  register_allergy: 'alergia',
  register_problem: 'diagnostico',
  admit_patient_hospital: 'ingreso',
  open_results_inbox: 'laboratorio',
  reconcile_medications: 'farmacia',
  transfer_patient: 'ingreso',
  create_outpatient_visit: 'evolucion',
  create_medical_certificate: 'documento',
  respond_referral: 'documento',
  open_dashboard: 'dashboard',
  open_dashboard_work: 'dashboard',
  open_dashboard_patient: 'dashboard',
  open_dashboard_service: 'dashboard',
  open_dashboard_quality: 'dashboard',
};

const DIAGNOSIS_SYNONYMS = [
  'registrar diagnóstico',
  'agregar diagnóstico',
  'nuevo diagnóstico',
  'problema activo',
  'comorbilidad',
  'cie-10',
  'codigo cie',
  'hipotesis diagnostica',
  'impresion diagnostica',
] as const;

const EVOLUTION_SYNONYMS = [
  'evolucionar paciente',
  'nota de evolucion',
  'evolucion diaria',
  'nota medica de hoy',
  'registrar evolucion',
  'escribir evolucion',
] as const;

const LAB_SYNONYMS = [
  'solicitar laboratorio',
  'pedir hemograma',
  'orden de laboratorio',
  'analitica completa',
  'estudios de laboratorio',
  'examen de sangre',
] as const;

const PRESCRIPTION_SYNONYMS = [
  'emitir receta',
  'prescripcion medica',
  'recetar medicamento',
  'orden ambulatoria medicamento',
  'farmacia ambulatoria',
] as const;

const EXTRA_SYNONYMS: Partial<Record<ClinicalIntent, readonly string[]>> = {
  register_problem: DIAGNOSIS_SYNONYMS,
  create_evolution_draft: EVOLUTION_SYNONYMS,
  request_laboratory: LAB_SYNONYMS,
  prepare_prescription: PRESCRIPTION_SYNONYMS,
};

function uiKindForIntent(intent: ClinicalIntent): ClinicalCommandUiKind {
  if (intent === 'search_patient' || intent.startsWith('open_dashboard')) return 'navigation';
  if (intent.startsWith('open_')) return 'navigation';
  return 'form';
}

/** Diccionario canónico derivado del registry + sinónimos clínicos extendidos. */
export function buildClinicalCommandDictionary(): ClinicalCommandDictionaryEntry[] {
  return EPIS2_COMMAND_DEFINITIONS.map((def) => {
    const extra = EXTRA_SYNONYMS[def.intent] ?? [];
    const synonyms = [...new Set([def.labelEs, ...def.aliasesEs, ...extra])];
    return {
      id: def.intent,
      intent: def.intent,
      labelEs: def.labelEs,
      synonyms,
      category: CATEGORY_BY_INTENT[def.intent] ?? 'documento',
      requiresPatient: def.requiresPatient,
      uiKind: uiKindForIntent(def.intent),
    };
  });
}

export const CLINICAL_COMMAND_DICTIONARY = buildClinicalCommandDictionary();

export function getDictionaryEntriesByCategory(
  category: ClinicalCommandCategory,
): ClinicalCommandDictionaryEntry[] {
  return CLINICAL_COMMAND_DICTIONARY.filter((e) => e.category === category);
}

/** Autocompletar frases para barra de comandos (prefijo normalizado). */
export function filterClinicalCommandAutocomplete(
  query: string,
  options?: {
    requiresPatient?: boolean | undefined;
    limit?: number | undefined;
    categories?: readonly ClinicalCommandCategory[] | undefined;
  },
): string[] {
  const q = query.trim().toLowerCase();
  const limit = options?.limit ?? 8;
  const out: string[] = [];
  const seen = new Set<string>();

  for (const entry of CLINICAL_COMMAND_DICTIONARY) {
    if (options?.requiresPatient === true && !entry.requiresPatient) continue;
    if (options?.categories?.length && !options.categories.includes(entry.category)) continue;
    for (const phrase of entry.synonyms) {
      const key = phrase.toLowerCase();
      if (seen.has(key)) continue;
      if (!q || key.includes(q) || key.startsWith(q)) {
        seen.add(key);
        out.push(phrase);
        if (out.length >= limit) return out;
      }
    }
  }
  return out;
}

/** Etiquetas agrupadas para menú desplegable por categoría. */
export function getClinicalCommandMenuGroups(): {
  category: ClinicalCommandCategory;
  labelEs: string;
  items: readonly { phrase: string; intent: ClinicalIntent }[];
}[] {
  const labels: Record<ClinicalCommandCategory, string> = {
    paciente: 'Paciente',
    evolucion: 'Evolución',
    indicacion: 'Indicaciones',
    laboratorio: 'Laboratorio',
    imagenologia: 'Imagenología',
    farmacia: 'Farmacia',
    diagnostico: 'Diagnósticos',
    alergia: 'Alergias',
    documento: 'Documentos',
    ingreso: 'Ingreso / traslado',
    dashboard: 'Tablero operativo',
  };

  const categories = [...new Set(CLINICAL_COMMAND_DICTIONARY.map((e) => e.category))];
  return categories.map((category) => ({
    category,
    labelEs: labels[category],
    items: getDictionaryEntriesByCategory(category).map((e) => ({
      phrase: e.labelEs,
      intent: e.intent,
    })),
  }));
}
