/**
 * @vitest-environment jsdom
 */
import { copy } from '@epis2/design-system';
import { cleanup, fireEvent, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ActivePatientProvider } from '../clinical/ActivePatientContext.js';
import { AuthProvider } from '../auth/AuthContext.js';
import { ClinicalShellCommandPalette } from './ClinicalShellCommandPalette.js';
import { renderWithQuery } from '../test/renderWithQuery.js';

const session = {
  user: { id: 'u1', username: 'doc.demo', role: 'physician' as const, displayName: 'Dr Demo' },
  permissions: ['command.execute'],
};

vi.mock('../auth/AuthContext.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../auth/AuthContext.js')>();
  return {
    ...actual,
    useAuth: () => ({ session, logout: vi.fn() }),
  };
});

vi.mock('../clinical/useClinicalCommandSubmit.js', () => ({
  useClinicalCommandSubmit: () => ({
    submit: vi.fn(),
    pendingConfirmation: null,
    confirmPending: vi.fn(),
    cancelPending: vi.fn(),
  }),
}));

vi.mock('../clinical/useCommandResolveContext.js', () => ({
  useCommandResolveContext: () => ({ workspace: 'patient_chart' }),
}));

function renderPalette() {
  return renderWithQuery(
    <AuthProvider>
      <ActivePatientProvider>
        <ClinicalShellCommandPalette />
      </ActivePatientProvider>
    </AuthProvider>,
  );
}

describe('ClinicalShellCommandPalette', () => {
  afterEach(() => cleanup());

  it('abre con Ctrl+K', () => {
    renderPalette();
    expect(screen.queryByTestId('epis2-clinical-command-palette')).not.toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(screen.getByTestId('epis2-clinical-command-palette')).toBeInTheDocument();
    expect(screen.getByText(copy.clinicalProductivity.commandPaletteTitle)).toBeInTheDocument();
  });
});
