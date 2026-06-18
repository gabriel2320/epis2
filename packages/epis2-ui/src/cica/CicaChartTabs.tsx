import Stack from '@mui/material/Stack';
import {
  CLINICAL_CHART_TAB_REGISTRY,
  buildCicaChartTabPath,
  chartTabLabelEs,
  inferChartTabFromPathname,
  type CicaChartTabId,
} from './clinicalChartTabRegistry.js';
import { EpisButton } from '../primitives/EpisButton.js';
import { useEpis2ThemePreferences } from '../providers/EpisThemePreferences.js';
import { prefersReducedMotion } from '../theme/motion.js';
import { cicaMotion, cicaTransition, shouldAnimate } from './cicaMotion.js';
import { cicaHorizontalScrollSx, cicaShellPaddingXSx } from './cicaResponsive.js';
import { cicaTokens } from './cicaTokens.js';

export type CicaChartTabsProps = {
  patientId: string;
  activeTabId: CicaChartTabId;
  onNavigate: (path: string) => void;
  paperDate?: string;
  testId?: string;
};

/** Tabs ficha — driven por CLINICAL_CHART_TAB_REGISTRY (modificar tabs ahí). */
export function CicaChartTabs({
  patientId,
  activeTabId,
  onNavigate,
  paperDate,
  testId = 'cica-chart-tabs',
}: CicaChartTabsProps) {
  const { preferences } = useEpis2ThemePreferences();
  const animate = shouldAnimate(preferences.motion) && !prefersReducedMotion();
  const tabTransition = cicaTransition(
    ['background-color', 'color', 'box-shadow'],
    animate,
    cicaMotion.duration.tab,
  );
  const indicatorTransition = cicaTransition(
    ['opacity', 'transform'],
    animate,
    cicaMotion.duration.tab,
  );

  return (
    <Stack
      direction="row"
      spacing={0.5}
      useFlexGap
      data-testid={testId}
      sx={{
        flexShrink: 0,
        px: cicaShellPaddingXSx,
        py: 1,
        borderBottom: 1,
        borderColor: cicaTokens.borderColor,
        bgcolor: 'background.paper',
        minWidth: 0,
        ...cicaHorizontalScrollSx,
        flexWrap: { xs: 'nowrap', sm: 'wrap' },
        '& > *': { flexShrink: { xs: 0, sm: 1 } },
      }}
    >
      {CLINICAL_CHART_TAB_REGISTRY.map((tab) => {
        const path = buildCicaChartTabPath(
          tab.id,
          patientId,
          paperDate !== undefined ? { paperDate } : undefined,
        );
        const isActive = activeTabId === tab.id;
        return (
          <EpisButton
            key={tab.id}
            appearance={isActive ? 'tonal' : 'text'}
            size="small"
            data-testid={`cica-chart-tab-${tab.id}`}
            onClick={() => onNavigate(path)}
            sx={{
              position: 'relative',
              transition: tabTransition,
              '&::after': {
                content: '""',
                position: 'absolute',
                left: '12%',
                right: '12%',
                bottom: 0,
                height: 2,
                borderRadius: '2px 2px 0 0',
                bgcolor: 'primary.main',
                opacity: isActive ? 1 : 0,
                transform: isActive ? 'scaleX(1)' : 'scaleX(0.6)',
                transition: indicatorTransition,
              },
              '@media (prefers-reduced-motion: reduce)': {
                transition: 'none',
                '&::after': { transition: 'none' },
              },
            }}
          >
            {chartTabLabelEs(tab.id)}
          </EpisButton>
        );
      })}
    </Stack>
  );
}

export { inferChartTabFromPathname as inferCicaChartTabFromPathname };
