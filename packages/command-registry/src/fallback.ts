import { isClinicalRole, roleHasPermission } from '@epis2/clinical-domain';
import { contextFallbackIntents } from './context-rank.js';
import { EPIS2_COMMAND_DEFINITIONS } from './definitions.js';
import { getSecureCommandMeta } from './intent-metadata.js';
import type { RankedCommandMatch } from './rank.js';
import { topClarificationCandidates } from './rank.js';
import type { ClinicalIntent, CommandActiveContext, CommandCandidate, CommandDefinition } from './types.js';

export const MIN_GUIDED_CANDIDATES = 3;
export const MAX_GUIDED_CANDIDATES = 5;

const DEFAULT_FALLBACK_BY_ROLE: Record<string, readonly ClinicalIntent[]> = {
  physician: [
    'search_patient',
    'create_evolution_draft',
    'summarize_patient',
    'open_results_inbox',
    'prepare_discharge_draft',
  ],
  nurse: [
    'search_patient',
    'create_nursing_note',
    'record_medication_administration',
    'open_results_inbox',
    'open_dashboard_work',
  ],
  pharmacist: [
    'search_patient',
    'prepare_pharmacy_review',
    'reconcile_medications',
    'open_results_inbox',
    'open_dashboard_work',
  ],
  admin: [
    'search_patient',
    'open_dashboard_work',
    'open_dashboard_service',
    'admit_patient_hospital',
    'summarize_patient',
  ],
  auditor: [
    'open_dashboard_quality',
    'open_dashboard',
    'search_patient',
    'summarize_patient',
    'open_results_inbox',
  ],
};

const KEYWORD_INTENT_BOOSTS: Array<{
  pattern: RegExp;
  intents: readonly ClinicalIntent[];
}> = [
  {
    pattern: /evolucion|soap|nota\s+diaria/,
    intents: ['create_evolution_draft', 'create_nursing_note', 'summarize_patient'],
  },
  {
    pattern: /laboratorio|hemograma|analitica|examenes/,
    intents: ['open_results_inbox', 'request_laboratory', 'summarize_patient'],
  },
  {
    pattern: /imagen|tac|radiografia|rx\b/,
    intents: ['open_results_inbox', 'request_imaging', 'summarize_patient'],
  },
  {
    pattern: /alta|epicrisis|egreso|irse/,
    intents: ['prepare_discharge_draft', 'summarize_patient', 'open_results_inbox'],
  },
  {
    pattern: /receta|prescripcion|medicamento|mar|farmacia|antibiotico/,
    intents: [
      'prepare_prescription',
      'reconcile_medications',
      'prepare_pharmacy_review',
      'record_medication_administration',
    ],
  },
  {
    pattern: /interconsulta|derivar|especialidad/,
    intents: ['request_referral', 'respond_referral', 'summarize_patient'],
  },
  {
    pattern: /buscar|encontrar|ficha|paciente/,
    intents: ['search_patient', 'open_patient_chart', 'summarize_patient', 'open_dashboard_patient'],
  },
  {
    pattern: /resumen|resumir|ia\b|caso/,
    intents: ['summarize_patient', 'prepare_discharge_draft', 'open_results_inbox'],
  },
  {
    pattern: /imprimir|certificado|documento/,
    intents: [
      'create_medical_certificate',
      'prepare_prescription',
      'prepare_discharge_draft',
    ],
  },
];

function definitionForIntent(intent: ClinicalIntent): CommandDefinition | undefined {
  return EPIS2_COMMAND_DEFINITIONS.find((d) => d.intent === intent);
}

function toCandidate(def: CommandDefinition): CommandCandidate {
  return { intent: def.intent, labelEs: def.labelEs };
}

function isAllowedForRole(def: CommandDefinition, role: string): boolean {
  if (!isClinicalRole(role)) return false;
  return roleHasPermission(role, def.requiredPermission);
}

function dedupeCandidates(candidates: CommandCandidate[]): CommandCandidate[] {
  const seen = new Set<string>();
  const out: CommandCandidate[] = [];
  for (const c of candidates) {
    if (seen.has(c.intent)) continue;
    seen.add(c.intent);
    out.push(c);
  }
  return out;
}

export function buildGuidedFallbackCandidates(input: {
  role: string;
  normalized: string;
  ranked: RankedCommandMatch[];
  intentHints?: readonly ClinicalIntent[];
  hasPatient?: boolean;
  context?: CommandActiveContext;
}): CommandCandidate[] {
  const { role, normalized, ranked, intentHints = [], hasPatient, context } = input;
  const fromRanked = topClarificationCandidates(ranked, MAX_GUIDED_CANDIDATES);
  const hinted: CommandCandidate[] = [];

  for (const intent of contextFallbackIntents(context, Boolean(hasPatient))) {
    const def = definitionForIntent(intent);
    if (def && isAllowedForRole(def, role)) {
      hinted.push(toCandidate(def));
    }
  }

  for (const intent of intentHints) {
    const def = definitionForIntent(intent);
    if (def && isAllowedForRole(def, role)) {
      hinted.push(toCandidate(def));
    }
  }

  for (const rule of KEYWORD_INTENT_BOOSTS) {
    if (!rule.pattern.test(normalized)) continue;
    for (const intent of rule.intents) {
      const def = definitionForIntent(intent);
      if (def && isAllowedForRole(def, role)) {
        hinted.push(toCandidate(def));
      }
    }
  }

  const roleDefaults = DEFAULT_FALLBACK_BY_ROLE[role] ?? DEFAULT_FALLBACK_BY_ROLE.physician!;
  for (const intent of roleDefaults) {
    const def = definitionForIntent(intent);
    if (def && isAllowedForRole(def, role)) {
      hinted.push(toCandidate(def));
    }
  }

  const merged = dedupeCandidates([...fromRanked, ...hinted]);

  if (hasPatient === false) {
    const search = definitionForIntent('search_patient');
    if (search && isAllowedForRole(search, role)) {
      return dedupeCandidates([toCandidate(search), ...merged]).slice(0, MAX_GUIDED_CANDIDATES);
    }
  }

  while (merged.length < MIN_GUIDED_CANDIDATES) {
    for (const def of EPIS2_COMMAND_DEFINITIONS) {
      if (merged.length >= MIN_GUIDED_CANDIDATES) break;
      if (!isAllowedForRole(def, role)) continue;
      if (merged.some((c) => c.intent === def.intent)) continue;
      merged.push(toCandidate(def));
    }
    break;
  }

  return merged.slice(0, MAX_GUIDED_CANDIDATES);
}

export const GUIDED_FALLBACK_MESSAGE =
  'No encontré una acción exacta. ¿Quieres revisar, crear, imprimir o preguntar sobre el caso?';

export function isUsefulCommandResolveResult(
  result: { status: string; candidates?: CommandCandidate[] },
): boolean {
  if (result.status === 'resolved' || result.status === 'needs_patient' || result.status === 'forbidden') {
    return true;
  }
  if (result.status === 'needs_confirmation') {
    return true;
  }
  if (result.status === 'needs_clarification') {
    return (result.candidates?.length ?? 0) >= MIN_GUIDED_CANDIDATES;
  }
  if (result.status === 'empty') {
    return false;
  }
  return false;
}

export function requiresConfirmation(intent: ClinicalIntent): boolean {
  return getSecureCommandMeta(intent).confirmationRequired;
}
