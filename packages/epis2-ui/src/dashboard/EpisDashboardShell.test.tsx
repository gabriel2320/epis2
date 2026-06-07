/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Epis2ThemeProvider } from '../providers/Epis2ThemeProvider.js';
import { EpisDashboardShell } from './EpisDashboardShell.js';

describe('EpisDashboardShell', () => {
  it('renderiza título, tabs y volver al comando', () => {
    render(
      <Epis2ThemeProvider>
        <EpisDashboardShell
          title="Modo tablero"
          subtitle="Demo"
          tabs={[{ value: 'work', label: 'Mi trabajo' }]}
          activeTab="work"
          onTabChange={vi.fn()}
          onBackToCommand={vi.fn()}
          backLabel="Volver al Centro de Comando"
          data-testid="epis2-dashboard-shell"
        >
          <p>Contenido tab</p>
        </EpisDashboardShell>
      </Epis2ThemeProvider>,
    );
    expect(screen.getByTestId('epis2-dashboard-shell')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-dashboard-tabs')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-dashboard-panel')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-back-to-command')).toBeInTheDocument();
    expect(screen.getByText('Contenido tab')).toBeInTheDocument();
  });
});
