import type { SafetyWarning } from '../clinicalSafety/types.js';
import type { CdrCheckResult } from './types.js';

/** Convierte CDR EPIONE a alertas advisory EPIS2 (no bloquean persistencia). */
export function cdrResultsToSafetyWarnings(results: CdrCheckResult[]): SafetyWarning[] {
  return results.map((r) => ({
    ruleId: `cdr.${r.ruleId}`,
    severity: r.severity === 'block' ? 'critical' : 'warning',
    message: r.message,
    detail: `${r.clinicalRationale} (CDR demo — revisión humana obligatoria.)`,
  }));
}
