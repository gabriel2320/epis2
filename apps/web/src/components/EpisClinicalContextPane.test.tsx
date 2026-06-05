/**
 * @vitest-environment jsdom
 */
import { copy } from '@epis2/design-system';
import { Epis2ThemeProvider } from '@epis2/epis2-ui';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { EpisClinicalContextPane } from './EpisClinicalContextPane.js';

const patientId = '00000000-0000-4000-8000-000000000099';

const { fetchPatientLongitudinal } = vi.hoisted(() => ({
  fetchPatientLongitudinal: vi.fn(),
}));

vi.mock('../api/clinicalApi.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../api/clinicalApi.js')>();
  return { ...actual, fetchPatientLongitudinal };
});

afterEach(() => cleanup());

describe('EpisClinicalContextPane', () => {
  it('muestra timeline, filtra por búsqueda e inserta fragmento', async () => {
    const user = userEvent.setup();
    const onInsert = vi.fn();
    fetchPatientLongitudinal.mockResolvedValue({
      patientId,
      readOnly: true,
      problems: [],
      allergies: [],
      medications: [],
      observations: [],
      documents: [],
      encounters: [],
      timeline: [
        {
          id: 'ev-1',
          kind: 'note',
          at: '2026-05-10T10:00:00.000Z',
          title: 'Evolución previa',
          detail: 'Meropenem 1 g c/8 h',
        },
        {
          id: 'ev-2',
          kind: 'observation',
          at: '2026-05-08T10:00:00.000Z',
          title: 'Laboratorio Hb',
          detail: '11.2 g/dL',
        },
      ],
    });

    render(
      <Epis2ThemeProvider>
        <EpisClinicalContextPane patientId={patientId} onInsertFragment={onInsert} />
      </Epis2ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('epis2-context-timeline-list')).toBeInTheDocument();
    });

    await user.type(screen.getByTestId('epis2-context-search'), 'Meropenem');
    expect(screen.getByText('Evolución previa')).toBeInTheDocument();
    expect(screen.queryByText('Laboratorio Hb')).not.toBeInTheDocument();

    await user.click(screen.getByText('Evolución previa'));
    expect(screen.getByText(copy.clinicalLayout.contextBackToList)).toBeInTheDocument();

    await user.click(screen.getByTestId('epis2-context-insert-chip'));
    expect(onInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        sourceEventId: 'ev-1',
        fieldId: 'plan',
        text: expect.stringContaining('Meropenem'),
      }),
    );
  });
});
