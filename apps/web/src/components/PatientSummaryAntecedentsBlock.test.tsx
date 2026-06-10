/**
 * @vitest-environment jsdom
 */
import { copy } from '@epis2/design-system';
import { Epis2ThemeProvider } from '@epis2/epis2-ui';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PatientSummaryAntecedentsBlock } from './PatientSummaryAntecedentsBlock.js';

afterEach(() => cleanup());

describe('PatientSummaryAntecedentsBlock', () => {
  it('muestra CTAs en ficha compacta cuando alergias y problemas están vacíos', async () => {
    const user = userEvent.setup();
    const onAllergy = vi.fn();
    const onProblem = vi.fn();

    render(
      <Epis2ThemeProvider>
        <PatientSummaryAntecedentsBlock
          allergies={[]}
          problems={[]}
          onRegisterAllergy={onAllergy}
          onRegisterProblem={onProblem}
        />
      </Epis2ThemeProvider>,
    );

    await user.click(screen.getByTestId('epis2-ficha-register-allergy'));
    await user.click(screen.getByTestId('epis2-ficha-register-problem'));

    expect(onAllergy).toHaveBeenCalledOnce();
    expect(onProblem).toHaveBeenCalledOnce();
    expect(screen.getByTestId('epis2-ficha-antecedents')).toBeInTheDocument();
    expect(screen.getAllByText(copy.longitudinal.emptySection).length).toBeGreaterThan(0);
  });

  it('lista antecedentes cuando existen datos', () => {
    render(
      <Epis2ThemeProvider>
        <PatientSummaryAntecedentsBlock
          allergies={[
            { id: 'a1', substance: 'Penicilina', severity: 'moderate', status: 'active' },
          ]}
          problems={[{ id: 'p1', description: 'HTA', status: 'active' }]}
        />
      </Epis2ThemeProvider>,
    );

    expect(screen.getByText('Penicilina')).toBeInTheDocument();
    expect(screen.getByText('HTA')).toBeInTheDocument();
    expect(screen.queryByTestId('epis2-ficha-register-allergy')).not.toBeInTheDocument();
  });
});
