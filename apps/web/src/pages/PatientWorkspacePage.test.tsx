/**
 * @vitest-environment jsdom
 */
import { copy } from '@epis2/design-system';
import { Epis2ThemeProvider } from '../Epis2ThemeProvider.js';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ActivePatientProvider } from '../clinical/ActivePatientContext.js';
import { PatientWorkspacePage } from './PatientWorkspacePage.js';

const patientId = '00000000-0000-4000-8000-000000000005';

const { fetchPatientDetail, fetchPatientClinicalAlerts, listDrafts } = vi.hoisted(() => ({
  fetchPatientDetail: vi.fn(),
  fetchPatientClinicalAlerts: vi.fn(),
  listDrafts: vi.fn(),
}));

vi.mock('@tanstack/react-router', () => ({
  useSearch: () => ({ patientId }),
  Link: ({ children }: { children?: unknown }) => <span>{children as string}</span>,
}));

vi.mock('../routes/clinicalNavigate.js', () => ({
  useClinicalNavigate: () => vi.fn(),
}));

vi.mock('../api/clinicalApi.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../api/clinicalApi.js')>();
  return {
    ...actual,
    fetchPatientDetail,
    fetchPatientClinicalAlerts,
    listDrafts,
    listPatients: vi.fn(),
  };
});

afterEach(() => cleanup());

describe('PatientWorkspacePage', () => {
  it('muestra alertas clínicas en la ficha del paciente', async () => {
    fetchPatientDetail.mockResolvedValue({
      patient: {
        id: patientId,
        displayName: 'Paciente Demo — Penicilina',
        demoCaseCode: 'DEMO-005',
      },
      clinicalContext: { summaryFields: {}, problems: [], observations: [] },
      notes: [],
    });
    listDrafts.mockResolvedValue({ drafts: [] });
    fetchPatientClinicalAlerts.mockResolvedValue({
      patientId,
      readOnly: true,
      evaluatedAt: new Date().toISOString(),
      alerts: [
        {
          ruleId: 'beta-lactam-cross-reactivity',
          severity: 'critical',
          message: 'Cruce beta-lactámicos',
          detail: 'Detalle demo',
          source: 'cds',
        },
      ],
    });

    render(
      <Epis2ThemeProvider>
        <ActivePatientProvider>
          <PatientWorkspacePage />
        </ActivePatientProvider>
      </Epis2ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('epis2-patient-workspace')).toBeInTheDocument();
    });
    expect(screen.getByTestId('epis2-clinical-alerts')).toBeInTheDocument();
    expect(
      screen.getByText(copy.commandCenter.clinicalAlertsTitle),
    ).toBeInTheDocument();
    expect(fetchPatientClinicalAlerts).toHaveBeenCalledWith(patientId, expect.any(Object));
  });
});
