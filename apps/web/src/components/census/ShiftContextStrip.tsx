import { copy } from '@epis2/design-system';
import { EpisDemoBadgeChip, EpisM3Text, EpisWorkspaceSection, Stack } from '@epis2/epis2-ui';
import type { DemoShiftCensusPresentation } from '../../fixtures/demoFixtureTypes.js';
import { listDemoShiftCensusPresentations } from '../../clinical/demoShiftCensusPresentation.js';

export function ShiftContextStrip() {
  const pendientes = listDemoShiftCensusPresentations();

  return (
    <EpisWorkspaceSection title={copy.censusShift.stripTitle} testId="epis2-shift-context-strip">
      <Stack spacing={1.5}>
        <EpisM3Text role="bodyMedium" color="text.secondary">
          {copy.censusShift.stripSubtitle}
        </EpisM3Text>
        <EpisDemoBadgeChip label={copy.demoBadge} size="small" />
        <EpisM3Text role="titleMedium" component="h2">
          {copy.censusShift.stripPendingHeading}
        </EpisM3Text>
        <Stack component="ul" spacing={0.75} sx={{ m: 0, pl: 2.5 }}>
          {pendientes.map((row: DemoShiftCensusPresentation) => (
            <EpisM3Text key={row.demoCaseCode} role="bodyMedium" component="li">
              {row.demoCaseCode}: {row.pendingLabelEs}
            </EpisM3Text>
          ))}
        </Stack>
      </Stack>
    </EpisWorkspaceSection>
  );
}
