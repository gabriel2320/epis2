/**
 * @vitest-environment jsdom
 */
import { copy } from '@epis2/design-system';
import { cleanup, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ActivePatientProvider } from '../clinical/ActivePatientContext.js';
import { renderWithQuery } from '../test/renderWithQuery.js';
import { PatientWorkspacePage } from './PatientWorkspacePage.js';

const patientId = 'a0000001-0000-4000-8000-000000000005';

const { fetchPatientDetail, fetchPatientClinicalAlerts, fetchPatientLongitudinal, listDrafts } =
  vi.hoisted(() => ({
    fetchPatientDetail: vi.fn(),
    fetchPatientClinicalAlerts: vi.fn(),
    fetchPatientLongitudinal: vi.fn(),
    listDrafts: vi.fn(),
  }));

vi.mock('@tanstack/react-router', () => ({
  useSearch: () => ({ patientId }),
  Link: ({ children }: { children?: unknown }) => <span>{children as string}</span>,
}));

vi.mock('../routes/clinicalNavigate.js', () => ({
  useClinicalNavigate: () => vi.fn(),
}));

vi.mock('../auth/AuthContext.js', () => ({
  useAuth: () => ({
    session: {
      user: {
        id: 'usr-physician-01',
        username: 'medico.demo',
        displayName: 'Dra. Ana Demo',
        role: 'physician',
      },
      permissions: ['command.execute', 'draft.approve'],
      expiresAt: new Date().toISOString(),
    },
    hasPermission: () => true,
  }),
}));

vi.mock('../api/clinicalApi.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../api/clinicalApi.js')>();
  return {
    ...actual,
    fetchPatientDetail,
    fetchPatientClinicalAlerts,
    fetchPatientLongitudinal,
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
      clinicalContext: {
        summaryFields: {
          activeMedications: 'Ceftriaxona 1 g IV (demo)',
          clinicalAlerts: 'Alergia a penicilina (demo sintético)',
        },
        problems: [],
        observations: [],
      },
      notes: [],
    });
    listDrafts.mockResolvedValue({ drafts: [] });
    fetchPatientLongitudinal.mockResolvedValue({
      patientId,
      readOnly: true,
      demoCaseCode: 'DEMO-005',
      problems: [{ id: 'p1', description: 'Infección (demo)', status: 'active' }],
      allergies: [{ id: 'a1', substance: 'Penicilina', severity: 'moderate', status: 'active' }],
      medications: [{ id: 'm1', name: 'Warfarina', status: 'active' }],
      observations: [],
      documents: [],
      encounters: [],
      timeline: [{ id: 't1', kind: 'encounter', at: new Date().toISOString(), title: 'Consulta demo' }],
    });
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

    renderWithQuery(
      <ActivePatientProvider>
        <PatientWorkspacePage />
      </ActivePatientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('epis2-patient-workspace')).toBeInTheDocument();
    });
    expect(screen.getByTestId('epis2-ficha-widget-panel')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-widget-patient-summary')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-clinical-alerts')).toBeInTheDocument();
    expect(
      screen.getByText(copy.commandCenter.clinicalAlertsTitle),
    ).toBeInTheDocument();
    expect(fetchPatientClinicalAlerts).toHaveBeenCalledWith(patientId, expect.any(Object));
    expect(screen.getByTestId('epis2-clinical-summary')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-longitudinal-panel')).toBeInTheDocument();
  });
});
