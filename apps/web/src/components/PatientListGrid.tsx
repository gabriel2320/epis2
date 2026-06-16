import type { PatientListRow } from '../api/clinicalApi.js';
import { copy } from '@epis2/design-system';
import { ClinicalDataGrid, type ClinicalGridColDef } from '@epis2/clinical-productivity';
import { EpisButton, EpisChip } from '@epis2/epis2-ui';
import { useMemo } from 'react';
import { getPrimaryNarrativeForDemoCode } from '../clinical/demoNarrativePresentation.js';
import {
  getDemoShiftCensusPresentation,
  resolveCensusPrimaryActionRoute,
} from '../clinical/demoShiftCensusPresentation.js';
import { useClinicalNavigate } from '../routes/clinicalNavigate.js';

export type PatientListGridProps = {
  rows: PatientListRow[];
  emptyMessage: string;
  onSelectPatient: (patientId: string) => void;
  censusNarrative?: boolean;
  'data-testid'?: string;
};

function censusDraftLabel(state: string | undefined): string {
  switch (state) {
    case 'draft':
      return copy.drafts.statusLabels.draft;
    case 'ready_for_review':
      return copy.drafts.statusLabels.ready_for_review;
    default:
      return copy.censusShift.draftNone;
  }
}

function censusRiskLabel(risk: string | undefined): string {
  switch (risk) {
    case 'warning':
      return copy.censusShift.riskWarning;
    case 'critical':
      return copy.censusShift.riskCritical;
    default:
      return copy.censusShift.riskNormal;
  }
}

function censusRiskChipColor(risk: string | undefined): 'default' | 'warning' | 'error' {
  switch (risk) {
    case 'warning':
      return 'warning';
    case 'critical':
      return 'error';
    default:
      return 'default';
  }
}

export function PatientListGrid({
  rows,
  emptyMessage,
  onSelectPatient,
  censusNarrative = false,
  'data-testid': testId,
}: PatientListGridProps) {
  const navigate = useClinicalNavigate();

  const columns = useMemo<ClinicalGridColDef[]>(() => {
    if (!censusNarrative) {
      return [
        {
          field: 'displayName',
          headerName: copy.dashboard.gridColumnPatient,
          flex: 1,
          minWidth: 180,
        },
        {
          field: 'demoEpisode',
          headerName: copy.dashboard.gridColumnDemoEpisode,
          flex: 1,
          minWidth: 200,
          valueGetter: (_value, row) => {
            const code = row.demoCaseCode ?? row.demoLabel;
            if (!code) return '—';
            return getPrimaryNarrativeForDemoCode(code)?.titleEs ?? code;
          },
        },
        {
          field: 'demoCaseCode',
          headerName: copy.dashboard.gridColumnDemoCase,
          width: 110,
          valueGetter: (_value, row) => row.demoCaseCode ?? row.demoLabel ?? '—',
        },
      ];
    }

    return [
      {
        field: 'displayName',
        headerName: copy.dashboard.gridColumnPatient,
        flex: 1,
        minWidth: 160,
      },
      {
        field: 'primaryAction',
        headerName: copy.dashboard.gridColumnPrimaryAction,
        width: 170,
        sortable: false,
        renderCell: ({ row }) => {
          const code = row.demoCaseCode ?? row.demoLabel;
          const presentation = getDemoShiftCensusPresentation(code);
          if (!presentation) return null;
          return (
            <EpisButton
              size="small"
              appearance="outlined"
              data-testid={`epis2-census-primary-action-${presentation.demoCaseCode}`}
              onClick={(event) => {
                event.stopPropagation();
                const route = resolveCensusPrimaryActionRoute(presentation, String(row.id));
                void navigate(route);
              }}
            >
              {presentation.primaryActionLabelEs}
            </EpisButton>
          );
        },
      },
      {
        field: 'demoEpisode',
        headerName: copy.dashboard.gridColumnDemoEpisode,
        flex: 1,
        minWidth: 180,
        valueGetter: (_value, row) => {
          const code = row.demoCaseCode ?? row.demoLabel;
          if (!code) return '—';
          return getPrimaryNarrativeForDemoCode(code)?.titleEs ?? code;
        },
      },
      {
        field: 'pendingLabel',
        headerName: copy.dashboard.gridColumnPending,
        flex: 1,
        minWidth: 160,
        valueGetter: (_value, row) => {
          const code = row.demoCaseCode ?? row.demoLabel;
          return getDemoShiftCensusPresentation(code)?.pendingLabelEs ?? '—';
        },
      },
      {
        field: 'lastEventEs',
        headerName: copy.dashboard.gridColumnLastEvent,
        flex: 1,
        minWidth: 200,
        valueGetter: (_value, row) => {
          const code = row.demoCaseCode ?? row.demoLabel;
          return getDemoShiftCensusPresentation(code)?.lastEventEs ?? '—';
        },
      },
      {
        field: 'draftState',
        headerName: copy.dashboard.gridColumnDraftState,
        width: 140,
        valueGetter: (_value, row) => {
          const code = row.demoCaseCode ?? row.demoLabel;
          return getDemoShiftCensusPresentation(code)?.draftState ?? 'none';
        },
        renderCell: ({ value }) => (
          <EpisChip size="small" variant="outlined" label={censusDraftLabel(String(value ?? ''))} />
        ),
        sortable: false,
      },
      {
        field: 'visualRisk',
        headerName: copy.dashboard.gridColumnStatus,
        width: 130,
        valueGetter: (_value, row) => {
          const code = row.demoCaseCode ?? row.demoLabel;
          return getDemoShiftCensusPresentation(code)?.visualRisk ?? 'normal';
        },
        renderCell: ({ value }) => (
          <EpisChip
            size="small"
            color={censusRiskChipColor(String(value ?? ''))}
            label={censusRiskLabel(String(value ?? ''))}
          />
        ),
        sortable: false,
      },
    ];
  }, [censusNarrative, navigate]);

  return (
    <ClinicalDataGrid
      rows={rows}
      columns={columns}
      emptyMessage={emptyMessage}
      hideFooter={rows.length <= 10}
      onRowClick={(row) => onSelectPatient(row.id)}
      {...(testId !== undefined ? { 'data-testid': testId } : {})}
    />
  );
}
