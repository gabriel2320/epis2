/**
 * @vitest-environment jsdom
 */
import { copy } from '@epis2/design-system';
import { Epis2ThemeProvider } from '@epis2/epis2-ui';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ResultsInboxPage } from './ResultsInboxPage.js';

const patientId = 'a0000001-0000-4000-8000-000000000001';

const { fetchPatientResultsInbox, acknowledgeCriticalResult } = vi.hoisted(() => ({
  fetchPatientResultsInbox: vi.fn(),
  acknowledgeCriticalResult: vi.fn(),
}));

vi.mock('@tanstack/react-router', () => ({
  useSearch: () => ({ patientId }),
  useNavigate: () => vi.fn(),
  Link: ({ children }: { children?: unknown }) => <span>{children as string}</span>,
}));

vi.mock('../clinical/ActivePatientContext.js', () => ({
  useActivePatient: () => ({
    patient: { id: patientId, displayName: 'Paciente Demo', demoCaseCode: 'DEMO-001' },
    setPatient: vi.fn(),
  }),
}));

vi.mock('../api/clinicalApi.js', () => ({
  fetchPatientResultsInbox,
}));

vi.mock('../api/dashboardApi.js', () => ({
  acknowledgeCriticalResult,
}));

vi.mock('../components/ResultsInboxTrends.js', () => ({
  ResultsInboxTrends: () => null,
}));

vi.mock('../components/LabObservationsGrid.js', () => ({
  LabObservationsGrid: ({
    rows,
    'data-testid': testId,
  }: {
    rows: { label: string }[];
    'data-testid'?: string;
  }) => (
    <div data-testid={testId}>
      {rows.map((row) => (
        <span key={row.label}>{row.label}</span>
      ))}
    </div>
  ),
}));

vi.mock('../components/grids/ResultsInboxCriticalGrid.js', () => ({
  ResultsInboxCriticalGrid: ({
    rows,
    ackingId,
    onAcknowledge,
  }: {
    rows: Array<{ id: string; acknowledged?: boolean }>;
    ackingId: string | null;
    onAcknowledge: (id: string) => void;
  }) => (
    <div data-testid="epis2-results-critical-grid">
      {rows.map((row) =>
        row.acknowledged ? null : (
          <button
            key={row.id}
            type="button"
            disabled={ackingId === row.id}
            onClick={() => onAcknowledge(row.id)}
            data-testid={`epis2-results-ack-${row.id}`}
          >
            Acusar
          </button>
        ),
      )}
    </div>
  ),
}));

afterEach(() => {
  cleanup();
  fetchPatientResultsInbox.mockReset();
  acknowledgeCriticalResult.mockReset();
});

describe('ResultsInboxPage', () => {
  it('muestra observaciones y críticos desde la API agregada', async () => {
    fetchPatientResultsInbox.mockResolvedValue({
      patientId,
      readOnly: true,
      demoCaseCode: 'DEMO-001',
      observations: [
        {
          id: 'o1',
          label: 'Creatinina',
          valueText: '0.9 mg/dL (demo)',
          observedAt: '2026-01-01T12:00:00.000Z',
        },
      ],
      criticalResults: [],
      pendingOrders: [],
    });

    render(
      <Epis2ThemeProvider>
        <ResultsInboxPage />
      </Epis2ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('epis2-results-inbox')).toBeTruthy();
    });
    expect(screen.getByText(copy.results.inboxTitle)).toBeTruthy();
    expect(screen.getByTestId('epis2-results-observations-grid')).toBeTruthy();
    expect(screen.getByText('Creatinina')).toBeTruthy();
  });

  it('acuse crítico pendiente desde la bandeja', async () => {
    const user = userEvent.setup();
    fetchPatientResultsInbox
      .mockResolvedValueOnce({
        patientId,
        readOnly: true,
        demoCaseCode: 'DEMO-005',
        observations: [],
        criticalResults: [
          {
            id: 'crit-1',
            label: 'INR',
            valueText: '3.8 (demo)',
            severity: 'critical',
            observedAt: '2026-01-01T12:00:00.000Z',
            acknowledged: false,
          },
        ],
        pendingOrders: [],
      })
      .mockResolvedValueOnce({
        patientId,
        readOnly: true,
        demoCaseCode: 'DEMO-005',
        observations: [],
        criticalResults: [
          {
            id: 'crit-1',
            label: 'INR',
            valueText: '3.8 (demo)',
            severity: 'critical',
            observedAt: '2026-01-01T12:00:00.000Z',
            acknowledged: true,
            acknowledgedAt: '2026-01-01T13:00:00.000Z',
          },
        ],
        pendingOrders: [],
      });
    acknowledgeCriticalResult.mockResolvedValue({
      id: 'crit-1',
      acknowledgedAt: '2026-01-01T13:00:00.000Z',
      readOnly: true,
    });

    render(
      <Epis2ThemeProvider>
        <ResultsInboxPage />
      </Epis2ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('epis2-results-ack-crit-1')).toBeTruthy();
    });
    await user.click(screen.getByTestId('epis2-results-ack-crit-1'));
    await waitFor(() => {
      expect(acknowledgeCriticalResult).toHaveBeenCalledWith('crit-1');
    });
  });
});
