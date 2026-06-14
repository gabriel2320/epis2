import type { ClinicalCaseRecord } from '@epis2/contracts';

const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
const PHONE_RE = /\+?\d[\d\s()-]{7,}\d/;
const RUT_RE = /\b\d{1,2}\.?\d{3}\.?\d{3}-[\dkK]\b/;

export type ValidationIssue = {
  field: string;
  message: string;
};

export function validateClinicalCaseRecord(record: ClinicalCaseRecord): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!record.patient.isSynthetic) {
    issues.push({ field: 'patient.isSynthetic', message: 'debe ser true' });
  }

  if (!record.patient.displayName.includes('Sim') && !record.patient.displayName.includes('Demo')) {
    issues.push({
      field: 'patient.displayName',
      message: 'nombre debe indicar paciente ficticio (Sim/Demo)',
    });
  }

  if (!record.generation.requiresHumanReview) {
    issues.push({
      field: 'generation.requiresHumanReview',
      message: 'siempre true antes de promoción',
    });
  }

  if (record.tier !== 'L0_synthetic') {
    issues.push({ field: 'tier', message: 'solo L0_synthetic permitido' });
  }

  const blob = JSON.stringify(record);
  if (EMAIL_RE.test(blob)) {
    issues.push({ field: 'record', message: 'posible email (PHI) detectado' });
  }
  if (PHONE_RE.test(record.patient.displayName)) {
    issues.push({ field: 'patient.displayName', message: 'posible teléfono en nombre' });
  }
  if (RUT_RE.test(blob)) {
    issues.push({ field: 'record', message: 'posible RUT detectado' });
  }

  if (record.clinical.problems.length === 0) {
    issues.push({ field: 'clinical.problems', message: 'al menos un problema requerido' });
  }

  for (const problem of record.clinical.problems) {
    if (
      !problem.toLowerCase().includes('sintético') &&
      !problem.toLowerCase().includes('sintetico')
    ) {
      issues.push({
        field: 'clinical.problems',
        message: `problema sin marca sintético: ${problem.slice(0, 40)}`,
      });
    }
  }

  if (!record.epis2Mapping.summaryFields.clinicalAlerts?.includes('SINTÉTICO')) {
    issues.push({
      field: 'epis2Mapping.summaryFields.clinicalAlerts',
      message: 'debe incluir marca SINTÉTICO',
    });
  }

  return issues;
}

export function filterValidRecords(records: ClinicalCaseRecord[]): {
  valid: ClinicalCaseRecord[];
  invalid: { record: ClinicalCaseRecord; issues: ValidationIssue[] }[];
} {
  const valid: ClinicalCaseRecord[] = [];
  const invalid: { record: ClinicalCaseRecord; issues: ValidationIssue[] }[] = [];
  for (const record of records) {
    const issues = validateClinicalCaseRecord(record);
    if (issues.length === 0) valid.push(record);
    else invalid.push({ record, issues });
  }
  return { valid, invalid };
}
