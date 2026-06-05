import type { ReactNode } from 'react';
import AppBar from '@mui/material/AppBar';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import ViewSidebarIcon from '@mui/icons-material/ViewSidebar';
import { EpisIconButton } from '../primitives/EpisIconButton.js';
import { EpisM3Text } from '../primitives/EpisM3Text.js';

export type EpisClinicalFocusAppBarProps = {
  patientName?: string;
  patientMeta?: ReactNode;
  contextOpen: boolean;
  onContextOpenChange: (open: boolean) => void;
  showContextToggle?: boolean;
  contextOpenLabel: string;
  contextCloseLabel: string;
  contextOpenAria: string;
  contextCloseAria: string;
  trailing?: ReactNode;
  testId?: string;
};

/** Barra compacta clínica — identidad mínima + toggle de historial (LAYOUT-01). */
export function EpisClinicalFocusAppBar({
  patientName,
  patientMeta,
  contextOpen,
  onContextOpenChange,
  showContextToggle = true,
  contextOpenLabel,
  contextCloseLabel,
  contextOpenAria,
  contextCloseAria,
  trailing,
  testId = 'epis2-clinical-focus-app-bar',
}: EpisClinicalFocusAppBarProps) {
  const toggle = () => onContextOpenChange(!contextOpen);

  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      data-testid={testId}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
        boxShadow: 'none',
        top: 0,
        zIndex: (theme) => theme.zIndex.appBar,
      }}
    >
      <Toolbar
        variant="dense"
        sx={{
          minHeight: { xs: 48, sm: 56 },
          px: { xs: 1.5, sm: 2 },
          gap: 1,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} flex={1} minWidth={0} useFlexGap>
          {patientName ? (
            <EpisM3Text role="titleMedium" component="span" noWrap sx={{ maxWidth: '100%' }}>
              {patientName}
            </EpisM3Text>
          ) : null}
          {patientMeta}
        </Stack>
        {trailing}
        {showContextToggle ? (
          <EpisIconButton
            color={contextOpen ? 'primary' : 'default'}
            onClick={toggle}
            aria-label={contextOpen ? contextCloseAria : contextOpenAria}
            aria-expanded={contextOpen}
            title={contextOpen ? contextCloseLabel : contextOpenLabel}
            data-testid="epis2-clinical-context-toggle"
          >
            <ViewSidebarIcon fontSize="small" />
          </EpisIconButton>
        ) : null}
      </Toolbar>
    </AppBar>
  );
}
