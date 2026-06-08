import { useMemo } from 'react';
import type { PatientLongitudinalResponse } from '@epis2/contracts';
import { isSurgicalHistoryDescription } from '@epis2/clinical-domain';
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

export type PatientSummaryAntecedentsBlockProps = {
  allergies: PatientLongitudinalResponse['allergies'];
  problems: PatientLongitudinalResponse['problems'];
  onRegisterAllergy?: () => void;
  onRegisterProblem?: () => void;
  maxItems?: number;
};

/** Resumen compacto IDC 27–29 — CTAs visibles en ficha sin abrir historial (Ola 3 / UX-B.2). */
export function PatientSummaryAntecedentsBlock({
  allergies,
  problems,
  onRegisterAllergy,
  onRegisterProblem,
  maxItems = 2,
}: PatientSummaryAntecedentsBlockProps) {
  const clinicalProblems = useMemo(
    () => problems.filter((p) => !isSurgicalHistoryDescription(p.description)),
    [problems],
  );

  return (
    <EpisWorkspaceSection
      title={copy.activePatient.antecedentsTitle}
      testId="epis2-ficha-antecedents"
    >
      <Stack spacing={2}>
        <Stack spacing={0.75}>
          <Typography variant="body2" color="text.secondary">
            {copy.longitudinal.allergies}
          </Typography>
          {allergies.length === 0 ? (
            <>
              <Typography variant="body2" color="text.secondary">
                {copy.longitudinal.emptySection}
              </Typography>
              {onRegisterAllergy ? (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={onRegisterAllergy}
                  data-testid="epis2-ficha-register-allergy"
                  sx={{ alignSelf: 'flex-start' }}
                >
                  {copy.longitudinal.registerAllergy}
                </Button>
              ) : null}
            </>
          ) : (
            <List dense disablePadding>
              {allergies.slice(0, maxItems).map((a) => (
                <ListItem key={a.id} disablePadding>
                  <ListItemText primary={a.substance} secondary={a.severity} />
                </ListItem>
              ))}
            </List>
          )}
        </Stack>

        <Stack spacing={0.75}>
          <Typography variant="body2" color="text.secondary">
            {copy.longitudinal.problems}
          </Typography>
          {clinicalProblems.length === 0 ? (
            <>
              <Typography variant="body2" color="text.secondary">
                {copy.longitudinal.emptySection}
              </Typography>
              {onRegisterProblem ? (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={onRegisterProblem}
                  data-testid="epis2-ficha-register-problem"
                  sx={{ alignSelf: 'flex-start' }}
                >
                  {copy.longitudinal.registerProblem}
                </Button>
              ) : null}
            </>
          ) : (
            <List dense disablePadding>
              {clinicalProblems.slice(0, maxItems).map((p) => (
                <ListItem key={p.id} disablePadding>
                  <ListItemText primary={p.description} secondary={p.status} />
                </ListItem>
              ))}
            </List>
          )}
        </Stack>
      </Stack>
    </EpisWorkspaceSection>
  );
}
