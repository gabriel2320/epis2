/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Epis2ThemeProvider } from '../providers/Epis2ThemeProvider.js';
import { EpisClinicalList } from './EpisClinicalList.js';

describe('EpisClinicalList', () => {
  it('renderiza filas legacy con testIds estándar', () => {
    render(
      <Epis2ThemeProvider>
        <EpisClinicalList
          visualProfile="default"
          items={[{ id: 'p1', primaryLabel: 'Ana', secondaryLabel: 'UCI · DEMO-01' }]}
          emptyMessage="Vacío"
          actionLabel="Abrir ficha"
          onOpenItem={() => {}}
        />
      </Epis2ThemeProvider>,
    );

    expect(screen.getByTestId('epis2-patient-search-results')).toBeTruthy();
    expect(screen.getByTestId('epis2-patient-search-result-p1')).toBeTruthy();
    expect(screen.getByTestId('epis2-patient-search-open-p1')).toBeTruthy();
  });

  it('muestra empty state CICA', () => {
    render(
      <Epis2ThemeProvider>
        <EpisClinicalList
          visualProfile="cica"
          items={[]}
          emptyMessage="Sin pacientes"
          actionLabel="Abrir ficha"
          onOpenItem={() => {}}
          testId="cica-census-list"
        />
      </Epis2ThemeProvider>,
    );

    expect(screen.getByTestId('cica-census-list-empty')).toBeTruthy();
  });
});
