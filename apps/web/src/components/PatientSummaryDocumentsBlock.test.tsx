/**
 * @vitest-environment jsdom
 */
import { copy } from '@epis2/design-system';
import { Epis2ThemeProvider } from '@epis2/epis2-ui';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PatientSummaryDocumentsBlock } from './PatientSummaryDocumentsBlock.js';

afterEach(() => cleanup());

describe('PatientSummaryDocumentsBlock', () => {
  it('lista documentos y abre índice completo', async () => {
    const user = userEvent.setup();
    const onView = vi.fn();

    render(
      <Epis2ThemeProvider>
        <PatientSummaryDocumentsBlock
          documents={[
            {
              id: 'e1',
              title: 'Informe laboratorio control HTA (demo)',
              documentType: 'lab_report',
              mimeType: 'application/pdf',
              storageRef: 'demo://documents/demo-001-lab.pdf',
            },
          ]}
          onViewDocumentIndex={onView}
        />
      </Epis2ThemeProvider>,
    );

    expect(screen.getByTestId('epis2-ficha-documents')).toBeInTheDocument();
    expect(screen.getByText('Informe laboratorio control HTA (demo)')).toBeInTheDocument();
    expect(screen.getByText(copy.tree.documentTypes.lab_report)).toBeInTheDocument();

    await user.click(screen.getByTestId('epis2-ficha-open-documents-index'));
    expect(onView).toHaveBeenCalledOnce();
  });

  it('muestra vacío cuando no hay documentos', () => {
    render(
      <Epis2ThemeProvider>
        <PatientSummaryDocumentsBlock documents={[]} onViewDocumentIndex={() => undefined} />
      </Epis2ThemeProvider>,
    );

    expect(screen.getAllByText(copy.longitudinal.emptySection).length).toBeGreaterThan(0);
  });
});
