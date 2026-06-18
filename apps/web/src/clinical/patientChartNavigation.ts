import type { ClinicalNavigateOptions } from '../routes/clinicalNavigate.js';

/** @deprecated Import from @epis2/epis2-ui/clinical-chart-tabs — MF-PONY-07 */
export {
  LEGACY_PATIENT_CHART_TABS as PATIENT_CHART_TABS,
  resolveLegacyPatientChartTabId as resolvePatientChartTabId,
  type LegacyPatientChartTabId as PatientChartTabId,
} from '@epis2/epis2-ui/clinical-chart-tabs';

import {
  legacyPatientChartTabTarget as legacyTarget,
  type LegacyPatientChartTabId,
} from '@epis2/epis2-ui/clinical-chart-tabs';

/** Adapter web — mantiene firma ClinicalNavigateOptions. */
export function patientChartTabTarget(
  tabId: LegacyPatientChartTabId,
  patientId?: string,
): ClinicalNavigateOptions {
  return legacyTarget(tabId, patientId) as ClinicalNavigateOptions;
}
