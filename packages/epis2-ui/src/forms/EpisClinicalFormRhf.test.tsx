/**
 * @vitest-environment jsdom
 */
import { getBlueprintById, initialFormValues } from '@epis2/clinical-forms';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FormProvider } from 'react-hook-form';
import { Epis2ThemeProvider } from '../providers/Epis2ThemeProvider.js';
import { EpisClinicalFormRhf } from './EpisClinicalFormRhf.js';
import { useEpisClinicalBlueprintForm } from './useEpisClinicalBlueprintForm.js';

const evolutionNoteBlueprint = getBlueprintById('evolution_note')!;
const nursingNoteBlueprint = getBlueprintById('nursing_note')!;

function RhfFormHarness({
  blueprint,
  clinicalProse = false,
  collapseNonPrimarySections = false,
}: {
  blueprint: typeof evolutionNoteBlueprint;
  clinicalProse?: boolean;
  collapseNonPrimarySections?: boolean;
}) {
  const form = useEpisClinicalBlueprintForm({
    blueprint,
    seed: initialFormValues(blueprint),
  });
  return (
    <FormProvider {...form}>
      <EpisClinicalFormRhf
        blueprint={blueprint}
        clinicalProse={clinicalProse}
        collapseNonPrimarySections={collapseNonPrimarySections}
      />
    </FormProvider>
  );
}

describe('EpisClinicalFormRhf', () => {
  it('renderiza campos del blueprint de evolución con RHF', () => {
    render(
      <Epis2ThemeProvider>
        <RhfFormHarness blueprint={evolutionNoteBlueprint} />
      </Epis2ThemeProvider>,
    );
    expect(screen.getByTestId('epis2-form-evolution_note')).toBeInTheDocument();
    expect(screen.getByText(/Fecha del encuentro/)).toBeInTheDocument();
    expect(screen.getByLabelText('Subjetivo')).toBeInTheDocument();
    expect(screen.getByLabelText('Plan')).toBeInTheDocument();
  });

  it('aplica prosa clínica 65ch en textareas', () => {
    const { container } = render(
      <Epis2ThemeProvider>
        <RhfFormHarness blueprint={evolutionNoteBlueprint} clinicalProse />
      </Epis2ThemeProvider>,
    );
    const subjective = container.querySelector('[data-testid="epis2-field-subjective"]');
    expect(subjective).toBeTruthy();
    const proseStack = subjective?.closest('.MuiStack-root');
    expect(proseStack).toHaveStyle({ maxWidth: '65ch' });
  });

  it('renderiza grid M3 con celdas proporcionales en signos vitales', () => {
    render(
      <Epis2ThemeProvider>
        <RhfFormHarness blueprint={nursingNoteBlueprint} />
      </Epis2ThemeProvider>,
    );

    expect(screen.getByTestId('epis2-form-section-grid-vitals')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-form-field-cell-bloodPressure')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-form-field-cell-heartRate')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-form-field-cell-temperature')).toBeInTheDocument();
  });
});
