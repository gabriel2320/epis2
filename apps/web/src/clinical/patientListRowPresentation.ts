import type { PatientListRow } from '../api/clinicalApi.js';
import type { EpisClinicalListItem } from '@epis2/epis2-ui';
import { getPrimaryNarrativeForDemoCode } from './demoNarrativePresentation.js';
import { getDemoShiftCensusPresentation } from './demoShiftCensusPresentation.js';

/** Meta secundaria compartida — búsqueda legacy y listas CICA (MF-PONY-05). */
export function patientListRowMeta(row: PatientListRow): string {
  const parts: string[] = [];
  const narrative = row.demoCaseCode ? getPrimaryNarrativeForDemoCode(row.demoCaseCode) : undefined;
  const census = row.demoCaseCode ? getDemoShiftCensusPresentation(row.demoCaseCode) : undefined;

  if (narrative?.settingEs) parts.push(narrative.settingEs);
  if (row.demoCaseCode) parts.push(row.demoCaseCode);
  if (census?.pendingLabelEs) parts.push(census.pendingLabelEs);

  return parts.join(' · ') || row.demoLabel || '—';
}

export function mapPatientRowsToClinicalListItems(rows: PatientListRow[]): EpisClinicalListItem[] {
  return rows.map((row) => ({
    id: row.id,
    primaryLabel: row.displayName,
    secondaryLabel: patientListRowMeta(row),
  }));
}
