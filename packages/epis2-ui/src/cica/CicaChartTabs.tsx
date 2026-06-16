import { copy } from '@epis2/design-system';
import Stack from '@mui/material/Stack';
import type { CicaChartTabId } from './CICA_CHART_TAB_REGISTRY.js';
import {
  CICA_CHART_TAB_REGISTRY,
  inferChartTabFromPathname,
} from './CICA_CHART_TAB_REGISTRY.js';
import { buildCicaPath, todayIsoDate } from './cicaRoutes.js';
import { EpisButton } from '../primitives/EpisButton.js';
import { useEpis2ThemePreferences } from '../providers/EpisThemePreferences.js';
import { prefersReducedMotion } from '../theme/motion.js';
import { cicaMotion, cicaTransition, shouldAnimate } from './cicaMotion.js';
import { cicaHorizontalScrollSx, cicaShellPaddingXSx } from './cicaResponsive.js';
import { cicaTokens } from './cicaTokens.js';

const TAB_LABELS: Record<
  (typeof CICA_CHART_TAB_REGISTRY)[number]['labelKey'],
  string
> = {
  summary: copy.chartModes.classicTabs.summary,
  evolutions: copy.chartModes.classicTabs.evolutions,
  orders: copy.chartModes.classicTabs.orders,
  exams: copy.chartModes.classicTabs.exams,
  documents: copy.chartModes.classicTabs.documents,
  paper: copy.clinicalNav.paper,
};

export type CicaChartTabsProps = {
  patientId: string;
  activeTabId: CicaChartTabId;
  onNavigate: (path: string) => void;
  paperDate?: string;
  testId?: string;
};

/** Tabs ficha — driven por CICA_CHART_TAB_REGISTRY (modificar tabs ahí). */
export function CicaChartTabs({
  patientId,
  activeTabId,
  onNavigate,
  paperDate = todayIsoDate(),
  testId = 'cica-chart-tabs',
}: CicaChartTabsProps) {
  const { preferences } = useEpis2ThemePreferences();
  const animate = shouldAnimate(preferences.motion) && !prefersReducedMotion();
  const tabTransition = cicaTransition(
    ['background-color', 'color', 'box-shadow'],
    animate,
    cicaMotion.duration.tab,
  );
  const indicatorTransition = cicaTransition(['opacity', 'transform'], animate, cicaMotion.duration.tab);

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
      {CICA_CHART_TAB_REGISTRY.map((tab) => {
        const path =
          tab.pathKind === 'paper-day'
            ? buildCicaPath('paper-day', { patientId, date: paperDate })
            : buildCicaPath(tab.screenId, { patientId });
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
            {TAB_LABELS[tab.labelKey]}
          </EpisButton>
        );
      })}
    </Stack>
  );
}

export { inferChartTabFromPathname as inferCicaChartTabFromPathname };
