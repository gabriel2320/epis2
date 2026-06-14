/**
 * @vitest-environment jsdom
 */
import { Epis2ThemeProvider } from '@epis2/epis2-ui';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import type { ClinicalAlert } from '@epis2/contracts';
import { ClinicalOrderSelectCdsPanel } from './ClinicalOrderSelectCdsPanel.js';

afterEach(() => cleanup());

const duplicateAlert: ClinicalAlert = {
  ruleId: 'cdr.duplicate_medication_order',
  severity: 'critical',
  message: 'Orden duplicada: Ceftriaxona ya está activa.',
  detail: 'Duplicar incrementa riesgo.',
  source: 'cdr',
};

describe('ClinicalOrderSelectCdsPanel (MF-CU-03)', () => {
  it('no renderiza cuando no hay alertas order-select', () => {
    const { container } = render(
      <Epis2ThemeProvider>
        <ClinicalOrderSelectCdsPanel alerts={[]} />
      </Epis2ThemeProvider>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renderiza stack de ClinicalCdsCard con testId order-select', () => {
    render(
      <Epis2ThemeProvider>
        <ClinicalOrderSelectCdsPanel alerts={[duplicateAlert]} />
      </Epis2ThemeProvider>,
    );

    expect(screen.getByTestId('epis2-cds-order-select')).toBeInTheDocument();
    expect(
      screen.getByTestId('epis2-cds-order-select-card-duplicate_medication_order'),
    ).toBeInTheDocument();
    expect(screen.getByText('Orden duplicada: Ceftriaxona ya está activa.')).toBeInTheDocument();
  });
});
