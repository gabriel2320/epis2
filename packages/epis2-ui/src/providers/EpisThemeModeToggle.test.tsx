/**
 * @vitest-environment jsdom
 */
import { copy } from '@epis2/design-system';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Epis2ThemeProvider } from './Epis2ThemeProvider.js';
import { EpisThemeModeToggle } from './EpisThemeModeToggle.js';

describe('EpisThemeModeToggle', () => {
  it('alterna modo claro/oscuro y persiste preferencia', async () => {
    window.localStorage.clear();
    const user = userEvent.setup();

    render(
      <Epis2ThemeProvider>
        <EpisThemeModeToggle />
      </Epis2ThemeProvider>,
    );

    const toggle = screen.getByTestId('epis2-theme-mode-toggle');
    expect(toggle).toHaveAttribute('aria-label', copy.themePreferences.modeDark);

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-label', copy.themePreferences.modeLight);

    const stored = JSON.parse(window.localStorage.getItem('epis2-theme-preferences-v2') ?? '{}') as {
      mode?: string;
    };
    expect(stored.mode).toBe('dark');
  });
});
