import { copy } from '@epis2/design-system';
import { EpisButton, Stack } from '@epis2/epis2-ui';
import { useClinicalNavigate } from '../routes/clinicalNavigate.js';
import { CICA_RETURN_ROUTES } from '../clinical/clinicalIntent.js';
import { ClinicalIntentBreadcrumb } from './layout/clinical/ClinicalIntentBreadcrumb.js';

export type ClinicalPageNavProps = {
  patientId?: string | undefined;
  patientDisplayName?: string | undefined;
  sectionLabel?: string | undefined;
  showFicha?: boolean | undefined;
  showBreadcrumb?: boolean | undefined;
};

/** Navegación de retorno CICA Ley 5 — breadcrumb + acciones rápidas. MF-AEST-05 */
export function ClinicalPageNav({
  patientId,
  patientDisplayName,
  sectionLabel,
  showFicha = true,
  showBreadcrumb = true,
}: ClinicalPageNavProps) {
  const navigate = useClinicalNavigate();

  return (
    <Stack spacing={1} sx={{ pt: showBreadcrumb ? 0 : 2 }}>
      {showBreadcrumb ? (
        <ClinicalIntentBreadcrumb
          patientId={patientId}
          patientDisplayName={patientDisplayName}
          sectionLabel={sectionLabel}
        />
      ) : null}
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {showFicha && patientId ? (
          <EpisButton
            variant="outlined"
            size="small"
            data-testid="clinical-nav-back-to-ficha"
            onClick={() =>
              void navigate({
                to: CICA_RETURN_ROUTES.patientChart,
                search: { patientId, chartMode: 'traditional' },
              })
            }
          >
            {copy.clinicalBreadcrumb.backToFicha}
          </EpisButton>
        ) : null}
        <EpisButton
          variant="text"
          size="small"
          data-testid="clinical-nav-back-to-census"
          onClick={() => void navigate({ to: CICA_RETURN_ROUTES.census })}
        >
          {copy.clinicalBreadcrumb.backToCensus}
        </EpisButton>
      </Stack>
    </Stack>
  );
}
