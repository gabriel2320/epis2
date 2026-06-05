/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Epis2ThemeProvider } from '../providers/Epis2ThemeProvider.js';
import { EpisDataGrid, type GridColDef } from './EpisDataGridCore.js';

const columns: GridColDef[] = [
  { field: 'title', headerName: 'Título', flex: 1, minWidth: 120 },
];

describe('EpisDataGrid', () => {
  it('muestra overlay vacío en español', () => {
    render(
      <Epis2ThemeProvider>
        <EpisDataGrid
          rows={[]}
          columns={columns}
          emptyMessage="Sin borradores abiertos."
          data-testid="epis2-grid-test"
        />
      </Epis2ThemeProvider>,
    );
    expect(screen.getByTestId('epis2-grid-test')).toBeInTheDocument();
    expect(screen.getByText('Sin borradores abiertos.')).toBeInTheDocument();
  });

  it('muestra filas y error', () => {
    const { rerender } = render(
      <Epis2ThemeProvider>
        <EpisDataGrid
          rows={[{ id: '1', title: 'Evolución demo' }]}
          columns={columns}
          data-testid="epis2-grid-rows"
        />
      </Epis2ThemeProvider>,
    );
    expect(screen.getByText('Evolución demo')).toBeInTheDocument();

    rerender(
      <Epis2ThemeProvider>
        <EpisDataGrid rows={[]} columns={columns} error="Error de carga" data-testid="epis2-grid-err" />
      </Epis2ThemeProvider>,
    );
    expect(screen.getByText('Error de carga')).toBeInTheDocument();
  });
});
