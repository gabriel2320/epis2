/**
 * @vitest-environment jsdom
 */
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { createEpis2Theme } from '../theme/create-epis2-theme.js';
import { clinicalRoles } from '../theme/clinical-roles.js';
import { Epis2ThemeProvider } from './Epis2ThemeProvider.js';
import { EpisAppearancePreferencesPanel } from './EpisAppearancePreferencesPanel.js';

describe('EpisAppearancePreferencesPanel', () => {
  afterEach(() => {
    cleanup();
  });

  it('solo muestra acentos MTB en producción', () => {
    render(
      <Epis2ThemeProvider>
        <EpisAppearancePreferencesPanel />
      </Epis2ThemeProvider>,
    );

    expect(screen.getByTestId('epis2-accent-clinicalBlue')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-accent-tealBlue')).toBeInTheDocument();
    expect(screen.queryByTestId('epis2-accent-neutral')).not.toBeInTheDocument();
  });

  it('persiste contraste alto sin alterar roles clínicos', async () => {
    window.localStorage.clear();
    const user = userEvent.setup();

    render(
      <Epis2ThemeProvider>
        <EpisAppearancePreferencesPanel />
      </Epis2ThemeProvider>,
    );

    const panel = screen.getByTestId('epis2-appearance-preferences');
    await user.click(within(panel).getByTestId('epis2-contrast-high'));

    const stored = JSON.parse(
      window.localStorage.getItem('epis2-theme-preferences-v2') ?? '{}',
    ) as {
      contrast?: string;
    };
    expect(stored.contrast).toBe('high');

    const theme = createEpis2Theme({ contrast: 'high', accent: 'tealBlue', mode: 'dark' });
    expect(theme.epis2.clinical).toEqual(clinicalRoles);
  });
});
