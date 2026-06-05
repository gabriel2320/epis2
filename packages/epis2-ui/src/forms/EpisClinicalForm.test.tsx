/**
 * @vitest-environment jsdom
 */
import { getBlueprintById, initialFormValues } from '@epis2/clinical-forms';

const evolutionNoteBlueprint = getBlueprintById('evolution_note')!;
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
});
