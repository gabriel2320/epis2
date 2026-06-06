/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Epis2ThemeProvider } from '../providers/Epis2ThemeProvider.js';
import { EpisClinicalFormFooter } from './EpisClinicalFormFooter.js';

describe('EpisClinicalFormFooter', () => {
  it('alinea acciones a la derecha con testid de footer', () => {
    render(
      <Epis2ThemeProvider>
        <EpisClinicalFormFooter
          actions={<button type="button">Guardar</button>}
          trailing={<nav>Navegación</nav>}
        />
      </Epis2ThemeProvider>,
    );

    expect(screen.getByTestId('epis2-clinical-form-footer')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-clinical-form-footer-actions')).toHaveStyle({
      justifyContent: 'flex-end',
    });
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeInTheDocument();
    expect(screen.getByText('Navegación')).toBeInTheDocument();
  });
});
