import Box from '@mui/material/Box';
import type { ReactNode } from 'react';
import { EpisM3Text, EpisDemoBadgeChip } from '../primitives/index.js';
import { ScienceIcon } from '../mui/index.js';
import { useEpis2ThemePreferences } from '../providers/EpisThemePreferences.js';
import { prefersReducedMotion } from '../theme/motion.js';
import { cicaEpis2gVisual } from './cicaEpis2gVisual.js';
import { cicaMotion, cicaTransition, shouldAnimate } from './cicaMotion.js';
import { cicaTokens } from './cicaTokens.js';
import { useCicaThemeTokens } from './useCicaThemeTokens.js';

export type CicaTopBarProps = {
  title?: string;
  contextSlot?: ReactNode;
  /** Controles de tema. Por defecto ocultos (tema en sidebar epis2g). */
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
  const { isDark } = useCicaThemeTokens();
  const animate = shouldAnimate(preferences.motion) && !prefersReducedMotion();
  const chromeTransition = cicaTransition(
    ['border-color', 'box-shadow'],
    animate,
    cicaMotion.duration.chrome,
  );
  return (
    <Box
      component="header"
      data-testid={testId}
      data-cica-top-bar="epis2g"
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
        <Box
          component="span"
          sx={{
            display: { xs: 'none', sm: 'inline-flex' },
            fontFamily: cicaEpis2gVisual.fontMono,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            color: isDark ? cicaEpis2gVisual.railText : '#f8fafc',
            bgcolor: isDark ? cicaEpis2gVisual.railHoverBg : cicaEpis2gVisual.railBg,
            px: 1,
            py: 0.25,
            borderRadius: 0.5,
          }}
        >
          EPIS2 CLINICAL PORTAL
        </Box>
        <EpisM3Text role="titleMedium" component="p" data-testid="cica-top-bar-brand">
          {title}
        </EpisM3Text>
        {contextSlot}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
        {themeControls}
        <EpisDemoBadgeChip icon={<ScienceIcon />} label={demoLabel} size="small" />
        {endSlot}
      </Box>
    </Box>
  );
}
