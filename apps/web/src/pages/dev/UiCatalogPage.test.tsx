/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Epis2ThemeProvider } from '@epis2/epis2-ui';
import { UiCatalogPage } from './UiCatalogPage.js';

vi.mock('@epis2/epis2-ui', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@epis2/epis2-ui')>();
  const tree = await import('@epis2/epis2-ui/tree');
  const charts = await import('@epis2/epis2-ui/charts');
  const data = await import('@epis2/epis2-ui/data');
  return {
    ...actual,
    EpisTreeViewSuspense: tree.EpisTreeView,
    EpisTrendChartSuspense: charts.EpisTrendChart,
    EpisDataGridSuspense: data.EpisDataGrid,
  };
});

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
    expect(screen.getByTestId('epis2-ui-catalog-tree')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-ui-catalog-chart')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-ui-catalog-grid')).toBeInTheDocument();
  });
});
