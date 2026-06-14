/** MF-DI-04 / CE-6 — paneles y motivos determinísticos por foco crónico (sin IA). */

export type ChronicFocus = 'dm2' | 'hta';

export const DM2_LAB_CONTROL_PANEL = [
  'HbA1c',
  'Glucosa en ayunas',
  'Creatinina',
  'Perfil lipídico (LDL, HDL, triglicéridos)',
  'Microalbuminuria en orina',
].join('\n');

export const HTA_LAB_CONTROL_PANEL = [
  'Creatinina',
  'Electrolitos',
  'Perfil lipídico',
  'Orina completa',
].join('\n');

const DM2_PATTERN = /diabetes|dm2|\bdm\b|glicemia|hba1c|metformina/i;
const HTA_PATTERN = /hipertension|\bhta\b|losartan|enalapril/i;

function foldClinicalText(value: string): string {
  return value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

export function detectChronicFocus(
  summaryFields: Record<string, string>,
  hints?: { clinicalReasonHint?: string; studyHint?: string },
): ChronicFocus | null {
  const blob = foldClinicalText(
    [
      summaryFields.activeProblems,
      summaryFields.activeMedications,
      hints?.clinicalReasonHint,
      hints?.studyHint,
    ]
      .filter(Boolean)
      .join(' '),
  );
  if (DM2_PATTERN.test(blob)) return 'dm2';
  if (HTA_PATTERN.test(blob)) return 'hta';
  return null;
}

export function labPanelForChronicFocus(focus: ChronicFocus): string {
  return focus === 'dm2' ? DM2_LAB_CONTROL_PANEL : HTA_LAB_CONTROL_PANEL;
}

export function evolutionSubjectiveForControl(
  focus: ChronicFocus | null,
  clinicalReasonHint?: string,
): string | undefined {
  const hint = clinicalReasonHint?.trim();
  if (hint) {
    if (/^control/i.test(hint)) return hint.endsWith('.') ? hint : `${hint}.`;
    return hint;
  }
  if (focus === 'dm2') return 'Control ambulatorio diabetes mellitus tipo 2.';
  if (focus === 'hta') return 'Control ambulatorio hipertensión arterial.';
  return undefined;
}

export type ParsedMedicationLine = {
  name: string;
  dose?: string;
  frequency?: string;
};

/** Primera línea de medicación activa del resumen demo. */
export function parseFirstActiveMedicationLine(
  activeMedications: string,
): ParsedMedicationLine | null {
  const raw = activeMedications.split('\n')[0]?.split('·')[0]?.trim();
  if (!raw) return null;

  const detailed = raw.match(/^(.+?)\s+(\d[\d.,]*\s*(?:mg|mcg|g|UI|%)(?:\s*\/\s*\w+)?)\s*(.*)$/i);
  if (detailed) {
    const result: ParsedMedicationLine = {
      name: detailed[1]!.trim(),
      dose: detailed[2]!.trim(),
    };
    const tail = detailed[3]?.trim();
    if (tail) result.frequency = tail;
    return result;
  }

  return { name: raw.replace(/\s*\(demo\)\s*$/i, '').trim() };
}

export function formatIsoDateLocal(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
