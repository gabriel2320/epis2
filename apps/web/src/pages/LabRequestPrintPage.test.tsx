/**
 * @vitest-environment jsdom
 */
import { copy } from '@epis2/design-system';
import { Epis2ThemeProvider } from '@epis2/epis2-ui';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { writePrintPreview } from '../clinical/printPreviewStorage.js';
import { LabRequestPrintPage } from './LabRequestPrintPage.js';

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

describe('LabRequestPrintPage', () => {
  it('renderiza vista A5 con valores de preview y prioridad explícita', async () => {
    writePrintPreview('lab_request', {
      scheduledDate: '2026-06-10',
      labTests: 'Hemograma completo, perfil bioquímico',
      clinicalReason: 'Control postoperatorio',
      priority: 'urgente',
    });

    render(
      <Epis2ThemeProvider>
        <LabRequestPrintPage />
      </Epis2ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('epis2-lab-request-print-page')).toBeInTheDocument();
    });
    expect(screen.getByTestId('epis2-print-a5-document')).toBeInTheDocument();
    expect(screen.getByText(copy.print.labRequestTitle)).toBeInTheDocument();
    expect(screen.getByText('Hemograma completo, perfil bioquímico')).toBeInTheDocument();
    expect(screen.getByText('URGENTE')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-print-execute')).toBeInTheDocument();
  });
});
