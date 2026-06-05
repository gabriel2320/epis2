/**
 * @vitest-environment jsdom
 */
import { copy } from '@epis2/design-system';
import { Epis2ThemeProvider } from '@epis2/epis2-ui';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { EpisClinicalContextDocuments } from './EpisClinicalContextDocuments.js';

const patientId = '00000000-0000-4000-8000-000000000099';

const { searchPatientDocuments } = vi.hoisted(() => ({
  searchPatientDocuments: vi.fn(),
}));

vi.mock('../api/clinicalApi.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../api/clinicalApi.js')>();
  return { ...actual, searchPatientDocuments };
});

afterEach(() => cleanup());

describe('EpisClinicalContextDocuments', () => {
  it('busca documentos con debounce e inserta fragmento', async () => {
    const user = userEvent.setup();
    const onInsert = vi.fn();
    searchPatientDocuments.mockResolvedValue({
      readOnly: true,
      patientId,
      query: 'hemoglobina',
      searchMode: 'keyword',
      hits: [
        {
          id: 'doc-1',
          title: 'Laboratorio Hb',
          documentType: 'lab_report',
          storageRef: 'ref-1',
          snippet: 'Hb 11.2 g/dL',
        },
      ],
    });

    render(
      <Epis2ThemeProvider>
        <EpisClinicalContextDocuments patientId={patientId} onInsertFragment={onInsert} />
      </Epis2ThemeProvider>,
    );

    await user.type(screen.getByTestId('epis2-context-documents-search'), 'hemoglobina');

    await waitFor(() => {
      expect(searchPatientDocuments).toHaveBeenCalledWith(patientId, 'hemoglobina');
    });

    await waitFor(() => {
      expect(screen.getByTestId('epis2-context-document-item-doc-1')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('epis2-context-document-item-doc-1'));
    await user.click(screen.getByTestId('epis2-context-doc-insert-chip'));

    expect(onInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        sourceEventId: 'doc-1',
        text: expect.stringContaining('Hb 11.2'),
      }),
    );
    expect(screen.getByText(copy.clinicalLayout.contextBackToList)).toBeInTheDocument();
  });
});
