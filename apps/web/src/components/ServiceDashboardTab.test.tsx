/**
 * @vitest-environment jsdom
 */
import type { ServiceDashboardResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import { Epis2ThemeProvider } from '@epis2/epis2-ui';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ServiceDashboardTab } from './ServiceDashboardTab.js';

const ACTIVE_PATIENT_ID = 'a0000001-0000-4000-8000-000000000003';
const ADMISSION_ID = 'f0000003-0000-4000-8000-000000000001';
const BED_101A = 'f0000002-0000-4000-8000-000000000001';
const BED_102A = 'f0000002-0000-4000-8000-000000000003';
const CRITICAL_ID = 'f0000004-0000-4000-8000-000000000001';

const serviceBoard: ServiceDashboardResponse = {
  readOnly: true,
  unitCode: 'CIRUGIA-DEMO',
  unitName: 'Cirugía demo',
  census: [
    {
      bedId: BED_101A,
      bedLabel: '101A',
      status: 'occupied',
      admissionId: ADMISSION_ID,
      patientId: 'a0000001-0000-4000-8000-000000000004',
      patientDisplayName: 'Paciente DEMO-004',
      demoCaseCode: 'DEMO-004',
    },
    {
      bedId: BED_102A,
      bedLabel: '102A',
      status: 'available',
    },
  ],
  activeOrders: [
    {
      id: 'f0000005-0000-4000-8000-000000000001',
      patientId: 'a0000001-0000-4000-8000-000000000005',
      patientDisplayName: 'Paciente DEMO-005',
      orderType: 'lab',
      title: 'Hemograma',
      priority: 'routine',
    },
  ],
  unacknowledgedCriticals: [
    {
      id: CRITICAL_ID,
      patientId: 'a0000001-0000-4000-8000-000000000005',
      patientDisplayName: 'Paciente DEMO-005',
      label: 'INR',
      valueText: '4.2',
      severity: 'critical',
      observedAt: new Date().toISOString(),
    },
  ],
  probableDischarges: [],
  pendingWorkItems: [],
};

const {
  acknowledgeCriticalResult,
  createInpatientAdmission,
  transferInpatientAdmission,
  dischargeInpatientAdmission,
} = vi.hoisted(() => ({
  acknowledgeCriticalResult: vi.fn(),
  createInpatientAdmission: vi.fn(),
  transferInpatientAdmission: vi.fn(),
  dischargeInpatientAdmission: vi.fn(),
}));

vi.mock('../api/dashboardApi.js', () => ({
  acknowledgeCriticalResult,
  createInpatientAdmission,
  transferInpatientAdmission,
  dischargeInpatientAdmission,
}));

vi.mock('./ServiceDashboardCharts.js', () => ({
  ServiceDashboardCharts: () => null,
}));

vi.mock('./grids/DashboardHomogeneousGrid.js', () => ({
  DashboardHomogeneousGrid: ({
    rows,
    extraBulkActions,
    'data-testid': testId,
  }: {
    rows: Record<string, unknown>[];
    extraBulkActions?: (ids: readonly string[]) => { id: string; label: string; onClick: () => void }[];
    'data-testid'?: string;
  }) => (
    <div data-testid={testId}>
      {rows.map((row) => (
        <div key={String(row.id)}>
          <span>{String(row.bedLabel ?? row.title ?? row.statusLabel ?? row.label ?? '')}</span>
        </div>
      ))}
      {extraBulkActions
        ? rows.map((row) => (
            <div key={`bulk-${String(row.id)}`}>
              {extraBulkActions([String(row.id)]).map((action) => (
                <button
                  key={action.id}
                  type="button"
                  data-testid={
                    action.id === 'ack'
                      ? `epis2-ack-critical-${String(row.id)}`
                      : action.id === 'transfer'
                        ? `epis2-inpatient-transfer-${String(row.admissionId ?? row.id)}`
                        : action.id === 'discharge'
                          ? `epis2-discharge-${String(row.admissionId ?? row.id)}`
                          : `epis2-bulk-${action.id}-${String(row.id)}`
                  }
                  onClick={() => action.onClick()}
                >
                  {action.label}
                </button>
              ))}
            </div>
          ))
        : null}
    </div>
  ),
}));

vi.mock('./rad/EpisRadDashboardTabShell.js', () => ({
  EpisRadDashboardTabShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

afterEach(() => cleanup());

function renderTab(overrides?: {
  activePatientId?: string;
  onOpenEpicrisis?: (patientId: string) => void;
  onReload?: () => void;
}) {
  const onReload = overrides?.onReload ?? vi.fn();
  const onOpenEpicrisis = overrides?.onOpenEpicrisis ?? vi.fn();
  render(
    <Epis2ThemeProvider>
      <ServiceDashboardTab
        data={serviceBoard}
        activePatientId={overrides?.activePatientId}
        onOpenPatient={vi.fn()}
        onOpenEpicrisis={onOpenEpicrisis}
        onReload={onReload}
      />
    </Epis2ThemeProvider>,
  );
  return { onReload, onOpenEpicrisis };
}

describe('ServiceDashboardTab', () => {
  it('muestra censo, órdenes activas y acusa resultado crítico', async () => {
    const user = userEvent.setup();
    acknowledgeCriticalResult.mockResolvedValue({
      id: CRITICAL_ID,
      acknowledgedAt: new Date().toISOString(),
      readOnly: true,
    });
    const { onReload } = renderTab();

    expect(screen.getByTestId('epis2-dashboard-service')).toBeInTheDocument();
    expect(screen.getByText(/101A/)).toBeInTheDocument();
    expect(screen.getByText(/Hemograma/)).toBeInTheDocument();
    expect(screen.getByText(/INR/)).toBeInTheDocument();

    await user.click(screen.getByTestId(`epis2-ack-critical-${CRITICAL_ID}`));

    await waitFor(() => {
      expect(acknowledgeCriticalResult).toHaveBeenCalledWith(CRITICAL_ID);
      expect(onReload).toHaveBeenCalled();
    });
  });

  it('flujo ingreso, traslado y alta operativa con paciente activo', async () => {
    const user = userEvent.setup();
    createInpatientAdmission.mockResolvedValue({
      admission: { id: 'f0000003-0000-4000-8000-000000000099', bedLabel: '102A' },
    });
    transferInpatientAdmission.mockResolvedValue({ toBedLabel: '102A' });
    dischargeInpatientAdmission.mockResolvedValue({
      patientId: 'a0000001-0000-4000-8000-000000000004',
      epicrisisRoute: '/espacio/epicrisis',
    });

    const onOpenEpicrisis = vi.fn();
    const { onReload } = renderTab({
      activePatientId: ACTIVE_PATIENT_ID,
      onOpenEpicrisis,
    });

    const admitSelect = screen.getByTestId('epis2-inpatient-admit').querySelector('[role="combobox"]');
    expect(admitSelect).toBeTruthy();
    await user.click(admitSelect!);
    await user.click(await screen.findByRole('option', { name: '102A' }));
    await user.click(screen.getByTestId('epis2-inpatient-admit-submit'));

    await waitFor(() => {
      expect(createInpatientAdmission).toHaveBeenCalledWith({
        patientId: ACTIVE_PATIENT_ID,
        bedId: BED_102A,
        unitCode: 'CIRUGIA-DEMO',
      });
      expect(screen.getByText(copy.inpatient.admitSuccess)).toBeInTheDocument();
    });

    const transferCombobox = screen.getByTestId(`epis2-inpatient-transfer-${ADMISSION_ID}`);
    await user.click(transferCombobox);

    await waitFor(() => {
      expect(transferInpatientAdmission).toHaveBeenCalledWith(ADMISSION_ID, BED_102A);
      expect(screen.getByText(copy.inpatient.transferSuccess)).toBeInTheDocument();
    });

    await user.click(screen.getByTestId(`epis2-discharge-${ADMISSION_ID}`));

    await waitFor(() => {
      expect(dischargeInpatientAdmission).toHaveBeenCalledWith(ADMISSION_ID);
      expect(screen.getByText(copy.inpatient.dischargeSuccess)).toBeInTheDocument();
      expect(onOpenEpicrisis).toHaveBeenCalledWith('a0000001-0000-4000-8000-000000000004');
      expect(onReload).toHaveBeenCalled();
    });
  });
});
