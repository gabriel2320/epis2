/**
 * @vitest-environment jsdom
 * EpisRadDashboardTabShell (gap auditoría 4.4): hero + bulk actions + grid.
 */
import { Epis2ThemeProvider } from '@epis2/epis2-ui';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { EpisRadDashboardTabShell } from './EpisRadDashboardTabShell.js';

afterEach(() => cleanup());

function renderShell(ui: React.ReactElement) {
  return render(<Epis2ThemeProvider disablePreferences>{ui}</Epis2ThemeProvider>);
}

describe('EpisRadDashboardTabShell', () => {
  it('renderiza hero, contenido y testId', () => {
    renderShell(
      <EpisRadDashboardTabShell hero={<div>Hero demo</div>} testId="epis2-rad-tab-demo">
        <div>Grid demo</div>
      </EpisRadDashboardTabShell>,
    );
    expect(screen.getByTestId('epis2-rad-tab-demo')).toBeInTheDocument();
    expect(screen.getByText('Hero demo')).toBeInTheDocument();
    expect(screen.getByText('Grid demo')).toBeInTheDocument();
  });

  it('renderiza bulk actions cuando se proveen', () => {
    renderShell(
      <EpisRadDashboardTabShell bulkActions={<button type="button">Acción masiva</button>}>
        <div>Grid</div>
      </EpisRadDashboardTabShell>,
    );
    expect(screen.getByRole('button', { name: 'Acción masiva' })).toBeInTheDocument();
  });
});
