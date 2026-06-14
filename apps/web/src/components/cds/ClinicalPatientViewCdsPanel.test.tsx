/**
 * @vitest-environment jsdom
 */
import { Epis2ThemeProvider } from '@epis2/epis2-ui';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import type { ClinicalAlert } from '@epis2/contracts';
import { ClinicalPatientViewCdsPanel } from './ClinicalPatientViewCdsPanel.js';

afterEach(() => cleanup());

const sampleAlert: ClinicalAlert = {
  ruleId: 'beta-lactam-cross-reactivity',
  severity: 'critical',
  message: 'Reacción cruzada beta-lactámico',
  detail: 'Ceftriaxona con alergia a penicilina.',
  source: 'cds',
};

describe('ClinicalPatientViewCdsPanel (MF-CU-02)', () => {
  it('no renderiza cuando no hay alertas mapeables', () => {
    const { container } = render(
      <Epis2ThemeProvider>
        <ClinicalPatientViewCdsPanel alerts={[]} />
      </Epis2ThemeProvider>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renderiza stack de ClinicalCdsCard con testId patient-view', () => {
    render(
      <Epis2ThemeProvider>
        <ClinicalPatientViewCdsPanel alerts={[sampleAlert]} />
      </Epis2ThemeProvider>,
    );

    expect(screen.getByTestId('epis2-cds-patient-view')).toBeInTheDocument();
    expect(
      screen.getByTestId('epis2-cds-patient-view-card-beta-lactam-cross-reactivity'),
    ).toBeInTheDocument();
    expect(screen.getByText('Reacción cruzada beta-lactámico')).toBeInTheDocument();
  });
});
