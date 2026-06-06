/**
 * @vitest-environment jsdom
 */
import { copy } from '@epis2/design-system';
import { Epis2ThemeProvider } from '@epis2/epis2-ui';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DocumentSearchPanel } from './DocumentSearchPanel.js';

const patientId = '00000000-0000-4000-8000-000000000001';

const { intakePatientDocument, runDocumentOcr, searchPatientDocuments } = vi.hoisted(() => ({
  intakePatientDocument: vi.fn(),
  runDocumentOcr: vi.fn(),
  searchPatientDocuments: vi.fn(),
}));

vi.mock('../api/clinicalApi.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../api/clinicalApi.js')>();
  return { ...actual, intakePatientDocument, runDocumentOcr, searchPatientDocuments };
});

afterEach(() => cleanup());

describe('DocumentSearchPanel', () => {
  it('intake imagen muestra OCR demo y reindexa tras ejecutar', async () => {
    const user = userEvent.setup();
    intakePatientDocument.mockResolvedValue({
      document: {
        id: 'doc-ocr-1',
        title: 'Imagen lab',
        documentType: 'image',
        storageRef: 'demo://x',
        intakeStatus: 'ocr_pending',
        chunkCount: 0,
        requiresHumanReview: true,
        ocrPending: true,
      },
    });
    runDocumentOcr.mockResolvedValue({
      documentId: 'doc-ocr-1',
      chunkCount: 2,
      requiresHumanReview: true,
    });
    searchPatientDocuments.mockResolvedValue({
      readOnly: true,
      patientId,
      query: 'laboratorio',
      searchMode: 'semantic',
      hits: [
        {
          id: 'doc-ocr-1',
          title: 'Imagen lab',
          documentType: 'image',
          storageRef: 'demo://x',
          snippet: 'Texto extraído demo',
        },
      ],
    });

    render(
      <Epis2ThemeProvider>
        <DocumentSearchPanel patientId={patientId} />
      </Epis2ThemeProvider>,
    );

    await user.click(screen.getByRole('combobox', { name: /tipo/i }));
    await user.click(
      await screen.findByRole('option', { name: copy.longitudinal.intakeTypeImage }),
    );
    await user.click(screen.getByRole('button', { name: copy.longitudinal.intakeSubmit }));

    await waitFor(() => {
      expect(screen.getByTestId('epis2-document-ocr-run')).toBeInTheDocument();
    });
    expect(screen.getByText(copy.longitudinal.ocrPendingHint)).toBeInTheDocument();

    await user.click(screen.getByTestId('epis2-document-ocr-run'));

    await waitFor(() => {
      expect(runDocumentOcr).toHaveBeenCalledWith(patientId, 'doc-ocr-1');
      expect(screen.getByText(copy.longitudinal.ocrSuccess)).toBeInTheDocument();
    });
  });
});
