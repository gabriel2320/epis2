/**
 * @vitest-environment jsdom
 */
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Epis2ThemeProvider } from '../providers/Epis2ThemeProvider.js';
import { EpisCommandBar } from './EpisCommandBar.js';

describe('EpisCommandBar', () => {
  it('envía el comando al enviar el formulario', () => {
    const onSubmit = vi.fn();
    render(
      <Epis2ThemeProvider>
        <EpisCommandBar
          label="Instrucción"
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
    expect(screen.getByTestId('epis2-power-bar')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-command-ai-status')).toHaveTextContent('IA local');
    fireEvent.submit(screen.getByTestId('epis2-power-bar'));
    expect(onSubmit).toHaveBeenCalled();
  });

  it('muestra el hint de IA una sola vez bajo el campo', () => {
    const hint = 'IA local apagada — comandos y formularios manuales disponibles.';
    render(
      <Epis2ThemeProvider>
        <EpisCommandBar
          label="Instrucción"
          placeholder="Escribe…"
          submitLabel="Continuar"
          value=""
          onChange={() => {}}
          onSubmit={() => {}}
          aiAvailable={false}
          aiHint={hint}
        />
      </Epis2ThemeProvider>,
    );
    expect(screen.getAllByText(hint)).toHaveLength(1);
  });
});
