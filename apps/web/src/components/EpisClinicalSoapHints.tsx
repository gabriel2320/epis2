import { copy } from '@epis2/design-system';
import { EpisChip, Stack, Typography } from '@epis2/epis2-ui';
import { computeSoapGapHints } from '../clinical/soap-gap-hints.js';

export type EpisClinicalSoapHintsProps = {
  blueprintId: string;
  values: Record<string, string>;
  aiAvailable: boolean;
};

/** Chips predictivos de huecos SOAP — solo con IA local disponible (LAYOUT-03). */
export function EpisClinicalSoapHints({
  blueprintId,
  values,
  aiAvailable,
}: EpisClinicalSoapHintsProps) {
  if (!aiAvailable) return null;

  const hints = computeSoapGapHints(blueprintId, values);
  if (hints.length === 0) return null;

  return (
    <Stack spacing={1} data-testid="epis2-soap-gap-hints">
      <Typography variant="caption" color="text.secondary">
        {copy.clinicalLayout.soapHintsTitle}
      </Typography>
      <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
        {hints.map((hint) => (
          <EpisChip
            key={hint.fieldId}
            label={hint.label}
            size="small"
            variant="outlined"
            data-testid={`epis2-soap-hint-${hint.fieldId}`}
          />
        ))}
      </Stack>
    </Stack>
  );
}
