/**
 * @vitest-environment jsdom
 */
import { copy } from '@epis2/design-system';
import { Epis2ThemeProvider } from '@epis2/epis2-ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AppearancePreferencesPage } from './AppearancePreferencesPage.js';

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(),
}));

describe('AppearancePreferencesPage', () => {
  it('muestra preferencias MTB y persiste Calm Teal', async () => {
    window.localStorage.clear();
    const user = userEvent.setup();

    render(
      <Epis2ThemeProvider>
        <AppearancePreferencesPage />
      </Epis2ThemeProvider>,
    );

    expect(screen.getByTestId('epis2-appearance-preferences-page')).toBeInTheDocument();
    expect(screen.getAllByText(copy.themePreferences.title).length).toBeGreaterThan(0);
    expect(screen.queryByTestId('epis2-accent-calmGreen')).not.toBeInTheDocument();

    await user.click(screen.getByTestId('epis2-accent-tealBlue'));
    const stored = JSON.parse(
      window.localStorage.getItem('epis2-theme-preferences-v2') ?? '{}',
    ) as {
      accent?: string;
    };
    expect(stored.accent).toBe('tealBlue');
  });
});
