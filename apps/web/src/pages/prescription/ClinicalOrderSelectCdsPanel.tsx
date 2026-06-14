import { mapClinicalAlertsToOrderSelectCards } from '@epis2/clinical-domain';
import type { ClinicalAlert } from '@epis2/contracts';
import { Stack } from '@epis2/epis2-ui';
import { useMemo } from 'react';
import { ClinicalCdsCard } from '../../components/cds/ClinicalCdsCard.js';

export type ClinicalOrderSelectCdsPanelProps = {
  alerts: readonly ClinicalAlert[];
  testId?: string | undefined;
};

/** MF-CU-03 — CDS Hooks order-select: tarjetas al prescribir (duplicidad, alergia, interacción). */
export function ClinicalOrderSelectCdsPanel({
  alerts,
  testId = 'epis2-cds-order-select',
}: ClinicalOrderSelectCdsPanelProps) {
  const cards = useMemo(() => mapClinicalAlertsToOrderSelectCards(alerts), [alerts]);

  if (cards.length === 0) return null;

  return (
    <Stack spacing={0.75} data-testid={testId} sx={{ pt: 1, pb: 0.5 }}>
      {cards.map((card) => (
        <ClinicalCdsCard
          key={card.id}
          variant={card.variant}
          label={card.label}
          detail={card.detail}
          source={card.source}
          testId={`${testId}-card-${card.ruleId.replace(/^cdr\./, '')}`}
        />
      ))}
    </Stack>
  );
}
