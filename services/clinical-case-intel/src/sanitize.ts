import type { TeachingCasePayload } from './sources/meded.js';

const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
const PHONE_RE = /\+?\d[\d\s()-]{7,}\d/;
const RUT_RE = /\b\d{1,2}\.?\d{3}\.?\d{3}-[\dkK]\b/;

export type SanitizeIssue = { field: string; message: string };

export function sanitizeTeachingCasePayload(payload: TeachingCasePayload): SanitizeIssue[] {
  const issues: SanitizeIssue[] = [];
  const blob = JSON.stringify(payload);

  if (EMAIL_RE.test(blob)) {
    issues.push({ field: 'payload', message: 'posible email (PHI) en TeachingCase' });
  }
  if (RUT_RE.test(blob)) {
    issues.push({ field: 'payload', message: 'posible RUT en TeachingCase' });
  }
  if (PHONE_RE.test(payload.presentation)) {
    issues.push({ field: 'presentation', message: 'posible teléfono en presentación' });
  }

  if (!payload.id.startsWith('meded-') && !payload.id.startsWith('pmc-')) {
    issues.push({
      field: 'id',
      message: 'id externo debe usar prefijo meded- o pmc- (trazabilidad sintética)',
    });
  }

  if (!payload.license.toLowerCase().includes('sintético') && !payload.license.includes('CC')) {
    issues.push({
      field: 'license',
      message: 'license debe indicar CC* o rewrite sintético',
    });
  }

  return issues;
}

export function assertTeachingCaseSafe(payload: TeachingCasePayload): void {
  const issues = sanitizeTeachingCasePayload(payload);
  if (issues.length > 0) {
    throw new Error(issues.map((i) => `${i.field}: ${i.message}`).join('; '));
  }
}
