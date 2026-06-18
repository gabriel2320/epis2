import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { REPO_ROOT } from './lib/paths.mjs';

const COMPONENTS_ROOT = 'apps/web/src/components';

/**
 * Raíz de components/ congelada (2026-06-09, 57 archivos).
 * Componentes nuevos van en subcarpetas por dominio (command-center/, dashboard-md3/, rad/, …).
 * Al mover un archivo de esta lista a su dominio, retirarlo de aquí — la lista solo decrece.
 */
const FROZEN_ALLOWLIST = new Set([
  'ApsDashboardTab.tsx',
  'ClinicalAlertsPanel.test.tsx',
  'ClinicalAlertsPanel.tsx',
  'ClinicalPageNav.tsx',
  'ClinicalShellCommandPalette.test.tsx',
  'ClinicalShellCommandPalette.tsx',
  'CommandCenterContextLine.tsx',
  'CommandCenterRecentActivity.tsx',
  'CommandConfirmationDialog.tsx',
  'DashboardWorklists.tsx',
  'DemoNarrativeWalkthroughPanel.tsx',
  'DocumentSearchPanel.test.tsx',
  'DocumentSearchPanel.tsx',
  'EmergencyDashboardTab.tsx',
  'EpisClinicalContextDocuments.test.tsx',
  'EpisClinicalContextDocuments.tsx',
  'EpisClinicalContextPane.test.tsx',
  'EpisClinicalContextPane.tsx',
  'EpisClinicalPeriodSummary.tsx',
  'EpisClinicalSoapHints.tsx',
  'ErrorState.tsx',
  'IcuDashboardTab.tsx',
  'LabObservationsGrid.tsx',
  'LongitudinalNavTree.tsx',
  'NursingDashboardTab.test.tsx',
  'NursingDashboardTab.tsx',
  'OfflineStatusBanner.test.tsx',
  'OfflineStatusBanner.tsx',
  'OrDashboardTab.tsx',
  'PatientClinicalAiPanel.tsx',
  'PatientClinicalCharts.tsx',
  'PatientClinicalSummaryPanel.tsx',
  'PatientDashboardTab.tsx',
  'PatientListGrid.tsx',
  'PatientLongitudinalPanel.test.tsx',
  'PatientLongitudinalPanel.tsx',
  'PatientRecentActivityBlock.test.tsx',
  'PatientRecentActivityBlock.tsx',
  'PatientSearchAutocomplete.test.tsx',
  'PatientSearchAutocomplete.tsx',
  'PatientSummaryAntecedentsBlock.test.tsx',
  'PatientSummaryAntecedentsBlock.tsx',
  'PatientSummaryDocumentsBlock.test.tsx',
  'PatientSummaryDocumentsBlock.tsx',
  'PatientWorkspaceCommandPanel.tsx',
  'PharmacyDashboardTab.test.tsx',
  'PharmacyDashboardTab.tsx',
  'QualityDashboardTab.test.tsx',
  'QualityDashboardTab.tsx',
  'ReceptionDashboardTab.tsx',
  'ResultsInboxTrends.tsx',
  'ServiceDashboardCharts.tsx',
  'ServiceDashboardTab.test.tsx',
  'ServiceDashboardTab.tsx',
  'SpecialtyDashboardTab.tsx',
  'WorklistDraftGrid.tsx',
]);

export async function validate() {
  const entries = readdirSync(join(REPO_ROOT, COMPONENTS_ROOT), { withFileTypes: true });
  const details = entries
    .filter((e) => e.isFile() && !FROZEN_ALLOWLIST.has(e.name))
    .map(
      (e) =>
        `${COMPONENTS_ROOT}/${e.name} → archivo suelto nuevo: crearlo en una subcarpeta por dominio`,
    );

  return {
    ok: details.length === 0,
    message:
      details.length === 0
        ? 'Raíz de components/ congelada — sin archivos sueltos nuevos'
        : 'La raíz de components/ solo acepta movimientos hacia subcarpetas (allowlist congelada)',
    details,
  };
}
