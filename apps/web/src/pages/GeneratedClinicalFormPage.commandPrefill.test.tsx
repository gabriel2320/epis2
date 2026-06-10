/**
 * @vitest-environment jsdom
 */
import { getBlueprintById } from '@epis2/clinical-forms';
import { copy } from '@epis2/design-system';
import { cleanup, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ActivePatientProvider } from '../clinical/ActivePatientContext.js';
import { renderWithQuery } from '../test/renderWithQuery.js';
import { GeneratedClinicalFormPage } from './GeneratedClinicalFormPage.js';

const mockNavigate = vi.fn();
const mockSearch = vi.fn(() => ({
  patientId: '00000000-0000-4000-8000-000000000099',
  studyHint: 'hemograma',
  clinicalReasonHint: 'fiebre',
}));

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
  useSearch: () => mockSearch(),
  useRouterState: ({
    select,
  }: {
    select: (s: { location: { pathname: string; searchStr?: string } }) => unknown;
  }) => select({ location: { pathname: '/espacio/evolucion', searchStr: '' } }),
  Link: ({ children }: { children: React.ReactNode }) => <a href="/">{children}</a>,
}));

vi.mock('../api/client.js', () => ({
  apiFetch: vi.fn(),
  ApiError: class ApiError extends Error {
    status = 500;
  },
}));

vi.mock('../api/aiApi.js', () => ({
  fetchAiStatus: vi.fn().mockResolvedValue({
    available: false,
    ollama: 'down',
    localAi: 'down',
    message: '',
  }),
  requestDraftAssist: vi.fn(),
}));

vi.mock('../api/clinicalApi.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../api/clinicalApi.js')>();
  return {
    ...actual,
    listPatients: vi.fn().mockResolvedValue({ patients: [] }),
    fetchPatientDetail: vi.fn().mockResolvedValue({
      patient: {
        id: '00000000-0000-4000-8000-000000000099',
        displayName: 'Paciente Demo',
        isSynthetic: true,
      },
      clinicalContext: { summaryFields: {}, problems: [], observations: [] },
      notes: [],
    }),
    fetchPatientClinicalAlerts: vi.fn().mockResolvedValue({
      patientId: '00000000-0000-4000-8000-000000000099',
      readOnly: true,
      evaluatedAt: new Date().toISOString(),
      alerts: [],
    }),
    fetchPatientLongitudinal: vi.fn().mockResolvedValue({
      patientId: '00000000-0000-4000-8000-000000000099',
      readOnly: true,
      problems: [],
      allergies: [],
      medications: [],
      observations: [],
      documents: [],
      encounters: [],
      timeline: [],
    }),
  };
});

vi.mock('@mui/material/useMediaQuery', () => ({
  default: () => true,
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
      permissions: ['draft.write', 'command.execute'],
      expiresAt: new Date().toISOString(),
    },
  }),
}));

afterEach(() => {
  cleanup();
  mockNavigate.mockClear();
});

const labBlueprint = getBlueprintById('lab_request');
if (!labBlueprint) {
  throw new Error('lab_request blueprint missing');
}

describe('GeneratedClinicalFormPage — prefill comando (CE-5)', () => {
  it('muestra badge y limpia slots de la URL tras montar', async () => {
    renderWithQuery(
      <ActivePatientProvider>
        <GeneratedClinicalFormPage blueprint={labBlueprint} />
      </ActivePatientProvider>,
    );

    expect(screen.getByTestId('epis2-command-prefill-badge')).toHaveTextContent(
      copy.forms.commandPrefillBadge,
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        expect.objectContaining({
          to: '/espacio/laboratorio',
          replace: true,
          search: { patientId: '00000000-0000-4000-8000-000000000099' },
        }),
      );
    });
  });
});
