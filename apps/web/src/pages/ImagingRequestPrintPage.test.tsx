/**
 * @vitest-environment jsdom
 */
import { copy } from '@epis2/design-system';
import { Epis2ThemeProvider } from '@epis2/epis2-ui';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { writePrintPreview } from '../clinical/printPreviewStorage.js';
import { ImagingRequestPrintPage } from './ImagingRequestPrintPage.js';

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

describe('ImagingRequestPrintPage', () => {
  it('renderiza vista A5 con modalidad y estudio', async () => {
    writePrintPreview('imaging_request', {
      scheduledDate: '2026-06-11',
      modality: 'TC',
      studyDescription: 'TC de tórax sin contraste',
      clinicalIndication: 'Sospecha de neumonía complicada',
      priority: 'rutina',
    });

    render(
      <Epis2ThemeProvider>
        <ImagingRequestPrintPage />
      </Epis2ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('epis2-imaging-request-print-page')).toBeInTheDocument();
    });
    expect(screen.getByTestId('epis2-print-a5-document')).toBeInTheDocument();
    expect(screen.getByText(copy.print.imagingRequestTitle)).toBeInTheDocument();
    expect(screen.getByText('TC de tórax sin contraste')).toBeInTheDocument();
    expect(screen.getByText('Rutina')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-print-execute')).toBeInTheDocument();
  });
});
