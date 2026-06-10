import type { PatientLongitudinalResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import {
  Button,
  EpisWorkspaceSection,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@epis2/epis2-ui';

export type PatientSummaryDocumentsBlockProps = {
  documents: PatientLongitudinalResponse['documents'];
  onViewDocumentIndex?: () => void;
  maxItems?: number;
};

function documentTypeLabel(documentType: string): string {
  const labels = copy.tree.documentTypes as Record<string, string>;
  return labels[documentType] ?? labels.other ?? documentType;
}

/** Resumen compacto de documentos — visible en ficha sin abrir historial (Ola 3 / UX-B.2). */
export function PatientSummaryDocumentsBlock({
  documents,
  onViewDocumentIndex,
  maxItems = 2,
}: PatientSummaryDocumentsBlockProps) {
  return (
    <EpisWorkspaceSection title={copy.activePatient.documentsTitle} testId="epis2-ficha-documents">
      <Stack spacing={1}>
        {documents.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {copy.longitudinal.emptySection}
          </Typography>
        ) : (
          <List dense disablePadding>
            {documents.slice(0, maxItems).map((doc) => (
              <ListItem key={doc.id} disablePadding>
                <ListItemText primary={doc.title} secondary={documentTypeLabel(doc.documentType)} />
              </ListItem>
            ))}
          </List>
        )}

        {onViewDocumentIndex ? (
          <Button
            size="small"
            variant="outlined"
            onClick={onViewDocumentIndex}
            data-testid="epis2-ficha-open-documents-index"
            sx={{ alignSelf: 'flex-start' }}
          >
            {copy.activePatient.viewDocumentsIndex}
          </Button>
        ) : null}
      </Stack>
    </EpisWorkspaceSection>
  );
}
