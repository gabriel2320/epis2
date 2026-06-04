import type { ClinicalSafetyInput, SafetyAllergy, SafetyLab, SafetyMedication } from './types.js';

function parseMedicationLines(text: string): SafetyMedication[] {
  if (!text.trim()) return [];
  return text
    .split(/\n|·|;/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((line) => ({ name: line.replace(/\s*\(demo\)\s*$/i, '').trim(), status: 'active' as const }));
}

function parseLabLines(text: string): SafetyLab[] {
  if (!text.trim()) return [];
  const parts = text.split(/·|;/).map((s) => s.trim()).filter(Boolean);
  return parts.map((part) => {
    const match = /^(.+?)\s+([\d,.]+)\s*(.*)$/.exec(part);
    if (match) {
      const lab: SafetyLab = { name: match[1]!.trim(), value: match[2]!.trim() };
      const unit = match[3]?.trim();
      if (unit) lab.unit = unit;
      return lab;
    }
    return { name: part, value: '' };
  });
}

function extractAllergies(
  summaryFields: Record<string, string>,
  problems: { description: string }[],
): SafetyAllergy[] {
  const found: SafetyAllergy[] = [];
  const blob = [summaryFields.clinicalAlerts, summaryFields.activeProblems, ...problems.map((p) => p.description)]
    .filter(Boolean)
    .join(' ');
  if (/penicilina|beta\s*-?\s*lact/i.test(blob)) {
    found.push({ substance: 'Penicilina', severity: 'moderate' });
  }
  return found;
}

/** Construye entrada CDS demo desde contexto clínico sintético (sin PHI). */
export function buildClinicalSafetyInputFromSummary(
  summaryFields: Record<string, string>,
  options?: {
    sex?: string;
    problems?: { description: string }[];
  },
): ClinicalSafetyInput {
  const problems = options?.problems ?? [];
  const input: ClinicalSafetyInput = {
    allergies: extractAllergies(summaryFields, problems),
    medications: parseMedicationLines(summaryFields.activeMedications ?? ''),
    labs: parseLabLines(summaryFields.relevantLabs ?? ''),
  };
  if (options?.sex !== undefined || problems.length > 0) {
    input.patient = {
      ...(options?.sex !== undefined ? { sex: options.sex } : {}),
      activeProblems: problems.map((p) => p.description),
    };
  }
  return input;
}
