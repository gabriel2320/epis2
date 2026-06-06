/**
 * @vitest-environment jsdom
 */
import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Epis2ThemeProvider } from '../providers/Epis2ThemeProvider.js';
import { Epis2WidgetGrid } from './Epis2WidgetGrid.js';
import { Epis2WidgetSurface } from './Epis2WidgetSurface.js';

vi.mock('@mui/material/useMediaQuery', () => ({
  default: () => true,
}));

function wrap(ui: ReactNode) {
  return render(<Epis2ThemeProvider disablePreferences>{ui}</Epis2ThemeProvider>);
}

describe('Epis2WidgetGrid', () => {
  it('renderiza rejilla 12 columnas con superficies hijas', () => {
    wrap(
      <Epis2WidgetGrid data-testid="grid-demo">
        <Epis2WidgetSurface testId="widget-a" columnSpan={6}>
          <span>A</span>
        </Epis2WidgetSurface>
        <Epis2WidgetSurface testId="widget-b" columnSpan={6}>
          <span>B</span>
        </Epis2WidgetSurface>
      </Epis2WidgetGrid>,
    );
    expect(screen.getByTestId('grid-demo')).toBeInTheDocument();
    expect(screen.getByTestId('widget-a')).toBeInTheDocument();
    expect(screen.getByTestId('widget-b')).toBeInTheDocument();
  });
});
