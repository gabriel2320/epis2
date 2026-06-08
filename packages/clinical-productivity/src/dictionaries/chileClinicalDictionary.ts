export type ChileClinicalTermCategory =
  | 'abbreviation'
  | 'medication'
  | 'lab'
  | 'service'
  | 'diagnosis'
  | 'unit'
  | 'icu'
  | 'aps'
  | 'or'
  | 'iaas';

export type ChileClinicalTerm = {
  id: string;
  term: string;
  formal?: string;
  category: ChileClinicalTermCategory;
  expansions?: readonly string[];
};

const TERMS: readonly ChileClinicalTerm[] = [
  { id: 'abbr-hgt', term: 'HGT', formal: 'hemoglucotest', category: 'abbreviation' },
  { id: 'abbr-ta', term: 'TA', formal: 'tensión arterial', category: 'abbreviation' },
  { id: 'abbr-fc', term: 'FC', formal: 'frecuencia cardíaca', category: 'abbreviation' },
  { id: 'abbr-fr', term: 'FR', formal: 'frecuencia respiratoria', category: 'abbreviation' },
  { id: 'med-ceftriaxona', term: 'ceftriaxona', category: 'medication', expansions: ['Ceftriaxona 1 g IV'] },
  { id: 'med-paracetamol', term: 'paracetamol', category: 'medication' },
  { id: 'lab-hemograma', term: 'hemograma', category: 'lab' },
  { id: 'lab-pcr', term: 'PCR', formal: 'proteína C reactiva', category: 'lab' },
  { id: 'lab-creatinina', term: 'creatinina', category: 'lab' },
  { id: 'svc-urgencia', term: 'urgencia', category: 'service' },
  { id: 'svc-uci', term: 'UCI', formal: 'unidad de cuidados intensivos', category: 'icu' },
  { id: 'dx-neumonia', term: 'neumonía', category: 'diagnosis' },
  { id: 'dx-sepsis', term: 'sepsis', category: 'diagnosis' },
  { id: 'unit-mg', term: 'mg', category: 'unit' },
  { id: 'unit-ml', term: 'mL', category: 'unit' },
  { id: 'aps-control', term: 'control crónico', category: 'aps' },
  { id: 'or-preanestesia', term: 'preanestesia', category: 'or' },
  { id: 'iaas-bac', term: 'BAC', formal: 'bacteriemia asociada a catéter', category: 'iaas' },
];

export const CHILE_CLINICAL_DICTIONARY: readonly ChileClinicalTerm[] = TERMS;

export function findClinicalTerms(query: string, limit = 12): ChileClinicalTerm[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...TERMS].slice(0, limit);
  return TERMS.filter(
    (t) =>
      t.term.toLowerCase().includes(q) ||
      t.formal?.toLowerCase().includes(q) ||
      t.expansions?.some((e) => e.toLowerCase().includes(q)),
  ).slice(0, limit);
}

export function isWhitelistedClinicalTerm(token: string): boolean {
  const normalized = token.trim().toLowerCase();
  return TERMS.some(
    (t) =>
      t.term.toLowerCase() === normalized ||
      t.formal?.toLowerCase() === normalized,
  );
}

export function suggestFormalForm(term: string): string | undefined {
  const hit = TERMS.find((t) => t.term.toLowerCase() === term.trim().toLowerCase());
  return hit?.formal ?? hit?.expansions?.[0];
}
