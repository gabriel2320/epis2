/** MF-DI-07 — señales determinísticas de comorbilidad desde resumen clínico (sin IA). */

export type ClinicalComorbiditySignals = {
  hasDm2: boolean;
  hasCkd: boolean;
  onInsulin: boolean;
};

const DM2_PATTERN = /diabetes|dm2|\bdm\b|glicemia|hba1c|metformina/i;
const CKD_PATTERN = /erc|enfermedad renal|insuficiencia renal|nefropat|filtrado glomerular|fgb/i;
const INSULIN_PATTERN = /insulina|glargina|lispro|nph|detemir|degludec|aspart/i;

function foldClinicalText(value: string): string {
  return value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

export function detectClinicalComorbiditySignals(
  summaryFields: Record<string, string>,
): ClinicalComorbiditySignals {
  const blob = foldClinicalText(
    [
      summaryFields.activeProblems,
      summaryFields.activeMedications,
      summaryFields.relevantLabs,
      summaryFields.clinicalAlerts,
    ]
      .filter(Boolean)
      .join(' '),
  );
  return {
    hasDm2: DM2_PATTERN.test(blob),
    hasCkd: CKD_PATTERN.test(blob),
    onInsulin: INSULIN_PATTERN.test(blob),
  };
}
