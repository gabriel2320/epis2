/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PrintA5Document, PrintField } from './PrintA5Document.js';

describe('PrintA5Document', () => {
  it('renderiza documento A5 con campos', () => {
    render(
      <PrintA5Document title="Certificado médico" subtitle="EPIS2 demo">
        <PrintField label="Diagnóstico" value="Reposo por influenza" />
      </PrintA5Document>,
    );
    expect(screen.getByTestId('epis2-print-a5-document')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-print-demo-watermark')).toBeInTheDocument();
    expect(screen.getByText('Certificado médico')).toBeInTheDocument();
    expect(screen.getByText('Reposo por influenza')).toBeInTheDocument();
  });
});
