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
});
