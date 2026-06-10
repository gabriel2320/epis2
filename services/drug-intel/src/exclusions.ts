/**
 * Filtro de exclusión del pipeline: solo fármacos de uso clínico entran al
 * staging. Quedan fuera homeopáticos, suplementos/vitamínicos sin indicación
 * clínica, cosméticos y sustancias de uso no clínico.
 */

export interface ProductCandidate {
  name: string;
  /** Categoría declarada por la fuente (ej. tipo de registro ISP). */
  sourceCategory?: string;
  activeIngredient?: string;
  atcCode?: string;
}

export type ExclusionResult =
  | { excluded: false }
  | { excluded: true; reason: ExclusionReason; matched: string };

export type ExclusionReason = 'homeopathic' | 'supplement' | 'cosmetic' | 'non_clinical';

const EXCLUDED_SOURCE_CATEGORIES: Array<{ pattern: RegExp; reason: ExclusionReason }> = [
  { pattern: /homeop/i, reason: 'homeopathic' },
  { pattern: /cosm[eé]tic/i, reason: 'cosmetic' },
  { pattern: /higiene|perfum/i, reason: 'cosmetic' },
  { pattern: /suplemento|alimento/i, reason: 'supplement' },
  {
    pattern: /pesticida|plaguicida|desinfectante ambiental|uso veterinario/i,
    reason: 'non_clinical',
  },
];

const EXCLUDED_NAME_PATTERNS: Array<{ pattern: RegExp; reason: ExclusionReason }> = [
  {
    pattern: /homeop[aá]tic|dilucio[nó]n\s+ch\b|\bch\s*\d{1,3}\b|\bd\d{1,2}\b.*dinamizad/i,
    reason: 'homeopathic',
  },
  { pattern: /flores de bach/i, reason: 'homeopathic' },
  { pattern: /suplemento(\s+alimenticio|\s+diet[eé]tico)?\b/i, reason: 'supplement' },
  { pattern: /multivitam[ií]nico|complejo vitam[ií]nico/i, reason: 'supplement' },
  { pattern: /prote[ií]na (whey|en polvo)|creatina monohidrat/i, reason: 'supplement' },
  {
    pattern:
      /crema (facial|antiarrugas|humectante)|shampoo|champ[uú]|bloqueador solar|protector solar/i,
    reason: 'cosmetic',
  },
  { pattern: /jab[oó]n|desodorante|maquillaje|pasta dental cosm/i, reason: 'cosmetic' },
  {
    pattern: /repelente de insectos|desinfectante de superficies|alcohol gel dom[eé]stico/i,
    reason: 'non_clinical',
  },
];

/**
 * Grupos ATC sin uso clínico farmacológico para el catálogo EPIS2 v1
 * (ej. V20 apósitos quirúrgicos). Los grupos clínicos nunca se excluyen
 * por nombre: el ATC válido tiene prioridad sobre heurísticas de texto.
 */
const EXCLUDED_ATC_PREFIXES = ['V20', 'V07'];

export function evaluateExclusion(candidate: ProductCandidate): ExclusionResult {
  const category = candidate.sourceCategory?.trim();
  if (category) {
    for (const { pattern, reason } of EXCLUDED_SOURCE_CATEGORIES) {
      if (pattern.test(category)) {
        return { excluded: true, reason, matched: `category:${category}` };
      }
    }
  }

  const atc = candidate.atcCode?.trim().toUpperCase();
  if (atc) {
    const excludedAtc = EXCLUDED_ATC_PREFIXES.find((prefix) => atc.startsWith(prefix));
    if (excludedAtc) {
      return { excluded: true, reason: 'non_clinical', matched: `atc:${excludedAtc}` };
    }
    // Un código ATC clínico válido pesa más que las heurísticas de nombre.
    return { excluded: false };
  }

  const haystack = `${candidate.name} ${candidate.activeIngredient ?? ''}`;
  for (const { pattern, reason } of EXCLUDED_NAME_PATTERNS) {
    const match = haystack.match(pattern);
    if (match) {
      return { excluded: true, reason, matched: `name:${match[0]}` };
    }
  }

  return { excluded: false };
}

export function filterClinicalCandidates<T extends ProductCandidate>(
  candidates: T[],
): {
  included: T[];
  excluded: Array<{ candidate: T; result: Extract<ExclusionResult, { excluded: true }> }>;
} {
  const included: T[] = [];
  const excluded: Array<{ candidate: T; result: Extract<ExclusionResult, { excluded: true }> }> =
    [];
  for (const candidate of candidates) {
    const result = evaluateExclusion(candidate);
    if (result.excluded) {
      excluded.push({ candidate, result });
    } else {
      included.push(candidate);
    }
  }
  return { included, excluded };
}
