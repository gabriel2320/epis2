/**
 * @vitest-environment jsdom
 */
import { copy } from '@epis2/design-system';
import { Epis2ThemeProvider } from '@epis2/epis2-ui';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { writePrintPreview } from '../clinical/printPreviewStorage.js';
import { DischargeSummaryPrintPage } from './DischargeSummaryPrintPage.js';

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

describe('DischargeSummaryPrintPage', () => {
  it('renderiza vista Carta con secciones y valores de preview', async () => {
    writePrintPreview('discharge_summary', {
      diagnoses: 'Neumonía adquirida en comunidad',
      dischargeDate: '2026-06-09',
      hospitalizationSummary: 'Hospitalización de 5 días con buena evolución',
      evolution: 'Afebril desde el día 3',
      dischargeMedications: 'Amoxicilina 500 mg c/8 h por 7 días',
      instructions: 'Reposo relativo, control de temperatura',
      followUpPlan: 'Control con médico tratante en 7 días',
    });

    render(
      <Epis2ThemeProvider>
        <DischargeSummaryPrintPage />
      </Epis2ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('epis2-discharge-summary-print-page')).toBeInTheDocument();
    });
    expect(screen.getByTestId('epis2-print-letter-document')).toBeInTheDocument();
    expect(screen.getByText(copy.print.dischargeSummaryTitle)).toBeInTheDocument();
    expect(screen.getByTestId('epis2-print-document-status')).toHaveTextContent('BORRADOR');
    expect(screen.getByText('Neumonía adquirida en comunidad')).toBeInTheDocument();
    expect(screen.getByText('Amoxicilina 500 mg c/8 h por 7 días')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-print-execute')).toBeInTheDocument();
  });
});
