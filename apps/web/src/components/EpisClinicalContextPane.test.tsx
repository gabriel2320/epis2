/**
 * @vitest-environment jsdom
 */
import { copy } from '@epis2/design-system';
import { Epis2ThemeProvider } from '@epis2/epis2-ui';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EpisClinicalContextPane } from './EpisClinicalContextPane.js';

const patientId = '00000000-0000-4000-8000-000000000099';

const { fetchPatientLongitudinal, searchPatientDocuments, suggestPatientSummary, fetchAiStatus } = vi.hoisted(
  () => ({
    fetchPatientLongitudinal: vi.fn(),
    searchPatientDocuments: vi.fn(),
    suggestPatientSummary: vi.fn(),
    fetchAiStatus: vi.fn(),
  }),
);

vi.mock('../api/clinicalApi.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../api/clinicalApi.js')>();
  return { ...actual, fetchPatientLongitudinal, searchPatientDocuments };
});

vi.mock('../api/aiApi.js', () => ({
  suggestPatientSummary,
  fetchAiStatus,
}));

const commandSubmit = vi.hoisted(() => vi.fn());

vi.mock('../clinical/useClinicalCommandSubmit.js', () => ({
  useClinicalCommandSubmit: () => ({ submit: commandSubmit }),
}));

vi.mock('../clinical/useCommandResolveContext.js', () => ({
  useCommandResolveContext: () => ({
    workspace: 'patient_chart',
    activeAlertCount: 1,
    pendingDraftCount: 0,
    traditionalSection: 'navMeds',
  }),
}));

vi.mock('../auth/AuthContext.js', () => ({
  useAuth: () => ({ session: { user: { role: 'physician' } } }),
}));

vi.mock('@epis2/epis2-ui', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@epis2/epis2-ui')>();
  return { ...actual, useEpisClinicalContextDragEnabled: () => true };
});

afterEach(() => cleanup());

describe('EpisClinicalContextPane', () => {
  beforeEach(() => {
    fetchAiStatus.mockResolvedValue({ available: true, readOnly: true });
    commandSubmit.mockReset();
  });

  it('muestra acciones sugeridas y ejecuta comando (MF-CM-05)', async () => {
    const user = userEvent.setup();
    fetchPatientLongitudinal.mockResolvedValue({
      patientId,
      readOnly: true,
      problems: [],
      allergies: [],
      medications: [],
      observations: [],
      documents: [],
      encounters: [],
      timeline: [],
    });

    render(
      <Epis2ThemeProvider>
        <EpisClinicalContextPane patientId={patientId} />
      </Epis2ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('epis2-context-ai-panel')).toBeInTheDocument();
    });

    const chip = await screen.findByTestId('epis2-context-suggest-reconcile_medications');
    await user.click(chip);
    expect(commandSubmit).toHaveBeenCalledWith('conciliacion medicamentosa');
  });

  it('muestra timeline, filtra por búsqueda e inserta fragmento', async () => {
    const user = userEvent.setup();
    const onInsert = vi.fn();
    fetchPatientLongitudinal.mockResolvedValue({
      patientId,
      readOnly: true,
      problems: [],
      allergies: [],
      medications: [],
      observations: [],
      documents: [],
      encounters: [],
      timeline: [
        {
          id: 'ev-1',
          kind: 'note',
          at: '2026-05-10T10:00:00.000Z',
          title: 'Evolución previa',
          detail: 'Meropenem 1 g c/8 h',
        },
        {
          id: 'ev-2',
          kind: 'observation',
          at: '2026-05-08T10:00:00.000Z',
          title: 'Laboratorio Hb',
          detail: '11.2 g/dL',
        },
      ],
    });

    render(
      <Epis2ThemeProvider>
        <EpisClinicalContextPane patientId={patientId} onInsertFragment={onInsert} />
      </Epis2ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('epis2-context-timeline-list')).toBeInTheDocument();
    });

    await user.type(screen.getByTestId('epis2-context-search'), 'Meropenem');
    expect(screen.getByText('Evolución previa')).toBeInTheDocument();
    expect(screen.queryByText('Laboratorio Hb')).not.toBeInTheDocument();

    await user.click(screen.getByText('Evolución previa'));
    expect(screen.getByText(copy.clinicalLayout.contextBackToList)).toBeInTheDocument();

    await user.click(screen.getByTestId('epis2-context-insert-chip'));
    expect(onInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        sourceEventId: 'ev-1',
        fieldId: 'plan',
        text: expect.stringContaining('Meropenem'),
      }),
    );
  });

  it('filtra timeline por kind (MF-TE-06)', async () => {
    const user = userEvent.setup();
    fetchPatientLongitudinal.mockResolvedValue({
      patientId,
      readOnly: true,
      problems: [],
      allergies: [],
      medications: [],
      observations: [],
      documents: [],
      encounters: [],
      timeline: [
        {
          id: 'ev-note',
          kind: 'note',
          at: '2026-05-10T10:00:00.000Z',
          title: 'Nota clínica',
          detail: 'Detalle',
        },
        {
          id: 'ev-lab',
          kind: 'observation',
          at: '2026-05-08T10:00:00.000Z',
          title: 'Laboratorio',
          detail: 'Hb',
        },
      ],
    });

    render(
      <Epis2ThemeProvider>
        <EpisClinicalContextPane patientId={patientId} />
      </Epis2ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('epis2-context-timeline-kind-filters')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('epis2-context-kind-observation'));
    expect(screen.getByText('Laboratorio')).toBeInTheDocument();
    expect(screen.queryByText('Nota clínica')).not.toBeInTheDocument();
  });

  it('marca filas de timeline como draggable en desktop', async () => {
    fetchPatientLongitudinal.mockResolvedValue({
      patientId,
      readOnly: true,
      problems: [],
      allergies: [],
      medications: [],
      observations: [],
      documents: [],
      encounters: [],
      timeline: [
        {
          id: 'ev-drag',
          kind: 'note',
          at: '2026-05-10T10:00:00.000Z',
          title: 'Nota arrastrable',
          detail: 'Detalle',
        },
      ],
    });

    render(
      <Epis2ThemeProvider>
        <EpisClinicalContextPane patientId={patientId} onInsertFragment={vi.fn()} />
      </Epis2ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('epis2-context-timeline-item-ev-drag')).toBeInTheDocument();
    });

    const row = screen.getByTestId('epis2-context-timeline-item-ev-drag');
    expect(row).toHaveAttribute('draggable', 'true');
  });

  it('muestra pestaña de documentos con búsqueda acotada al paciente', async () => {
    const user = userEvent.setup();
    fetchPatientLongitudinal.mockResolvedValue({
      patientId,
      readOnly: true,
      problems: [],
      allergies: [],
      medications: [],
      observations: [],
      documents: [],
      encounters: [],
      timeline: [],
    });
    searchPatientDocuments.mockResolvedValue({
      readOnly: true,
      patientId,
      query: 'laboratorio',
      hits: [
        {
          id: 'doc-tab',
          title: 'Informe lab',
          documentType: 'lab_report',
          storageRef: 'ref',
          snippet: 'Resultado',
        },
      ],
    });

    render(
      <Epis2ThemeProvider>
        <EpisClinicalContextPane patientId={patientId} />
      </Epis2ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('epis2-context-tabs')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('epis2-context-tab-documents'));
    await user.type(screen.getByTestId('epis2-context-documents-search'), 'laboratorio');

    await waitFor(() => {
      expect(searchPatientDocuments).toHaveBeenCalledWith(patientId, 'laboratorio');
      expect(screen.getByText('Informe lab')).toBeInTheDocument();
    });
  });

  it('genera resumen de periodo bajo demanda', async () => {
    const user = userEvent.setup();
    fetchPatientLongitudinal.mockResolvedValue({
      patientId,
      readOnly: true,
      problems: [],
      allergies: [],
      medications: [],
      observations: [],
      documents: [],
      encounters: [],
      timeline: [],
    });
    suggestPatientSummary.mockResolvedValue({
      readOnly: true,
      requiresHumanReview: true,
      summaryText: 'Síntesis demo del periodo',
      source: 'longitudinal_retrieval',
      eventCount: 0,
      aiAvailable: false,
    });

    render(
      <Epis2ThemeProvider>
        <EpisClinicalContextPane patientId={patientId} />
      </Epis2ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('epis2-period-summary-action')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('epis2-period-summary-action'));

    await waitFor(() => {
      expect(screen.getByText('Síntesis demo del periodo')).toBeInTheDocument();
    });
    expect(screen.getByTestId('epis2-ai-disclosure')).toBeInTheDocument();
  });
});
