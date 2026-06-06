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
  demoTasks: [
    { id: 'pharm-task-validation', label: 'Validación farmacéutica', commandSample: 'validacion farmaceutica' },
  ],
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

    expect(screen.getByText(copy.inpatient.reconciliation)).toBeInTheDocument();
    expect(screen.getByText(/Warfarina/)).toBeInTheDocument();

    await user.click(screen.getByTestId(`epis2-pharmacy-reconcile-${PATIENT_ID}`));
    expect(onOpenReconciliation).toHaveBeenCalledWith(PATIENT_ID);
  });
});
