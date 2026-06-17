import Box from '@mui/material/Box';
import type { ReactNode } from 'react';
import { EpisM3Text, EpisDemoBadgeChip } from '../primitives/index.js';
import { ScienceIcon } from '../mui/index.js';
import { useEpis2ThemePreferences } from '../providers/EpisThemePreferences.js';
import { prefersReducedMotion } from '../theme/motion.js';
import { CicaThemeControls } from './CicaThemeControls.js';
import { cicaMotion, cicaTransition, shouldAnimate } from './cicaMotion.js';
import { cicaTokens } from './cicaTokens.js';

export type CicaTopBarProps = {
  title?: string;
  contextSlot?: ReactNode;
  /** Controles de tema (modo/acento/preferencias). Por defecto `<CicaThemeControls />`. */
  themeControls?: ReactNode;
  endSlot?: ReactNode;
  demoLabel?: string;
  /** Sombra sutil al elevarse — p. ej. tras scroll del contenido. */
  elevated?: boolean;
  testId?: string;
};

/** Barra superior mínima — marca + contexto + DEMO. */
export function CicaTopBar({
  title = 'EPIS2',
  contextSlot,
  themeControls,
  endSlot,
  demoLabel = 'DEMO',
  elevated = false,
  testId = 'cica-top-bar',
}: CicaTopBarProps) {
  const { preferences } = useEpis2ThemePreferences();
  const animate = shouldAnimate(preferences.motion) && !prefersReducedMotion();
  const chromeTransition = cicaTransition(
    ['border-color', 'box-shadow'],
    animate,
    cicaMotion.duration.chrome,
  );
  const resolvedThemeControls = themeControls ?? <CicaThemeControls />;
  return (
    <Box
      component="header"
      data-testid={testId}
      sx={{
        flexShrink: 0,
        minHeight: cicaTokens.topBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: cicaTokens.shellPaddingX,
        py: 1,
        borderBottom: 1,
        borderColor: cicaTokens.borderColor,
        bgcolor: 'background.paper',
        boxShadow: elevated ? 1 : 'none',
        transition: chromeTransition,
        '@media (prefers-reduced-motion: reduce)': {
          transition: 'none',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
        <EpisM3Text role="titleMedium" component="p" data-testid="cica-top-bar-brand">
          {title}
        </EpisM3Text>
        {contextSlot}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
        {resolvedThemeControls}
        <EpisDemoBadgeChip icon={<ScienceIcon />} label={demoLabel} size="small" />
        {endSlot}
      </Box>
    </Box>
  );
}
