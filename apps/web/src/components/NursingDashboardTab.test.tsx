/**
 * @vitest-environment jsdom
 */
import type { NursingDashboardResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import { Epis2ThemeProvider } from '@epis2/epis2-ui';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { NursingDashboardTab } from './NursingDashboardTab.js';

const MAR_ID = 'f0000006-0000-4000-8000-000000000001';
const PATIENT_ID = 'a0000001-0000-4000-8000-000000000005';
const DRAFT_ID = 'd0000001-0000-4000-8000-000000000001';

const nursingBoard: NursingDashboardResponse = {
  readOnly: true,
  roleView: 'nurse',
  scheduledMar: [
    {
      id: MAR_ID,
      patientId: PATIENT_ID,
      patientDisplayName: 'Paciente DEMO-005',
      medication: 'Warfarina',
      doseText: '5 mg',
      route: 'VO',
      scheduledAt: new Date().toISOString(),
      windowStart: new Date(Date.now() - 60_000).toISOString(),
      windowEnd: new Date(Date.now() + 3_600_000).toISOString(),
      requiresDoubleCheck: true,
      status: 'scheduled',
    },
  ],
  nursingDrafts: [
    {
      id: DRAFT_ID,
      patientId: PATIENT_ID,
      patientDisplayName: 'Paciente DEMO-005',
      draftType: 'medication_administration',
      status: 'draft',
      title: 'MAR pendiente',
      updatedAt: new Date().toISOString(),
    },
  ],
  demoTasks: [
    { id: 'nurse-task-mar', label: 'Registrar administración MAR', commandSample: 'registrar mar' },
  ],
};

vi.mock('./WorklistDraftGrid.js', () => ({
  WorklistDraftGrid: ({
    rows,
    onOpenDraft,
    'data-testid': testId,
  }: {
    rows: { id: string; title: string }[];
    onOpenDraft: (id: string) => void;
    'data-testid'?: string;
  }) => (
    <div data-testid={testId}>
      {rows.map((row) => (
        <button key={row.id} type="button" onClick={() => onOpenDraft(row.id)}>
          {row.title}
        </button>
      ))}
    </div>
  ),
}));

vi.mock('./grids/DashboardHomogeneousGrid.js', () => ({
  DashboardHomogeneousGrid: ({
    rows,
    onRowClick,
    extraBulkActions,
    'data-testid': testId,
  }: {
    rows: { id: string; patientDisplayName?: string; medication?: string; patientId?: string }[];
    onRowClick?: (row: { id: string; patientId?: string }) => void;
    extraBulkActions?: (
      ids: readonly string[],
    ) => { id: string; label: string; onClick: () => void }[];
    'data-testid'?: string;
  }) => (
    <div data-testid={testId}>
      {rows.map((row) => (
        <div key={row.id} data-testid={`epis2-nursing-mar-${row.id}`}>
          <span>{row.medication}</span>
          {row.requiresDoubleCheck ? <span>{copy.inpatient.doubleCheckRequired}</span> : null}
          <button type="button" onClick={() => onRowClick?.(row)}>
            {copy.inpatient.openPatient}
          </button>
          {extraBulkActions ? (
            <button
              type="button"
              data-testid={`epis2-nursing-register-mar-${row.id}`}
              onClick={() => extraBulkActions([row.id])[0]?.onClick()}
            >
              {copy.inpatient.registerMar}
            </button>
          ) : null}
        </div>
      ))}
    </div>
  ),
}));

afterEach(() => cleanup());

describe('NursingDashboardTab', () => {
  it('muestra MAR programado con doble chequeo y abre paciente', async () => {
    const user = userEvent.setup();
    const onOpenPatient = vi.fn();

    render(
      <Epis2ThemeProvider>
        <NursingDashboardTab
          data={nursingBoard}
          onOpenPatient={onOpenPatient}
          onOpenDraft={vi.fn()}
        />
      </Epis2ThemeProvider>,
    );

    expect(screen.getByTestId('epis2-dashboard-nursing')).toBeInTheDocument();
    expect(screen.getByTestId(`epis2-nursing-mar-${MAR_ID}`)).toBeInTheDocument();
    expect(screen.getByText(/Warfarina/)).toBeInTheDocument();
    expect(screen.getByText(copy.inpatient.doubleCheckRequired)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: copy.inpatient.openPatient }));
    expect(onOpenPatient).toHaveBeenCalledWith(PATIENT_ID);
  });

  it('registra MAR abriendo formulario', async () => {
    const user = userEvent.setup();
    const onOpenMarForm = vi.fn();

    render(
      <Epis2ThemeProvider>
        <NursingDashboardTab
          data={nursingBoard}
          onOpenPatient={vi.fn()}
          onOpenDraft={vi.fn()}
          onOpenMarForm={onOpenMarForm}
        />
      </Epis2ThemeProvider>,
    );

    await user.click(screen.getByTestId(`epis2-nursing-register-mar-${MAR_ID}`));
    expect(onOpenMarForm).toHaveBeenCalledWith(PATIENT_ID);
  });

  it('lista borradores de enfermería y abre borrador', async () => {
    const user = userEvent.setup();
    const onOpenDraft = vi.fn();

    render(
      <Epis2ThemeProvider>
        <NursingDashboardTab
          data={nursingBoard}
          onOpenPatient={vi.fn()}
          onOpenDraft={onOpenDraft}
        />
      </Epis2ThemeProvider>,
    );

    expect(screen.getByTestId('epis2-nursing-drafts')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'MAR pendiente' }));
    expect(onOpenDraft).toHaveBeenCalledWith(DRAFT_ID);
  });
});
