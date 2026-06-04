import type { ClinicalIntent } from './types.js';

export type EpisDisambiguationRule = {
  id: string;
  matches: (normalized: string) => boolean;
  message: string;
  intentHints: readonly ClinicalIntent[];
};

/** Reglas EPIS P8 (disambiguation[]) adaptadas al MVP EPIS2. */
export const EPIS_DISAMBIGUATION_RULES: readonly EpisDisambiguationRule[] = [
  {
    id: 'rx-receta-vs-radiografia',
    matches: (q) => /\brx\b/.test(q) && !/(radiografia|torax|receta|prescripcion)/.test(q),
    message:
      '¿Receta médica o radiografía? En el MVP solo está disponible receta; imagen queda fuera de alcance.',
    intentHints: ['prepare_prescription'],
  },
];
