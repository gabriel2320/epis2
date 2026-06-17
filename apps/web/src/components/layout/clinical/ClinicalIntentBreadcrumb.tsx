import { copy } from '@epis2/design-system';
import { Box, EpisButton, EpisM3Text } from '@epis2/epis2-ui';
import { useClinicalNavigate } from '../../../routes/clinicalNavigate.js';
import { CICA_RETURN_ROUTES } from '../../../clinical/clinicalIntent.js';

export type ClinicalIntentBreadcrumbProps = {
  patientId?: string | undefined;
  patientDisplayName?: string | undefined;
  /** Nivel 3–4: sección o documento activo. */
  sectionLabel?: string | undefined;
  testId?: string | undefined;
};

/**
 * CICA Ley 5 — retorno seguro: Censo → Paciente → Sección.
 * MF-AEST-05 · Screen Map §6 · EPIS2_CICA.md
 */
export function ClinicalIntentBreadcrumb({
  patientId,
  patientDisplayName,
  sectionLabel,
  testId = 'clinical-intent-breadcrumb',
}: ClinicalIntentBreadcrumbProps) {
  const navigate = useClinicalNavigate();

  return (
    <Box
      component="nav"
      aria-label={copy.clinicalBreadcrumb.ariaLabel}
      data-testid={testId}
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 0.5,
        py: 0.5,
      }}
    >
      <EpisButton
        appearance="text"
        size="small"
        data-testid="clinical-breadcrumb-census"
        onClick={() => void navigate({ to: CICA_RETURN_ROUTES.census })}
      >
        {copy.clinicalBreadcrumb.census}
      </EpisButton>
      {patientId ? (
        <>
          <EpisM3Text role="labelMedium" color="text.secondary" aria-hidden>
            /
          </EpisM3Text>
          <EpisButton
            appearance="text"
            size="small"
            data-testid="clinical-breadcrumb-patient"
            onClick={() =>
              void navigate({
                to: CICA_RETURN_ROUTES.patientChart,
                search: { patientId, chartMode: 'traditional' },
              })
            }
          >
            {patientDisplayName ?? copy.clinicalBreadcrumb.patientFallback}
          </EpisButton>
        </>
      ) : null}
      {sectionLabel ? (
        <>
          <EpisM3Text role="labelMedium" color="text.secondary" aria-hidden>
            /
          </EpisM3Text>
          <EpisM3Text
            role="labelLarge"
            component="span"
            data-testid="clinical-breadcrumb-section"
            color="text.primary"
          >
            {sectionLabel}
          </EpisM3Text>
        </>
      ) : null}
    </Box>
  );
}
