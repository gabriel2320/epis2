/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Epis2ThemeProvider } from '@epis2/epis2-ui';
import { UiCatalogPage } from './UiCatalogPage.js';

describe('UiCatalogPage', () => {
  it('muestra secciones del catálogo de primitivos', () => {
    render(
      <Epis2ThemeProvider>
        <UiCatalogPage />
      </Epis2ThemeProvider>,
    );
    expect(screen.getByTestId('epis2-ui-catalog')).toBeInTheDocument();
    expect(screen.getByText('Catálogo UI EPIS2')).toBeInTheDocument();
    expect(screen.getByText('Paleta')).toBeInTheDocument();
    expect(screen.getByText('Botones M3 (EpisButton)')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /volver al centro de comando/i })).toHaveAttribute(
      'href',
      '/comando',
    );
  });
});
