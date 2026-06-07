/**
 * @vitest-environment jsdom
 */
import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Epis2ThemeProvider } from '../providers/Epis2ThemeProvider.js';
import { EpisSplitPane } from './EpisSplitPane.js';

describe('EpisSplitPane', () => {
  afterEach(() => cleanup());

  it('muestra solo primario cuando secondary cerrado', () => {
    render(
      <Epis2ThemeProvider>
        <EpisSplitPane primary={<div>Resumen</div>} secondary={<div>Historial</div>} secondaryOpen={false} />
      </Epis2ThemeProvider>,
    );
    expect(screen.getByText('Resumen')).toBeInTheDocument();
    expect(screen.queryByText('Historial')).not.toBeInTheDocument();
  });

  it('muestra ambos paneles cuando secondaryOpen', () => {
    render(
      <Epis2ThemeProvider>
        <EpisSplitPane
          primary={<div>Resumen</div>}
          secondary={<div>Historial</div>}
          secondaryOpen
          testId="split"
        />
      </Epis2ThemeProvider>,
    );
    const split = screen.getByTestId('split');
    expect(within(split).getByText('Resumen')).toBeInTheDocument();
    expect(within(split).getByText('Historial')).toBeInTheDocument();
  });
});
