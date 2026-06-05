/**
 * @vitest-environment jsdom
 */
import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Epis2ThemeProvider } from '../providers/Epis2ThemeProvider.js';
import { Epis2WidgetActions } from './Epis2WidgetActions.js';
import { Epis2WidgetBody } from './Epis2WidgetBody.js';
import { Epis2WidgetHeader } from './Epis2WidgetHeader.js';
import {
  Epis2WidgetEmpty,
  Epis2WidgetError,
  Epis2WidgetForbidden,
  Epis2WidgetLoading,
  Epis2WidgetOffline,
} from './Epis2WidgetStates.js';
import { Epis2WidgetSurface } from './Epis2WidgetSurface.js';

function wrap(ui: ReactNode) {
  return render(<Epis2ThemeProvider disablePreferences>{ui}</Epis2ThemeProvider>);
}

describe('Epis2Widget UI', () => {
  it('renderiza superficie con cabecera y cuerpo', () => {
    wrap(
      <Epis2WidgetSurface testId="widget-demo">
        <Epis2WidgetHeader title="Resumen del paciente" description="Demo sintética" badge="DEMO" />
        <Epis2WidgetBody>
          <span>Contenido clínico</span>
        </Epis2WidgetBody>
      </Epis2WidgetSurface>,
    );
    expect(screen.getByTestId('widget-demo')).toBeInTheDocument();
    expect(screen.getByText('Resumen del paciente')).toBeInTheDocument();
    expect(screen.getByText('Contenido clínico')).toBeInTheDocument();
  });

  it('muestra estados comunes en español', () => {
    wrap(
      <>
        <Epis2WidgetLoading message="Cargando información…" />
        <Epis2WidgetEmpty message="Sin datos para mostrar." />
        <Epis2WidgetError message="No se pudo cargar." />
        <Epis2WidgetForbidden message="Tu rol no puede ver este contenido." />
        <Epis2WidgetOffline message="Modo sin conexión activo." />
      </>,
    );
    expect(screen.getByTestId('epis2-widget-loading')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-widget-empty')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-widget-error')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-widget-forbidden')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-widget-offline')).toBeInTheDocument();
  });

  it('renderiza acciones de navegación', () => {
    wrap(
      <Epis2WidgetActions
        actions={[{ id: 'go', label: 'Abrir ficha', href: '/espacio/ficha' }]}
      />,
    );
    expect(screen.getByTestId('epis2-widget-actions')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Abrir ficha' })).toHaveAttribute('href', '/espacio/ficha');
  });
});
