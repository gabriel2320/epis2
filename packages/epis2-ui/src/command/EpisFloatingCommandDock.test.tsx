/**
 * @vitest-environment jsdom
 */
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Epis2ThemeProvider } from '../providers/Epis2ThemeProvider.js';
import { EpisFloatingCommandDock } from './EpisFloatingCommandDock.js';

describe('EpisFloatingCommandDock', () => {
  it('renderiza prompt, power bar y envía comando', () => {
    const onSubmit = vi.fn();
    render(
      <Epis2ThemeProvider>
        <EpisFloatingCommandDock
          prompt="¿Qué necesitas hacer?"
          label="Instrucción clínica"
          placeholder="Escribe…"
          submitLabel="Continuar"
          value="evoluciona"
          onChange={() => {}}
          onSubmit={onSubmit}
          roleLabel="Médico"
          aiAvailable={true}
        />
      </Epis2ThemeProvider>,
    );
    expect(screen.getByTestId('epis2-floating-command-dock')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-command-prompt')).toHaveTextContent('¿Qué necesitas hacer?');
    expect(screen.getByTestId('epis2-power-bar')).toBeInTheDocument();
    fireEvent.submit(screen.getByTestId('epis2-power-bar'));
    expect(onSubmit).toHaveBeenCalled();
  });
});
