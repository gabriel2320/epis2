/**
 * @vitest-environment jsdom
 */
import { getBlueprintById } from '@epis2/clinical-forms';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Epis2ThemeProvider } from '../providers/Epis2ThemeProvider.js';
import { CLINICAL_CONTEXT_DRAG_MIME, serializeClinicalContextDrag } from './clinical-context-dnd.js';
import { EpisClinicalField } from './EpisClinicalField.js';

afterEach(() => cleanup());

describe('EpisClinicalField clinical drop', () => {
  it('acepta drop en textarea y notifica payload', () => {
    const onClinicalDrop = vi.fn();
    const planField = getBlueprintById('evolution_note')!.fields.find((f) => f.id === 'plan')!;

    render(
      <Epis2ThemeProvider>
        <EpisClinicalField
          field={planField}
          value=""
          clinicalDropEnabled
          onClinicalDrop={onClinicalDrop}
          onChange={vi.fn()}
        />
      </Epis2ThemeProvider>,
    );

    const dropZone = screen.getByTestId('epis2-field-drop-plan');
    const payload = { text: 'Fragmento clínico', sourceEventId: 'ev-42' };
    fireEvent.dragOver(dropZone, {
      dataTransfer: { types: [CLINICAL_CONTEXT_DRAG_MIME], dropEffect: 'copy' },
    });
    fireEvent.drop(dropZone, {
      dataTransfer: {
        getData: (type: string) =>
          type === CLINICAL_CONTEXT_DRAG_MIME ? serializeClinicalContextDrag(payload) : '',
      },
    });

    expect(onClinicalDrop).toHaveBeenCalledWith('plan', payload);
  });
});
