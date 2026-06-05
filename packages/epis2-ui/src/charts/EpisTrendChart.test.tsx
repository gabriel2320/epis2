/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Epis2ThemeProvider } from '../providers/Epis2ThemeProvider.js';
import { EpisTrendChart } from './EpisTrendChartCore.js';

describe('EpisTrendChart', () => {
  it('muestra estado vacío sin puntos', () => {
    render(
      <Epis2ThemeProvider>
        <EpisTrendChart
          xAxisLabels={[]}
          series={[{ label: 'INR', data: [] }]}
          emptyMessage="Sin tendencia de laboratorio."
          data-testid="epis2-chart-empty"
        />
      </Epis2ThemeProvider>,
    );
    expect(screen.getByTestId('epis2-chart-empty')).toBeInTheDocument();
    expect(screen.getByText('Sin tendencia de laboratorio.')).toBeInTheDocument();
  });

  it('renderiza serie con datos', () => {
    render(
      <Epis2ThemeProvider>
        <EpisTrendChart
          title="INR demo"
          xAxisLabels={['D1', 'D2']}
          series={[{ label: 'INR', data: [1.9, 2.1] }]}
          data-testid="epis2-chart-inr"
        />
      </Epis2ThemeProvider>,
    );
    expect(screen.getByText('INR demo')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-chart-inr')).toBeInTheDocument();
  });
});
