/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PrintField } from './PrintA5Document.js';
import { PrintLetterDocument, PrintSection } from './PrintLetterDocument.js';

describe('PrintLetterDocument', () => {
  it('renderiza documento Carta con secciones, estado y campos', () => {
    render(
      <PrintLetterDocument
        title="Epicrisis"
        subtitle="Paciente demo"
        status="BORRADOR — NO VÁLIDO COMO DOCUMENTO CLÍNICO FIRMADO"
      >
        <PrintSection title="Diagnósticos">
          <PrintField label="Diagnóstico / motivo" value="Neumonía adquirida en comunidad" />
        </PrintSection>
      </PrintLetterDocument>,
    );
    expect(screen.getByTestId('epis2-print-letter-document')).toBeInTheDocument();
    expect(screen.getByText('Epicrisis')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-print-document-status')).toHaveTextContent('BORRADOR');
    expect(screen.getByTestId('epis2-print-section-Diagnósticos')).toBeInTheDocument();
    expect(screen.getByText('Neumonía adquirida en comunidad')).toBeInTheDocument();
  });
});
