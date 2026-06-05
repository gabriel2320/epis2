/**
 * @vitest-environment jsdom
 */
import { copy } from '@epis2/design-system';
import { Epis2ThemeProvider } from '@epis2/epis2-ui';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { VisualThemeCatalogPage } from './VisualThemeCatalogPage.js';

describe('VisualThemeCatalogPage', () => {
  it('muestra secciones del catálogo visual M3', () => {
    render(
      <Epis2ThemeProvider>
        <VisualThemeCatalogPage />
      </Epis2ThemeProvider>,
    );

    expect(screen.getByTestId('epis2-visual-theme-catalog')).toBeInTheDocument();
    expect(screen.getByText(copy.visualThemeCatalog.title)).toBeInTheDocument();
    expect(screen.getByTestId('epis2-appearance-preferences')).toBeInTheDocument();
    expect(screen.getByText(copy.visualThemeCatalog.clinicalRolesSection)).toBeInTheDocument();
    expect(screen.getByText(copy.visualThemeCatalog.proseSample)).toBeInTheDocument();
  });
});
