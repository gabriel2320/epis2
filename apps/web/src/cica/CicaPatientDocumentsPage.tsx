import type { PatientLongitudinalResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import {
  CicaPatientScreenFrame,
  EpisM3Text,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  type ClinicalLayoutAction,
} from '@epis2/epis2-ui';
import { useMemo } from 'react';
import { filterAndGroupClinicalTimeline } from '../components/chart/timeline/clinicalTimeline.js';
import { ErrorState } from '../components/ErrorState.js';
import { useCicaPatientPage } from './hooks/useCicaPatientPage.js';

function formatEventAt(at: string): string {
  return new Date(at).toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' });
}

function documentTypeLabel(documentType: string | undefined): string {
  if (!documentType) return '';
  const labels = copy.tree.documentTypes as Record<string, string>;
  return labels[documentType] ?? labels.other ?? documentType;
}

type CicaDocumentListProps = {
  timeline: PatientLongitudinalResponse['timeline'];
  testId?: string;
};

/** Lista cronológica de documentos — agrupada por periodo, sin grid administrativo. */
function CicaDocumentList({ timeline, testId = 'cica-documents-list' }: CicaDocumentListProps) {
  const grouped = useMemo(() => filterAndGroupClinicalTimeline(timeline, 'documents'), [timeline]);

  if (grouped.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" data-testid={testId}>
        {copy.longitudinal.emptySection}
      </Typography>
    );
  }

  return (
    <Stack spacing={2} data-testid={testId} data-cica-composition="classic">
      {grouped.map((group) => (
        <Stack key={group.bucket} spacing={1} data-testid={`${testId}-period-${group.bucket}`}>
          <EpisM3Text role="labelMedium" component="h3" color="text.secondary">
            {group.label}
          </EpisM3Text>
          <List dense disablePadding>
            {group.events.map((event) => {
              const typeLabel = documentTypeLabel(event.detail);
              const secondary = typeLabel
                ? `${formatEventAt(event.at)} — ${typeLabel}`
                : formatEventAt(event.at);

              return (
                <ListItem
                  key={event.id}
                  disablePadding
                  data-testid={`${testId}-event-${event.id}`}
                  sx={{ py: 0.75 }}
                >
                  <ListItemText primary={event.title} secondary={secondary} />
                </ListItem>
              );
            })}
          </List>
        </Stack>
      ))}
    </Stack>
  );
}

/** CICA Clean Room — documentos (/app/pacientes/:patientId/documentos). */
export function CicaPatientDocumentsPage() {
  const page = useCicaPatientPage();
  const { patientId, detailQuery, presentation, longitudinal, goPath, go } = page;

  if (!patientId || !presentation) return null;

  if (detailQuery.isError) {
    return (
      <ErrorState
        title={copy.errors.genericTitle}
        message={copy.errors.genericMessage}
        onRetry={() => detailQuery.refetch()}
      />
    );
  }

  if (!detailQuery.data) return null;

  const actions: ClinicalLayoutAction[] = [
    {
      id: 'new-document',
      label: 'Nuevo documento',
      kind: 'primary',
      onClick: () => go('new-document', { patientId }),
    },
  ];

  return (
    <CicaPatientScreenFrame
      screenId="patient-documents"
      patientId={patientId}
      activeTabId={page.activeTabId}
      onNavigate={goPath}
      identity={presentation.identity}
      contextItems={presentation.contextItems}
      actions={actions}
      testId="cica-patient-documents-screen"
    >
      <CicaDocumentList timeline={longitudinal?.timeline ?? []} />
    </CicaPatientScreenFrame>
  );
}
