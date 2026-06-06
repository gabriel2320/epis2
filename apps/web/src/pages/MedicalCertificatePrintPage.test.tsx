/**
 * @vitest-environment jsdom
 */
import { copy } from '@epis2/design-system';
import { Epis2ThemeProvider } from '@epis2/epis2-ui';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { writePrintPreview } from '../clinical/printPreviewStorage.js';
import { MedicalCertificatePrintPage } from './MedicalCertificatePrintPage.js';

vi.mock('@tanstack/react-router', () => ({
  useSearch: () => ({ patientId: 'a0000001-0000-4000-8000-000000000001' }),
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

describe('MedicalCertificatePrintPage', () => {
  it('renderiza vista A5 con valores de preview', async () => {
    writePrintPreview('medical_certificate', {
      certificateType: 'reposo|Certificado de reposo',
      diagnosisSummary: 'Influenza leve',
      restDays: '3',
      validFrom: '2026-06-01',
      validUntil: '2026-06-04',
      instructions: 'Reposo domiciliario',
    });

    render(
      <Epis2ThemeProvider>
        <MedicalCertificatePrintPage />
      </Epis2ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('epis2-medical-certificate-print-page')).toBeInTheDocument();
    });
    expect(screen.getByTestId('epis2-print-a5-document')).toBeInTheDocument();
    expect(screen.getByText(copy.print.medicalCertificateTitle)).toBeInTheDocument();
    expect(screen.getByText('Influenza leve')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-print-execute')).toBeInTheDocument();
  });
});
