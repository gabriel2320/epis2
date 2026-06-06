import { EPIS2_COMMAND_DEFINITIONS } from './definitions.js';
import { normalizeCommandText } from './normalize.js';
import type { CommandDefinition } from './types.js';

/** Umbral mínimo para considerar un intent (inspirado en MAU EPIONE, sin catálogo Lyra). */
export const MIN_MATCH_SCORE = 52;

/** Separación de score para resolver sin pedir aclaración. */
export const SCORE_GAP_FOR_UNIQUE = 8;

export type RankedCommandMatch = {
  def: CommandDefinition;
  score: number;
};

const QUERY_STOP_WORDS = new Set([
  'al',
  'del',
  'de',
  'la',
  'el',
  'por',
  'favor',
  'necesito',
  'quiero',
  'paciente',
  'demo',
  'y',
]);

function tokenize(normalized: string): string[] {
  return normalized
    .split(/\s+/)
    .filter((t) => t.length > 1 && !QUERY_STOP_WORDS.has(t));
}

function aliasScore(
  normalized: string,
  alias: string,
  tokens: string[],
): number {
  const a = normalizeCommandText(alias);
  if (!a) return 0;
  if (normalized === a) return 100;
  if (
    normalized.startsWith(`${a} `) ||
    normalized.endsWith(` ${a}`) ||
    normalized.includes(` ${a} `)
  ) {
    return 92;
  }
  if (normalized.includes(a)) return Math.min(88, 68 + Math.min(a.length, 20));

  const aliasTokens = tokenize(a);
  if (aliasTokens.length === 0) return 0;
  const overlap = aliasTokens.filter((t) => tokens.includes(t)).length;
  if (overlap === 0) return 0;
  const ratio = overlap / Math.max(aliasTokens.length, tokens.length);
  return Math.round(55 + ratio * 35);
}

function entityBoost(
  def: CommandDefinition,
  normalized: string,
  raw: string,
): number {
  const lower = raw.toLowerCase();
  if (
    def.intent === 'request_laboratory' &&
    (/\b(hemograma|glucosa|creatinina|analitica|bioquimica|hb\s+ht)\b/.test(normalized) ||
      (/\b(pide|pedir|solicitar)\b/.test(normalized) &&
        /\b(hemograma|analitica|laboratorio)\b/.test(normalized)))
  ) {
    return 84;
  }
  if (
    def.intent === 'prepare_prescription' &&
    (/\b(amoxicilina|paracetamol|recetar|medicamento)\b/.test(lower) ||
      (/\b(prescripcion|receta|prescribe)\b/.test(normalized) &&
        !/\b(laboratorio|analitica|hemograma)\b/.test(normalized)))
  ) {
    return 86;
  }
  if (
    def.intent === 'prepare_discharge_draft' &&
    /\b(egreso|alta\s+medica|alta\s+hospitalaria)\b/.test(normalized)
  ) {
    return 82;
  }
  if (
    def.intent === 'respond_referral' &&
    /informe|respuesta|contestar|especialista/.test(normalized)
  ) {
    return 96;
  }
  if (
    def.intent === 'request_referral' &&
    /informe|respuesta|contestar|especialista/.test(normalized)
  ) {
    return 0;
  }
  if (def.intent.startsWith('open_dashboard')) {
    if (/\b(tablero|dashboard|mi\s+trabajo|mis\s+tareas|indicadores)\b/.test(normalized)) {
      return 88;
    }
  }
  return 0;
}

export function scoreCommandDefinition(
  def: CommandDefinition,
  normalized: string,
  raw: string,
): number {
  if (def.intent.startsWith('open_dashboard')) {
    const clinicalTopic = /sintesis|resumen|evolucion|epicrisis|receta|laboratorio|hemograma/.test(
      normalized,
    );
    const dashboardTopic =
      /\b(tablero|dashboard|mi\s+trabajo|mis\s+tareas|calidad|auditoria)\b/.test(normalized);
    if (clinicalTopic && !dashboardTopic) {
      return 0;
    }
  }

  const tokens = tokenize(normalized);
  let score = 0;

  if (def.match(normalized)) {
    score = 78;
  }

  for (const label of [def.labelEs, ...def.aliasesEs]) {
    score = Math.max(score, aliasScore(normalized, label, tokens));
  }

  score = Math.max(score, entityBoost(def, normalized, raw));
  return score;
}

export function rankCommandDefinitions(raw: string): RankedCommandMatch[] {
  const normalized = normalizeCommandText(raw);
  if (!normalized) return [];

  return EPIS2_COMMAND_DEFINITIONS.map((def) => ({
    def,
    score: scoreCommandDefinition(def, normalized, raw),
  }))
    .filter((r) => r.score >= MIN_MATCH_SCORE)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.def.priority - b.def.priority;
    });
}

export function pickBestFromRanked(
  ranked: RankedCommandMatch[],
): CommandDefinition | null {
  if (ranked.length === 0) return null;
  const first = ranked[0];
  if (!first) return null;
  if (ranked.length === 1) return first.def;

  const second = ranked[1];
  if (!second) return first.def;

  if (first.score - second.score >= SCORE_GAP_FOR_UNIQUE) {
    return first.def;
  }
  if (first.score >= 92 && first.score > second.score) {
    return first.def;
  }
  return null;
}

export function topClarificationCandidates(
  ranked: RankedCommandMatch[],
  limit = 3,
): Array<{ intent: CommandDefinition['intent']; labelEs: string }> {
  return ranked.slice(0, limit).map((r) => ({
    intent: r.def.intent,
    labelEs: r.def.labelEs,
  }));
}
