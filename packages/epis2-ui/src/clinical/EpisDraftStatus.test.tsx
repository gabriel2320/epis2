/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Epis2ThemeProvider } from '../providers/Epis2ThemeProvider.js';
import { EpisDraftStatus } from './EpisDraftStatus.js';

describe('EpisDraftStatus', () => {
  it('muestra etiqueta en español para ready_for_review', () => {
    render(
      <Epis2ThemeProvider>
        <EpisDraftStatus status="ready_for_review" />
      </Epis2ThemeProvider>,
    );
    expect(screen.getByTestId('epis2-draft-status-ready_for_review')).toHaveTextContent(
      'Listo para revisión',
    );
  });

  it('aplica rol clínico approved (container) en el chip', () => {
    render(
      <Epis2ThemeProvider>
        <EpisDraftStatus status="approved" />
      </Epis2ThemeProvider>,
    );
    const chip = screen.getByTestId('epis2-draft-status-approved');
    // Rol clínico protegido approved.container = #E8F5EE → rgb(232, 245, 238)
    expect(chip).toHaveStyle({ backgroundColor: 'rgb(232, 245, 238)' });
  });
});
