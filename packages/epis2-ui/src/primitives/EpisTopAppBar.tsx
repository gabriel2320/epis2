import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import type { ReactNode } from 'react';
import { useTheme } from '@mui/material/styles';
import { epis2BarLayout } from '../theme/breakpoints.js';
import { epis2Shape } from '../theme/shape.js';

export type EpisTopAppBarProps = {
  title?: ReactNode;
  startAction?: ReactNode;
  endActions?: ReactNode;
  elevation?: number;
  'data-testid'?: string;
};

/** Top app bar M3 mínima — una o dos acciones esenciales. */
export function EpisTopAppBar({
  title,
  startAction,
  endActions,
  elevation = 0,
  'data-testid': testId,
}: EpisTopAppBarProps) {
  const theme = useTheme();
  const visual = theme.epis2?.visual;

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={elevation}
      data-testid={testId}
      sx={{
        width: '100%',
        bgcolor: visual?.topBarBg ?? 'transparent',
        borderRadius: epis2Shape.large,
        mb: 2,
        ...(visual ? { border: `1px solid ${visual.cardBorder}` } : {}),
        backdropFilter: 'blur(12px)',
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          minHeight: epis2BarLayout.inputMinHeight,
          px: epis2BarLayout.toolbarPx,
          py: 1,
          gap: 1.5,
          width: '100%',
        }}
      >
        {startAction ? <Box sx={{ flexShrink: 0 }}>{startAction}</Box> : null}
        {title ? (
          <Box sx={{ flex: 1, minWidth: 0, typography: 'subtitle2', color: 'text.secondary' }}>
            {title}
          </Box>
        ) : (
          <Box sx={{ flex: 1 }} />
        )}
        {endActions ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>{endActions}</Box>
        ) : null}
      </Toolbar>
    </AppBar>
  );
}
