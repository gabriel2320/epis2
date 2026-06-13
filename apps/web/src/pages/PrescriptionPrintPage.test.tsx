/**
 * @vitest-environment jsdom
 */
import { copy } from '@epis2/design-system';
import { Epis2ThemeProvider } from '@epis2/epis2-ui';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { writePrintPreview } from '../clinical/printPreviewStorage.js';
import { PrescriptionPrintPage } from './PrescriptionPrintPage.js';

vi.mock('@tanstack/react-router', () => ({
  useSearch: () => ({ patientId: 'a0000001-0000-4000-8000-000000000001' }),
  useNavigate: () => vi.fn(),
}));

vi.mock('../routes/clinicalNavigate.js', () => ({
  useClinicalNavigate: () => vi.fn(),
}));

vi.mock('../auth/AuthContext.js', () => ({
  useAuth: () => ({
    session: {
      user: { displayName: 'Dra. Ana Demo', role: 'physician' },
    },
  }),
}));

vi.mock('../api/clinicalApi.js', () => ({
  fetchPatientDetail: vi.fn().mockResolvedValue({
    patient: {
      id: 'a0000001-0000-4000-8000-000000000001',
      displayName: 'Paciente Demo — Carmen Soto',
    },
    clinicalContext: { summaryFields: {} },
    notes: [],
  }),
}));

afterEach(() => cleanup());

describe('PrescriptionPrintPage', () => {
  it('renderiza vista A5 con valores de preview', async () => {
    writePrintPreview('prescription', {
      medication: 'Paracetamol 500 mg',
      dose: '1 comprimido',
      quantity: '20',
      route: 'oral|Oral',
      frequency: 'c/8 h',
      duration: '5 días',
      patientInstructions: 'Tomar con alimentos',
    });

    render(
      <Epis2ThemeProvider>
        <PrescriptionPrintPage />
      </Epis2ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('epis2-prescription-print-page')).toBeInTheDocument();
    });
    expect(screen.getByTestId('epis2-print-a5-document')).toBeInTheDocument();
    expect(screen.getByText(copy.print.prescriptionTitle)).toBeInTheDocument();
    expect(screen.getByText('Paracetamol 500 mg')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-print-execute')).toBeInTheDocument();
  });
});
