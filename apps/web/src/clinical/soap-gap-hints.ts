export type SoapGapHint = {
  fieldId: string;
  label: string;
};

const FIELD_LABELS = {
  encounterDate: 'fecha del encuentro',
  subjective: 'subjetivo',
  assessment: 'análisis',
  plan: 'plan',
} as const;

const EVOLUTION_REQUIRED: (keyof typeof FIELD_LABELS)[] = [
  'encounterDate',
  'subjective',
  'assessment',
  'plan',
];

/** Huecos SOAP detectables sin llamar a IA (LAYOUT-03). */
export function computeSoapGapHints(
  blueprintId: string,
  values: Record<string, string>,
): SoapGapHint[] {
  if (blueprintId !== 'evolution_note') return [];

  const hints: SoapGapHint[] = [];
  for (const fieldId of EVOLUTION_REQUIRED) {
    if (!values[fieldId]?.trim()) {
      hints.push({ fieldId, label: `Completar ${FIELD_LABELS[fieldId]}` });
    }
  }
  return hints;
}
