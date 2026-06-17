import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { cicaEpis2gVisual } from './cicaEpis2gVisual.js';
import { findEpis2gScreenStructure } from './cicaEpis2gScreenStructure.js';
import type { CicaScreenId } from './cicaRoutes.js';

export type CicaSystemWorkspaceHeaderProps = {
  screenId: CicaScreenId;
  testId?: string;
};

/** Cabecera workspace sistema — patrón SystemGlobalViews epis2g. */
export function CicaSystemWorkspaceHeader({
  screenId,
  testId = 'cica-system-workspace-header',
}: CicaSystemWorkspaceHeaderProps) {
  const structure = findEpis2gScreenStructure(screenId);
  if (!structure?.workspaceTitle) return null;

  return (
    <Stack
      spacing={1}
      data-testid={testId}
      sx={{ pb: 2, mb: 2, borderBottom: 1, borderColor: 'divider' }}
    >
      <Box
        component="span"
        sx={{
          alignSelf: 'flex-start',
          fontFamily: cicaEpis2gVisual.fontMono,
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          color: '#f8fafc',
          bgcolor: cicaEpis2gVisual.railBg,
          px: 1,
          py: 0.25,
          borderRadius: 0.5,
        }}
      >
        EPIS2 · CLINICAL WORKSPACE
      </Box>
      <Typography variant="h6" component="h1" fontWeight={700}>
        {structure.workspaceTitle}
      </Typography>
      {structure.workspaceSubtitle ? (
        <Typography variant="body2" color="text.secondary">
          {structure.workspaceSubtitle}
        </Typography>
      ) : null}
    </Stack>
  );
}
