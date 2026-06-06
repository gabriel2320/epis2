/**
 * @vitest-environment jsdom
 */
import type { QualityDashboardResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import { Epis2ThemeProvider } from '@epis2/epis2-ui';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { QualityDashboardTab } from './QualityDashboardTab.js';

const qualityBoard: QualityDashboardResponse = {
  readOnly: true,
  recentAudit: [
    {
      id: 'a0000001-0000-4000-8000-000000000099',
      eventType: 'draft.approved',
      at: new Date().toISOString(),
      username: 'medico.demo',
      entityType: 'clinical_draft',
      entityId: 'd0000001-0000-4000-8000-000000000001',
      message: 'Evolución aprobada',
    },
  ],
  stagingBatches: [
    {
      id: 'b0000001-0000-4000-8000-000000000001',
      sourceSystem: 'FHIR',
      batchLabel: 'DEMO-005 bundle',
      status: 'staged',
      recordCount: 12,
      stagedAt: new Date().toISOString(),
    },
  ],
  metrics: {
    openDrafts: 3,
    approvedNotes: 8,
    aiRuns: 2,
    criticalUnacked: 1,
  },
  ops: {
    schemaVersion: 'epis2-v4-interop',
    counts: {
      patients: 5,
      openDrafts: 3,
      approvedNotes: 8,
      auditEvents24h: 14,
    },
    fhir: { exportEnabled: true, importEnabled: false },
    hardening: {
      rlsMode: 'off',
      rlsProtectedTables: ['clinical_drafts'],
      rateLimitLogin: true,
      rateLimitAi: true,
      rateLimitCommands: true,
      backupCommand: 'npm run db:backup',
      authMode: 'demo',
      rlsTransactions: false,
    },
  },
};

const { validateHl7Message } = vi.hoisted(() => ({
  validateHl7Message: vi.fn(),
}));

vi.mock('../api/opsApi.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../api/opsApi.js')>();
  return { ...actual, validateHl7Message };
});

vi.mock('./QualityDashboardGrids.js', () => ({
  QualityDashboardGrids: () => <div data-testid="epis2-quality-grids-mock" />,
}));

afterEach(() => cleanup());

describe('QualityDashboardTab', () => {
  it('muestra métricas ops read-only y grids de calidad', () => {
    render(
      <Epis2ThemeProvider>
        <QualityDashboardTab data={qualityBoard} />
      </Epis2ThemeProvider>,
    );

    expect(screen.getByTestId('epis2-dashboard-quality')).toBeInTheDocument();
    expect(screen.getByText(copy.dashboard.tabQuality)).toBeInTheDocument();
    expect(screen.getByText(/Pacientes: 5/)).toBeInTheDocument();
    expect(screen.getByText(/IA runs: 2/)).toBeInTheDocument();
    expect(screen.getByTestId('epis2-quality-grids-mock')).toBeInTheDocument();
  });

  it('valida mensaje HL7 demo y muestra resultado', async () => {
    const user = userEvent.setup();
    validateHl7Message.mockResolvedValue({
      readOnly: true,
      valid: true,
      messageType: 'ADT^A01',
      errors: [],
    });

    render(
      <Epis2ThemeProvider>
        <QualityDashboardTab data={qualityBoard} />
      </Epis2ThemeProvider>,
    );

    await user.click(screen.getByTestId('epis2-hl7-validate-run'));

    await waitFor(() => {
      expect(validateHl7Message).toHaveBeenCalled();
      expect(screen.getByText(/Mensaje HL7 válido/)).toBeInTheDocument();
    });
  });
});
