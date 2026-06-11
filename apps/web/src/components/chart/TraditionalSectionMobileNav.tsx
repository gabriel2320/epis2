import { copy } from '@epis2/design-system';
import { Box, MenuItem, TextField } from '@epis2/epis2-ui';
import { TRADITIONAL_SECTION_IDS, type TraditionalSectionId } from './TraditionalSectionNav.js';

export type TraditionalSectionMobileNavProps = {
  activeSection?: TraditionalSectionId | undefined;
  onSectionChange?: ((section: TraditionalSectionId) => void) | undefined;
  visibleSectionIds?: readonly TraditionalSectionId[] | undefined;
  testId?: string | undefined;
};

/** Selector sección en xs/sm — MF-TE-04. */
export function TraditionalSectionMobileNav({
  activeSection = 'navSummary',
  onSectionChange,
  visibleSectionIds,
  testId = 'epis2-traditional-section-mobile-nav',
}: TraditionalSectionMobileNavProps) {
  const sectionIds = visibleSectionIds ?? TRADITIONAL_SECTION_IDS;
  return (
    <Box
      sx={{
        display: { xs: 'block', md: 'none' },
        px: 1.5,
        py: 1,
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        flexShrink: 0,
      }}
    >
      <TextField
        select
        fullWidth
        size="small"
        label={copy.chartModes.mobileSectionLabel}
        value={activeSection}
        onChange={(e) => onSectionChange?.(e.target.value as TraditionalSectionId)}
        data-testid={testId}
      >
        {sectionIds.map((key) => (
          <MenuItem key={key} value={key} data-testid={`${testId}-option-${key}`}>
            {copy.chartModes[key]}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}
