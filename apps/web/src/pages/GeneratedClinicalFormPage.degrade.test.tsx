/**
 * @vitest-environment jsdom
 * MF-SH-03 — Degradación IA (Ollama down): formulario manual operativo.
 */
import { getBlueprintById } from '@epis2/clinical-forms';
import { copy } from '@epis2/design-system';
import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ActivePatientProvider } from '../clinical/ActivePatientContext.js';
import { renderWithQuery } from '../test/renderWithQuery.js';
import { GeneratedClinicalFormPage } from './GeneratedClinicalFormPage.js';

const { fetchAiStatus, requestDraftAssist } = vi.hoisted(() => ({
  fetchAiStatus: vi.fn(),
  requestDraftAssist: vi.fn(),
}));

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(),
  useSearch: () => ({ patientId: '00000000-0000-4000-8000-000000000099' }),
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
    status = 503;
  },
}));

vi.mock('../api/aiApi.js', () => ({
  fetchAiStatus,
  requestDraftAssist,
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

const evolutionBlueprint = getBlueprintById('evolution_note');
if (!evolutionBlueprint) {
  throw new Error('evolution_note blueprint missing');
}

describe('MF-SH-03 — GeneratedClinicalFormPage con Ollama down', () => {
  beforeEach(() => {
    fetchAiStatus.mockResolvedValue({
      available: false,
      ollama: 'down',
      localAi: 'down',
      message: '',
    });
    requestDraftAssist.mockClear();
  });

  afterEach(() => cleanup());

  it('formulario manual operativo: campos editables y guardar disponible', async () => {
    const user = userEvent.setup();
    renderWithQuery(
      <ActivePatientProvider>
        <GeneratedClinicalFormPage blueprint={evolutionBlueprint} />
      </ActivePatientProvider>,
    );

    expect(screen.getByTestId('epis2-form-evolution_note')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: copy.forms.save })).toBeEnabled();
    expect(requestDraftAssist).not.toHaveBeenCalled();

    await user.click(screen.getByTestId('epis2-scrollspy-soap'));
    await user.type(screen.getByRole('textbox', { name: /objetivo/i }), 'Signos estables');
    await user.click(screen.getByTestId('epis2-form-save'));

    expect(screen.getByTestId('epis2-form-status')).toBeInTheDocument();
  });

  it('sugerir con IA degrada a mensaje manual sin bloquear el formulario', async () => {
    requestDraftAssist.mockResolvedValue({
      status: 'unavailable',
      message: copy.forms.aiUnavailable,
      requiresHumanReview: true,
    });

    const user = userEvent.setup();
    renderWithQuery(
      <ActivePatientProvider>
        <GeneratedClinicalFormPage blueprint={evolutionBlueprint} />
      </ActivePatientProvider>,
    );

    await user.click(screen.getByTestId('epis2-form-more-actions'));
    await user.click(screen.getByTestId('epis2-ai-suggest'));

    await waitFor(() => {
      expect(requestDraftAssist).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(screen.getByTestId('epis2-form-status')).toHaveTextContent(copy.forms.aiUnavailable);
    });
    expect(screen.getByRole('button', { name: copy.forms.save })).toBeEnabled();
  });
});
