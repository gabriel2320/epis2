/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Epis2ThemeProvider } from '../providers/Epis2ThemeProvider.js';
import { EpisDatePicker } from './EpisDatePicker.js';

describe('EpisDatePicker', () => {
  it('muestra etiqueta en español', () => {
    render(
      <Epis2ThemeProvider>
        <EpisDatePicker
          label="Fecha del encuentro"
          value="2026-06-04"
          onChange={vi.fn()}
          data-testid="epis2-date-picker"
        />
      </Epis2ThemeProvider>,
    );
    expect(screen.getByTestId('epis2-date-picker')).toBeInTheDocument();
    expect(screen.getByLabelText('Fecha del encuentro')).toBeInTheDocument();
  });
});
