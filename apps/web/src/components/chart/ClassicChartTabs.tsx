import { copy } from '@epis2/design-system';
import { Box, epis2PaperNavTabSx } from '@epis2/epis2-ui';
import {
  CLASSIC_CHART_TAB_IDS,
  type ClassicChartTabId,
} from './classicChartTabConfig.js';

export type ClassicChartTabsProps = {
  activeTab: ClassicChartTabId;
  onTabChange: (tab: ClassicChartTabId) => void;
  visibleTabs?: readonly ClassicChartTabId[] | undefined;
  testId?: string | undefined;
};

const TAB_COPY_KEY: Record<ClassicChartTabId, keyof typeof copy.chartModes.classicTabs> = {
  summary: 'summary',
  evolutions: 'evolutions',
  orders: 'orders',
  exams: 'exams',
  documents: 'documents',
  more: 'more',
};

/** Navegación clínica tabulada — reemplaza rail de 17 ítems como entrada principal (MF-AEST-02). */
export function ClassicChartTabs({
  activeTab,
  onTabChange,
  visibleTabs = CLASSIC_CHART_TAB_IDS,
  testId = 'classic-chart-tabs',
}: ClassicChartTabsProps) {
  return (
    <Box
      component="nav"
      aria-label="Navegación clínica"
      data-testid={testId}
      className="epis2-classic-chart-tabs epis2-no-print"
      sx={{
        display: 'flex',
        gap: 0.5,
        px: 2,
        py: 1,
        borderBottom: '1px solid',
        borderColor: 'divider',
        flexShrink: 0,
        overflowX: 'auto',
        bgcolor: 'background.paper',
      }}
    >
      {visibleTabs.map((tab) => {
        const active = tab === activeTab;
        return (
          <Box
            key={tab}
            component="button"
            type="button"
            data-testid={`classic-chart-tab-${tab}`}
            onClick={() => onTabChange(tab)}
            sx={{
              ...epis2PaperNavTabSx(active),
              cursor: 'pointer',
              border: 'none',
              font: 'inherit',
              flexShrink: 0,
            }}
          >
            {copy.chartModes.classicTabs[TAB_COPY_KEY[tab]]}
          </Box>
        );
      })}
    </Box>
  );
}
