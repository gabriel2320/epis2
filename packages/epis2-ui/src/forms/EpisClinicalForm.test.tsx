/**
 * @vitest-environment jsdom
 */
import { getBlueprintById, initialFormValues } from '@epis2/clinical-forms';

const evolutionNoteBlueprint = getBlueprintById('evolution_note')!;
const nursingNoteBlueprint = getBlueprintById('nursing_note')!;
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Epis2ThemeProvider } from '../providers/Epis2ThemeProvider.js';
import { EpisClinicalForm } from './EpisClinicalForm.js';

describe('EpisClinicalForm', () => {
  it('renderiza campos del blueprint de evolución', () => {
    render(
      <Epis2ThemeProvider>
        <EpisClinicalForm
          blueprint={evolutionNoteBlueprint}
          values={initialFormValues(evolutionNoteBlueprint)}
          onChange={vi.fn()}
        />
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
        <EpisClinicalForm
          blueprint={evolutionNoteBlueprint}
          values={initialFormValues(evolutionNoteBlueprint)}
          clinicalProse
          onChange={vi.fn()}
        />
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
        <EpisClinicalForm
          blueprint={nursingNoteBlueprint}
          values={initialFormValues(nursingNoteBlueprint)}
          onChange={vi.fn()}
        />
      </Epis2ThemeProvider>,
    );

    expect(screen.getByTestId('epis2-form-section-grid-vitals')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-form-field-cell-bloodPressure')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-form-field-cell-heartRate')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-form-field-cell-temperature')).toBeInTheDocument();
  });
});
