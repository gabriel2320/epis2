/**
 * @vitest-environment jsdom
 */
import { copy } from '@epis2/design-system';
import { Epis2ThemeProvider } from '@epis2/epis2-ui';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PatientLongitudinalPanel } from '../components/PatientLongitudinalPanel.js';

afterEach(() => cleanup());

const emptyLongitudinal = {
  patientId: 'p1',
  readOnly: false,
  problems: [],
  allergies: [],
  medications: [],
  observations: [],
  documents: [],
  encounters: [],
  timeline: [],
};

describe('PatientLongitudinalPanel — Ola 3 CTAs', () => {
  it('ofrece registrar alergia y problema cuando vacíos', async () => {
    const user = userEvent.setup();
    const onAllergy = vi.fn();
    const onProblem = vi.fn();
    const onResults = vi.fn();

    render(
      <Epis2ThemeProvider>
        <PatientLongitudinalPanel
          data={emptyLongitudinal}
          onRegisterAllergy={onAllergy}
          onRegisterProblem={onProblem}
          onOpenResults={onResults}
        />
      </Epis2ThemeProvider>,
    );

    await user.click(screen.getByTestId('epis2-longitudinal-register-allergy'));
    await user.click(screen.getByTestId('epis2-longitudinal-register-problem'));
    await user.click(screen.getByTestId('epis2-longitudinal-open-results'));

    expect(onAllergy).toHaveBeenCalledOnce();
    expect(onProblem).toHaveBeenCalledOnce();
    expect(onResults).toHaveBeenCalledOnce();
    expect(screen.getAllByText(copy.longitudinal.emptySection).length).toBeGreaterThan(0);
  });
});
