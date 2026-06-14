import { mapClinicalAlertsToPatientViewCards } from '@epis2/clinical-domain';
import type { ClinicalAlert } from '@epis2/contracts';
import { Stack } from '@epis2/epis2-ui';
import { useMemo } from 'react';
import { ClinicalCdsCard } from './ClinicalCdsCard.js';

export type ClinicalPatientViewCdsPanelProps = {
  alerts: readonly ClinicalAlert[];
  testId?: string | undefined;
};

/** MF-CU-02 — CDS Hooks patient-view: tarjetas al abrir ficha (alergias, gaps, advisory). */
export function ClinicalPatientViewCdsPanel({
  alerts,
  testId = 'epis2-cds-patient-view',
}: ClinicalPatientViewCdsPanelProps) {
  const cards = useMemo(() => mapClinicalAlertsToPatientViewCards(alerts), [alerts]);

  if (cards.length === 0) return null;

  return (
    <Stack
      spacing={0.75}
      data-testid={testId}
      sx={{
        px: { xs: 1.5, sm: 2 },
        pt: 1.25,
        pb: 0.5,
        flexShrink: 0,
      }}
    >
      {cards.map((card) => (
        <ClinicalCdsCard
          key={card.id}
          variant={card.variant}
          label={card.label}
          detail={card.detail}
          source={card.source}
          testId={`${testId}-card-${card.ruleId}`}
        />
      ))}
    </Stack>
  );
}
