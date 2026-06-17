/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Epis2ThemeProvider } from '../providers/Epis2ThemeProvider.js';
import { CicaGeneratedScreen } from './CicaGeneratedScreen.js';
import type { CicaScreenBlueprint } from './cicaScreenBlueprint.js';

const TEST_BLUEPRINT: CicaScreenBlueprint = {
  screenId: 'census',
  hideActionBar: true,
  sections: [{ id: 'main', span: 12, placeholder: 'Contenido demo' }],
};

describe('CicaGeneratedScreen', () => {
  it('renderiza secciones desde blueprint', () => {
    render(
      <Epis2ThemeProvider disablePreferences>
        <CicaGeneratedScreen blueprint={TEST_BLUEPRINT} title="Censo" />
      </Epis2ThemeProvider>,
    );

    expect(screen.getByTestId('cica-generated-census')).toBeInTheDocument();
    expect(screen.getByText('Contenido demo')).toBeInTheDocument();
  });
});
