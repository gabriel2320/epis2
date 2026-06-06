import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import {
  EpisPatientChartTabs,
  type EpisPatientChartTab,
} from './EpisPatientChartTabs.js';
import {
  EpisPatientContextBar,
  type EpisPatientContextAlert,
} from './EpisPatientContextBar.js';

export type EpisPatientChartShellProps = {
  displayName: string;
  meta?: string;
  alerts?: EpisPatientContextAlert[];
  tabs: EpisPatientChartTab[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
  contextBarTrailing?: ReactNode;
  children?: ReactNode;
  testId?: string;
};

/** Niveles 1–2 — cabecera inmutable + Primary Tabs; el contenido (N3–N4) hace scroll debajo. */
export function EpisPatientChartShell({
  displayName,
  meta,
  alerts,
  tabs,
  activeTabId,
  onTabChange,
  contextBarTrailing,
  children,
  testId = 'epis2-patient-chart-shell',
}: EpisPatientChartShellProps) {
  return (
    <Box data-testid={testId}>
      <EpisPatientContextBar
        displayName={displayName}
        {...(meta ? { meta } : {})}
        alerts={alerts ?? []}
        {...(contextBarTrailing ? { trailing: contextBarTrailing } : {})}
      />
      <EpisPatientChartTabs tabs={tabs} activeTabId={activeTabId} onTabChange={onTabChange} />
      {children ? (
        <Box component="section" sx={{ pt: 2 }}>
          {children}
        </Box>
      ) : null}
    </Box>
  );
}
