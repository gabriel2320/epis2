import type { PatientLongitudinalResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import {
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
import { CicaPatientBlueprintPage } from './CicaPatientBlueprintPage.js';
import { PATIENT_DOCUMENTS_BLUEPRINT } from './blueprints/patientScreens.blueprint.js';
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
  const { patientId, longitudinal, go } = page;

  if (!patientId) return null;

  const actions: ClinicalLayoutAction[] = [
    {
      id: 'new-document',
      label: 'Nuevo documento',
      kind: 'primary',
      onClick: () => go('new-document', { patientId }),
    },
  ];

  return (
    <CicaPatientBlueprintPage
      blueprint={PATIENT_DOCUMENTS_BLUEPRINT}
      actions={actions}
      testId="cica-patient-documents-screen"
      slots={{
        documents: <CicaDocumentList timeline={longitudinal?.timeline ?? []} />,
      }}
    />
  );
}
