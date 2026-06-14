import { copy } from '@epis2/design-system';
import { EpisM3Text, Stack } from '@epis2/epis2-ui';
import {
  getMirrorBindingForTraditionalSection,
  type TraditionalSectionNavId,
} from '@epis2/clinical-forms';
import type { TraditionalSectionId } from '../TraditionalSectionNav.js';

export type TraditionalSectionMirrorStripProps = {
  sectionId: TraditionalSectionId;
  testId?: string | undefined;
};

/** Meta espejo papel↔electrónica — fieldId + sección papel (MF-NORM-09). */
export function TraditionalSectionMirrorStrip({
  sectionId,
  testId = 'epis2-traditional-section-mirror',
}: TraditionalSectionMirrorStripProps) {
  const binding = getMirrorBindingForTraditionalSection(sectionId as TraditionalSectionNavId);
  if (!binding?.paperSectionId) return null;

  return (
    <Stack
      direction="row"
      spacing={1}
      flexWrap="wrap"
      data-testid={`${testId}-${sectionId}`}
      sx={{ mt: 1.5, pt: 1, borderTop: 1, borderColor: 'divider' }}
    >
      <EpisM3Text role="labelMedium" color="text.secondary">
        {copy.chartModes.mirrorPaperSection}: {binding.paperSectionId}
      </EpisM3Text>
      <EpisM3Text role="labelMedium" color="text.secondary">
        · {binding.fieldId}
      </EpisM3Text>
    </Stack>
  );
}
