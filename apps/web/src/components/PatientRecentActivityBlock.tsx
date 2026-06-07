import type { PatientLongitudinalResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import { EpisWorkspaceSection, List, ListItem, ListItemText, Typography } from '@epis2/epis2-ui';

type PatientRecentActivityBlockProps = {
  events: PatientLongitudinalResponse['timeline'];
  maxEvents?: number;
  onOpenDraft?: (draftId: string) => void;
};

/** Actividad reciente compacta — UX-B.2 (≤8 eventos), sección plana. */
export function PatientRecentActivityBlock({
  events,
  maxEvents = 8,
  onOpenDraft,
}: PatientRecentActivityBlockProps) {
  const items = events.slice(0, maxEvents);

  return (
    <EpisWorkspaceSection title={copy.activePatient.recentActivityTitle} testId="epis2-recent-activity">
      {items.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {copy.longitudinal.emptySection}
        </Typography>
      ) : (
        <List dense disablePadding>
          {items.map((event) => (
            <ListItem
              key={event.id}
              disablePadding
              secondaryAction={
                event.kind === 'draft' && event.entityId && onOpenDraft ? (
                  <Typography
                    component="button"
                    variant="body2"
                    onClick={() => onOpenDraft(event.entityId!)}
                    sx={{
                      border: 0,
                      background: 'none',
                      cursor: 'pointer',
                      color: 'primary.main',
                      p: 0,
                    }}
                  >
                    {copy.activePatient.openDraft}
                  </Typography>
                ) : undefined
              }
            >
              <ListItemText
                primary={event.title}
                secondary={new Date(event.at).toLocaleString('es-CL')}
              />
            </ListItem>
          ))}
        </List>
      )}
    </EpisWorkspaceSection>
  );
}
