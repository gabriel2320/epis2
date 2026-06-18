import { normalizeCommandText } from '@epis2/command-registry';

/** Normalización ES-CL para lexicon — delega en command-registry. */
export function normalizeClinicalSpanish(raw: string): string {
  return normalizeCommandText(raw);
}
