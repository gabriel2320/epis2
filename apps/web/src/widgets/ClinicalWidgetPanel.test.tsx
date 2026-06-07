/**
 * @vitest-environment jsdom
 */
import { cleanup, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useEffect, type ReactNode } from 'react';
import { ActivePatientProvider, useActivePatient } from '../clinical/ActivePatientContext.js';
import { renderWithQuery } from '../test/renderWithQuery.js';
import { ClinicalWidgetPanel } from './ClinicalWidgetPanel.js';

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock('../routes/clinicalNavigate.js', () => ({
  useClinicalNavigate: () => vi.fn(),
}));

vi.mock('../api/clinicalApi.js', () => ({
  listDrafts: vi.fn().mockResolvedValue({ drafts: [] }),
  fetchPatientLongitudinal: vi.fn().mockResolvedValue({
    patientId: 'p1',
    problems: [{ id: '1', description: 'HTA', status: 'active' }],
    allergies: [],
    medications: [],
    observations: [],
    documents: [],
    encounters: [],
    timeline: [],
    readOnly: true,
  }),
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

const patient = {
  id: 'a0000001-0000-4000-8000-000000000005',
  displayName: 'Paciente Demo — Penicilina',
  demoCaseCode: 'DEMO-005',
};

function SeedPatient({ children }: { children: ReactNode }) {
  const { setPatient } = useActivePatient();
  useEffect(() => {
    setPatient(patient);
  }, [setPatient]);
  return children;
}

function renderPanel(
  props: Parameters<typeof ClinicalWidgetPanel>[0],
  withPatient = false,
) {
  return renderWithQuery(
    <ActivePatientProvider>
      {withPatient ? (
        <SeedPatient>
          <ClinicalWidgetPanel {...props} />
        </SeedPatient>
      ) : (
        <ClinicalWidgetPanel {...props} />
      )}
    </ActivePatientProvider>,
  );
}

afterEach(() => cleanup());

describe('ClinicalWidgetPanel', () => {
  it('no muestra widgets dashboard en Centro de Comando', () => {
    renderPanel({
      surface: 'command-center',
      patientId: patient.id,
      explicitlyShownWidgetIds: ['my-work'],
    });
    expect(screen.queryByTestId('epis2-widget-my-work')).not.toBeInTheDocument();
  });

  it('muestra patient-context en comando con paciente activo', async () => {
    renderPanel(
      {
        surface: 'command-center',
        patientId: patient.id,
        explicitlyShownWidgetIds: ['pending-drafts'],
      },
      true,
    );
    await waitFor(() => {
      expect(screen.getByTestId('epis2-widget-patient-context')).toBeInTheDocument();
    });
  });

  it('muestra patient-summary en ficha cuando se revela explícitamente', async () => {
    renderPanel({
      surface: 'patient-workspace',
      patientId: patient.id,
      explicitlyShownWidgetIds: ['patient-summary'],
    });
    await waitFor(() => {
      expect(screen.getByTestId('epis2-widget-patient-summary')).toBeInTheDocument();
    });
  });
});
