import type { CicaClinicalListItem } from '@epis2/epis2-ui';
import type { PatientListRow } from '../api/clinicalApi.js';
import { getPrimaryNarrativeForDemoCode } from '../clinical/demoNarrativePresentation.js';
import { getDemoShiftCensusPresentation } from '../clinical/demoShiftCensusPresentation.js';

function patientListRowMeta(row: PatientListRow): string {
  const parts: string[] = [];
  const narrative = row.demoCaseCode ? getPrimaryNarrativeForDemoCode(row.demoCaseCode) : undefined;
  const census = row.demoCaseCode ? getDemoShiftCensusPresentation(row.demoCaseCode) : undefined;

  if (narrative?.settingEs) parts.push(narrative.settingEs);
  if (row.demoCaseCode) parts.push(row.demoCaseCode);
  if (census?.pendingLabelEs) parts.push(census.pendingLabelEs);

  return parts.join(' · ') || row.demoLabel || '—';
}

/** Mapea filas API → items CICA sin importar widgets legacy de búsqueda. */
export function mapPatientRowsToCicaListItems(rows: PatientListRow[]): CicaClinicalListItem[] {
  return rows.map((row) => ({
    id: row.id,
    primaryLabel: row.displayName,
    secondaryLabel: patientListRowMeta(row),
  }));
}
