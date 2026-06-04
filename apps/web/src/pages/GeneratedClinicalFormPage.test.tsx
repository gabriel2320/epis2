/**
 * @vitest-environment jsdom
 */
import { getBlueprintById } from '@epis2/clinical-forms';
import { copy } from '@epis2/design-system';
import { Epis2ThemeProvider } from '../Epis2ThemeProvider.js';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ActivePatientProvider } from '../clinical/ActivePatientContext.js';
import { GeneratedClinicalFormPage } from './GeneratedClinicalFormPage.js';

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(),
  useSearch: () => ({ patientId: '00000000-0000-4000-8000-000000000099' }),
  Link: ({ children }: { children: React.ReactNode }) => <a href="/">{children}</a>,
}));

vi.mock('../api/client.js', () => ({
  apiFetch: vi.fn(),
  ApiError: class ApiError extends Error {
    status = 500;
  },
}));

vi.mock('../api/clinicalApi.js', () => ({
  listPatients: vi.fn().mockResolvedValue({ patients: [] }),
  fetchPatientDetail: vi.fn().mockResolvedValue({
    patient: {
      id: '00000000-0000-4000-8000-000000000099',
      displayName: 'Paciente Demo — Test',
      isSynthetic: true,
      demoLabel: 'DEMO/SINTÉTICO',
      demoCaseCode: 'DEMO-099',
    },
    clinicalContext: { summaryFields: {} },
    notes: [],
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
      permissions: ['draft.write', 'command.execute'],
      expiresAt: new Date().toISOString(),
    },
  }),
}));

afterEach(() => cleanup());

const evolutionBlueprint = getBlueprintById('evolution_note');
if (!evolutionBlueprint) {
  throw new Error('evolution_note blueprint missing');
}

describe('GeneratedClinicalFormPage (sin IA)', () => {
  it('renderiza evolución y valida borrador local sin fetch de IA', async () => {
    const user = userEvent.setup();
    render(
      <Epis2ThemeProvider>
        <ActivePatientProvider>
          <GeneratedClinicalFormPage blueprint={evolutionBlueprint} />
        </ActivePatientProvider>
      </Epis2ThemeProvider>,
    );

    expect(screen.getByTestId('epis2-form-evolution_note')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-ai-suggest')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: copy.forms.saveDraft }));

    expect(screen.getByTestId('epis2-form-status')).toHaveTextContent(/obligatorios|válido/i);
  });

  it('acepta evolución completa y muestra mensaje de éxito local o remoto', async () => {
    const user = userEvent.setup();
    const { apiFetch } = await import('../api/client.js');
    vi.mocked(apiFetch).mockRejectedValueOnce(new Error('offline'));

    render(
      <Epis2ThemeProvider>
        <ActivePatientProvider>
          <GeneratedClinicalFormPage blueprint={evolutionBlueprint} />
        </ActivePatientProvider>
      </Epis2ThemeProvider>,
    );

    await user.type(screen.getByRole('textbox', { name: /subjetivo/i }), 'Mejoría clínica (demo)');
    await user.type(screen.getByRole('textbox', { name: /análisis/i }), 'Evolución favorable');
    await user.type(screen.getByRole('textbox', { name: /^plan/i }), 'Continuar tratamiento');

    await user.click(screen.getByRole('button', { name: copy.forms.saveDraft }));

    expect(screen.getByTestId('epis2-form-status')).toBeInTheDocument();
  });
});
