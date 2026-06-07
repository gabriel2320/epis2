/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Epis2ThemeProvider } from '../providers/Epis2ThemeProvider.js';
import { EpisAuthScreen } from './EpisAuthScreen.js';

describe('EpisAuthScreen', () => {
  it('renderiza gateway M3 sin marco anidado', () => {
    render(
      <Epis2ThemeProvider disablePreferences>
        <EpisAuthScreen>
          <p>Contenido login</p>
        </EpisAuthScreen>
      </Epis2ThemeProvider>,
    );

    expect(screen.getByTestId('epis2-login-gateway')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-login-page')).toBeInTheDocument();
    expect(screen.getByText('Contenido login')).toBeInTheDocument();
  });
});
