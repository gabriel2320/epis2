import { canSuggestActionToRole } from '../action-metadata.js';
import { loadMedicalActionCandidates } from './loader.js';
import { normalizeMedicalQuery } from './normalizer.js';
import { buildPrefillForCandidate, buildSecondarySuggestions } from './prefill.js';
import { sortRankedCandidates } from './ranker.js';
import type {
  MedicalActionCandidate,
  MedicalActionResolution,
  MedicalActionResolveInput,
  MedicalActionSuggestion,
} from './types.js';

const READ_ONLY_ROLES = new Set(['read_only', 'auditor']);

function primaryLabel(candidate: MedicalActionCandidate): string {
  switch (candidate.kind) {
    case 'medication':
      return `Indicar ${candidate.label}`;
    case 'lab_test':
      return `Solicitar ${candidate.label}`;
    case 'imaging_test':
      return `Solicitar ${candidate.label}`;
    case 'endoscopy':
    case 'procedure':
      return `Solicitar ${candidate.label}`;
    case 'interconsultation':
      return `Solicitar interconsulta — ${candidate.specialty ?? candidate.label}`;
    case 'document':
    case 'clinical_action':
      return candidate.label;
    default:
      return candidate.label;
  }
}

function chipForCandidate(candidate: MedicalActionCandidate): string {
  switch (candidate.kind) {
    case 'medication':
      return 'Orden médica';
    case 'lab_test':
      return 'Laboratorio';
    case 'imaging_test':
      return 'Imagen';
    case 'endoscopy':
      return 'Endoscopia';
    case 'procedure':
      return 'Procedimiento';
    case 'interconsultation':
      return 'Interconsulta';
    case 'document':
      return 'Documento médico';
    default:
      return 'Acción clínica';
  }
}

function candidateToPrimarySuggestion(
  candidate: MedicalActionCandidate,
  score: number,
  canPerformAction?: (actionId: string) => boolean,
  isActionAvailable?: (actionId: string) => boolean,
): MedicalActionSuggestion | null {
  const actionId = candidate.actionId;
  if (!actionId) return null;

  const allowedByRole = canPerformAction
    ? canPerformAction(actionId)
    : canSuggestActionToRole(actionId, 'attending_physician');
  const available = isActionAvailable ? isActionAvailable(actionId) : true;
  if (!allowedByRole || !available) return null;

  return {
    label: primaryLabel(candidate),
    description: `${chipForCandidate(candidate)} · ${candidate.description}`,
    kind: candidate.kind,
    actionId,
    prefillFormData: buildPrefillForCandidate(candidate),
    confidence: score >= 90 ? 'high' : score >= 70 ? 'medium' : 'low',
    chips: [chipForCandidate(candidate), candidate.source],
    source: candidate.source,
    requiresHumanReview: true,
    score,
    catalogId: candidate.id,
  };
}

export function resolveMedicalActions(input: MedicalActionResolveInput): MedicalActionResolution {
  const started = Date.now();
  const limit = input.limit ?? 3;
  const normalizedQuery = normalizeMedicalQuery(input.query);
  const fallbackUsed = false;

  if (normalizedQuery.length < 2) {
    return {
      query: input.query,
      normalizedQuery,
      candidates: [],
      suggestions: [],
      fallbackUsed: true,
      sourceStats: {},
      latencyMs: Date.now() - started,
    };
  }

  if (READ_ONLY_ROLES.has(input.role)) {
    const readSuggestions: MedicalActionSuggestion[] = [
      {
        label: 'Buscar en ficha clínica',
        description: 'Visualización · solo lectura',
        kind: 'visualization',
        viewId: 'lab_renal_trend',
        confidence: 'medium',
        chips: ['Lectura'],
        source: 'epione',
        requiresHumanReview: true,
        score: 60,
      },
    ];
    return {
      query: input.query,
      normalizedQuery,
      candidates: [],
      suggestions: readSuggestions.slice(0, limit),
      fallbackUsed: false,
      sourceStats: { read_only: 1 },
      latencyMs: Date.now() - started,
    };
  }

  const catalog = input.catalog ?? loadMedicalActionCandidates();
  const ranked = sortRankedCandidates(
    [...catalog],
    input.query,
    input.role,
    input.careContext,
    input.contextSignals,
  );

  const suggestions: MedicalActionSuggestion[] = [];
  const used = new Set<string>();

  for (const { candidate, score } of ranked) {
    if (suggestions.length >= limit) break;

    const primary = candidateToPrimarySuggestion(
      candidate,
      score,
      input.canPerformAction,
      input.isActionAvailable,
    );
    if (primary && !used.has(primary.label)) {
      suggestions.push(primary);
      used.add(primary.label);
    }

    if (suggestions.length >= limit) break;

    for (const secondary of buildSecondarySuggestions(candidate, input.canPerformAction)) {
      if (suggestions.length >= limit) break;
      if (used.has(secondary.label)) continue;
      if (secondary.actionId) {
        const ok = input.canPerformAction
          ? input.canPerformAction(secondary.actionId)
          : canSuggestActionToRole(secondary.actionId, input.role);
        if (!ok) continue;
      }
      suggestions.push({ ...secondary, score: secondary.score + score * 0.1 });
      used.add(secondary.label);
    }
  }

  const sourceStats: Record<string, number> = {};
  for (const s of suggestions) {
    sourceStats[s.source] = (sourceStats[s.source] ?? 0) + 1;
  }

  return {
    query: input.query,
    normalizedQuery,
    candidates: ranked.slice(0, 12).map((r) => r.candidate),
    suggestions: suggestions.slice(0, limit),
    fallbackUsed,
    sourceStats,
    latencyMs: Date.now() - started,
  };
}
