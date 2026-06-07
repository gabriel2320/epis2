/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Epis2ThemeProvider } from '../providers/Epis2ThemeProvider.js';
import { EpisBentoCell, EpisBentoGrid } from '../layout/EpisBentoGrid.js';

describe('EpisBentoGrid', () => {
  it('renderiza celdas en grilla bento', () => {
    render(
      <Epis2ThemeProvider>
        <EpisBentoGrid testId="bento-test">
          <EpisBentoCell title="Recientes" testId="cell-a">
            Contenido A
          </EpisBentoCell>
          <EpisBentoCell title="Tareas" testId="cell-b">
            Contenido B
          </EpisBentoCell>
        </EpisBentoGrid>
      </Epis2ThemeProvider>,
    );
    expect(screen.getByTestId('bento-test')).toBeInTheDocument();
    expect(screen.getByTestId('cell-a')).toHaveTextContent('Recientes');
    expect(screen.getByTestId('cell-b')).toHaveTextContent('Tareas');
  });
});
