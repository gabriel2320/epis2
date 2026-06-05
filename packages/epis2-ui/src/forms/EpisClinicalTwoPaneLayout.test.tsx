/**
 * @vitest-environment jsdom
 */
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Epis2ThemeProvider } from '../providers/Epis2ThemeProvider.js';
import { EpisClinicalFocusAppBar } from './EpisClinicalFocusAppBar.js';
import { EpisClinicalTwoPaneLayout } from './EpisClinicalTwoPaneLayout.js';
import { useEpisClinicalContextPanel } from './useEpisClinicalContextPanel.js';

vi.mock('@mui/material/useMediaQuery', () => ({
  default: () => true,
}));

function SplitHarness() {
  const { contextOpen, setContextOpen } = useEpisClinicalContextPanel();
  return (
    <EpisClinicalTwoPaneLayout
      appBar={
        <EpisClinicalFocusAppBar
          patientName="Paciente Demo"
          contextOpen={contextOpen}
          onContextOpenChange={setContextOpen}
          contextOpenLabel="Consultar historial"
          contextCloseLabel="Cerrar historial"
          contextOpenAria="Abrir panel de historial del paciente"
          contextCloseAria="Cerrar panel de historial"
        />
      }
      actionPane={<div>Formulario activo</div>}
      contextPane={<div>Historial clínico</div>}
      contextOpen={contextOpen}
      onContextOpenChange={setContextOpen}
      footer={<button type="button">Guardar</button>}
    />
  );
}

describe('EpisClinicalTwoPaneLayout', () => {
  afterEach(() => cleanup());

  it('muestra panel de acción y abre contexto en split', async () => {
    const user = userEvent.setup();

    render(
      <Epis2ThemeProvider>
        <SplitHarness />
      </Epis2ThemeProvider>,
    );

    expect(screen.getByTestId('epis2-clinical-action-pane')).toHaveTextContent('Formulario activo');
    expect(screen.queryByText('Historial clínico')).not.toBeInTheDocument();

    await user.click(screen.getByTestId('epis2-clinical-context-toggle'));

    expect(screen.getByText('Historial clínico')).toBeInTheDocument();
  });

  it('renderiza panel contexto cuando contextOpen es true', () => {
    render(
      <Epis2ThemeProvider>
        <EpisClinicalTwoPaneLayout
          appBar={<div>bar</div>}
          actionPane={<div>Acción</div>}
          contextPane={<div>Historial clínico</div>}
          contextOpen
          onContextOpenChange={() => undefined}
          footer={<div>pie</div>}
        />
      </Epis2ThemeProvider>,
    );

    expect(screen.getByTestId('epis2-clinical-context-split')).toBeInTheDocument();
    expect(screen.getByText('Historial clínico')).toBeInTheDocument();
  });
});
