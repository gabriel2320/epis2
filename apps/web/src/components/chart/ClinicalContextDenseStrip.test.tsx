/**
 * @vitest-environment jsdom
 */
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import type { ClinicalContextDensePayload } from '@epis2/clinical-domain';
import { copy } from '@epis2/design-system';
import { ClinicalContextDenseStrip } from './ClinicalContextDenseStrip.js';

const sampleDense: ClinicalContextDensePayload = {
  activeProblems: ['Hipertensión arterial', 'Diabetes mellitus tipo 2'],
  medicationSummary: 'Metformina 850 mg · Losartán 50 mg',
  lastEncounterAt: '2026-02-10T10:00:00Z',
  lastEncounterRelativeEs: 'hace 4 meses',
  labHighlights: [
    {
      label: 'HbA1c',
      value: '7.4 %',
      observedAt: '2026-03-01T10:00:00Z',
      relativeAgeEs: 'hace 3 meses',
    },
  ],
  episodeOpen: true,
  careSettingLabel: 'Consulta ambulatoria',
};

describe('ClinicalContextDenseStrip (MF-DI-01)', () => {
  afterEach(() => cleanup());

  it('muestra problemas, meds, encuentro y labs con antigüedad', () => {
    render(<ClinicalContextDenseStrip dense={sampleDense} />);

    expect(screen.getByTestId('epis2-clinical-context-dense-strip')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-clinical-context-dense-strip-problems')).toHaveTextContent(
      'Hipertensión arterial · Diabetes mellitus tipo 2',
    );
    expect(screen.getByTestId('epis2-clinical-context-dense-strip-medications')).toHaveTextContent(
      'Metformina',
    );
    expect(screen.getByTestId('epis2-clinical-context-dense-strip-last-encounter')).toHaveTextContent(
      'hace 4 meses',
    );
    expect(screen.getByTestId('epis2-clinical-context-dense-strip-lab-hba1c')).toHaveTextContent(
      '7.4 % · hace 3 meses',
    );
    expect(screen.getByTestId('epis2-clinical-context-dense-strip-episode-open')).toHaveTextContent(
      copy.contextDense.episodeOpen,
    );
  });

  it('no renderiza si dense es null', () => {
    render(<ClinicalContextDenseStrip dense={null} />);
    expect(screen.queryByTestId('epis2-clinical-context-dense-strip')).not.toBeInTheDocument();
  });
});
