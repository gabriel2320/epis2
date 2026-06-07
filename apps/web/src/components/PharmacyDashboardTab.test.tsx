/**
 * @vitest-environment jsdom
 */
import type { PharmacyDashboardResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import { Epis2ThemeProvider } from '@epis2/epis2-ui';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PharmacyDashboardTab } from './PharmacyDashboardTab.js';

const VALIDATION_ID = 'd0000002-0000-4000-8000-000000000002';
const PATIENT_ID = 'a0000001-0000-4000-8000-000000000005';

const pharmacyBoard: PharmacyDashboardResponse = {
  readOnly: true,
  roleView: 'pharmacist',
  idcPanels: [{ idc: 161, label: 'Compatibilidad Y-Site', status: 'active' }],
  pendingValidations: [
    {
      id: VALIDATION_ID,
      patientId: PATIENT_ID,
      patientDisplayName: 'Paciente DEMO-005',
      title: 'Validación warfarina',
      status: 'ready_for_review',
      updatedAt: new Date().toISOString(),
    },
  ],
  reconciliationCandidates: [
    {
      patientId: PATIENT_ID,
      patientDisplayName: 'Paciente DEMO-005',
      activeMedicationCount: 3,
      medications: ['Warfarina', 'Omeprazol', 'Paracetamol'],
      reason: 'Conciliación medicamentosa pendiente (demo)',
    },
  ],
  ySiteChecks: [{ drugA: 'Midazolam', drugB: 'Fentanilo', compatible: true, note: 'Compatible' }],
  renalDoseAdjustments: [
    { patientDisplayName: 'Paciente DEMO-005', medication: 'Gabapentina', gfrMlMin: 38, recommendedDose: '300 mg' },
  ],
  tdmMonitoring: [
    { patientDisplayName: 'Paciente DEMO-005', drug: 'Vancomicina', levelMcgMl: 18, targetRange: '15–20' },
  ],
  ramReports: [
    { patientDisplayName: 'Paciente DEMO-005', suspectDrug: 'Amoxicilina', reactionType: 'Urticaria', severity: 'moderate' },
  ],
  dispensingQueue: [
    { prescriptionId: 'RX-1', patientDisplayName: 'Paciente DEMO-005', medication: 'Losartán', status: 'pending' },
  ],
  crashCartInventory: [{ cartId: 'CP-1', location: 'UCI', expiryAlerts: 0, lastCheck: '2026-06-07' }],
  controlledSubstances: [{ medication: 'Fentanilo', balanceUnits: 12, discrepancyFlag: false }],
  drugReturns: [
    { patientDisplayName: 'Paciente DEMO-005', medication: 'Morfina', quantity: 2, reason: 'Alta' },
  ],
  stockoutAlerts: [{ medication: 'Meropenem', daysUntilStockout: 3 }],
  demoTasks: [
    { id: 'pharm-task-validation', label: 'Validación farmacéutica', commandSample: 'validacion farmaceutica' },
  ],
  metrics: {
    activePharmacyModules: 10,
    pendingValidationsCount: 1,
    reconciliationCandidatesCount: 1,
  },
};

afterEach(() => cleanup());

describe('PharmacyDashboardTab', () => {
  it('muestra validaciones pendientes y abre borrador', async () => {
    const user = userEvent.setup();
    const onOpenDraft = vi.fn();

    render(
      <Epis2ThemeProvider>
        <PharmacyDashboardTab
          data={pharmacyBoard}
          onOpenPatient={vi.fn()}
          onOpenDraft={onOpenDraft}
          onOpenReconciliation={vi.fn()}
        />
      </Epis2ThemeProvider>,
    );

    expect(screen.getByTestId('epis2-dashboard-pharmacy')).toBeInTheDocument();
    expect(screen.getByText(/Validación warfarina/)).toBeInTheDocument();

    await user.click(screen.getByTestId(`epis2-pharmacy-review-${VALIDATION_ID}`));
    expect(onOpenDraft).toHaveBeenCalledWith(VALIDATION_ID);
  });

  it('muestra conciliación y abre formulario', async () => {
    const user = userEvent.setup();
    const onOpenReconciliation = vi.fn();

    render(
      <Epis2ThemeProvider>
        <PharmacyDashboardTab
          data={pharmacyBoard}
          onOpenPatient={vi.fn()}
          onOpenDraft={vi.fn()}
          onOpenReconciliation={onOpenReconciliation}
        />
      </Epis2ThemeProvider>,
    );

    expect(screen.getByText(copy.pharmacy.reconciliationTitle)).toBeInTheDocument();
    expect(screen.getByText(/Warfarina/)).toBeInTheDocument();

    await user.click(screen.getByTestId(`epis2-pharmacy-reconcile-${PATIENT_ID}`));
    expect(onOpenReconciliation).toHaveBeenCalledWith(PATIENT_ID);
  });
});
