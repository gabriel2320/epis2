import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { epis2PatientChartTabsSx } from './patient-chart-tokens.js';

export type EpisPatientChartTab = {
  id: string;
  label: string;
  disabled?: boolean;
};

export type EpisPatientChartTabsProps = {
  tabs: EpisPatientChartTab[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
  testId?: string;
};

/** Nivel 2 — Primary Tabs (máx. 5 ramas cronológicas de la ficha). */
export function EpisPatientChartTabs({
  tabs,
  activeTabId,
  onTabChange,
  testId = 'epis2-patient-chart-tabs',
}: EpisPatientChartTabsProps) {
  const activeIndex = Math.max(
    0,
    tabs.findIndex((t) => t.id === activeTabId),
  );

  return (
    <Box sx={epis2PatientChartTabsSx} data-testid={testId}>
      <Tabs
        value={activeIndex}
        onChange={(_, index: number) => {
          const tab = tabs[index];
          if (tab) onTabChange(tab.id);
        }}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="Ramas de la ficha clínica"
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            label={tab.label}
            {...(tab.disabled ? { disabled: true } : {})}
            data-testid={`epis2-chart-tab-${tab.id}`}
            sx={{ textTransform: 'none', minHeight: 48 }}
          />
        ))}
      </Tabs>
    </Box>
  );
}
