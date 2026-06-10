import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import type { ReactNode } from 'react';
import { EpisButton } from '../primitives/EpisButton.js';
import { EpisDemoBadgeChip } from '../primitives/EpisDemoBadgeChip.js';
import { EpisM3Text } from '../primitives/EpisM3Text.js';
import { epis2ShellContentSx } from '../theme/island-layout.js';

export type EpisDashboardTab = {
  value: string;
  label: string;
  'data-testid'?: string;
};

export type EpisDashboardShellProps = {
  title: string;
  subtitle?: string;
  demoBadge?: string;
  tabs: EpisDashboardTab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onBackToCommand: () => void;
  backLabel: string;
  children: ReactNode;
  showFooterBack?: boolean;
  maxWidth?: number;
  'data-testid'?: string;
};

/** Modo tablero — superficie plana, tabs integrados sin cajas interiores (UX-A.2 / LAYOUT-G12). */
export function EpisDashboardShell({
  title,
  subtitle,
  demoBadge,
  tabs,
  activeTab,
  onTabChange,
  onBackToCommand,
  backLabel,
  children,
  showFooterBack = true,
  maxWidth = 960,
  'data-testid': testId,
}: EpisDashboardShellProps) {
  return (
    <Stack
      spacing={3}
      sx={{
        ...epis2ShellContentSx,
        maxWidth,
      }}
      data-testid={testId}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        flexWrap="wrap"
        gap={1}
      >
        <Box>
          <EpisM3Text role="titleLarge" component="h1">
            {title}
          </EpisM3Text>
          {subtitle ? (
            <EpisM3Text role="bodyMedium" color="text.secondary">
              {subtitle}
            </EpisM3Text>
          ) : null}
        </Box>
      </Stack>

      {demoBadge ? <EpisDemoBadgeChip label={demoBadge} sx={{ alignSelf: 'flex-start' }} /> : null}

      <Tabs
        value={activeTab}
        onChange={(_, v) => onTabChange(String(v))}
        variant="scrollable"
        allowScrollButtonsMobile
        sx={{
          width: '100%',
          borderBottom: 1,
          borderColor: 'divider',
          minHeight: 48,
        }}
        data-testid="epis2-dashboard-tabs"
      >
        {tabs.map((t) => (
          <Tab
            key={t.value}
            label={t.label}
            value={t.value}
            {...(t['data-testid'] ? { 'data-testid': t['data-testid'] } : {})}
          />
        ))}
      </Tabs>

      <Box component="section" sx={{ width: '100%' }} data-testid="epis2-dashboard-panel">
        {children}
      </Box>

      {showFooterBack ? (
        <>
          <Divider />
          <EpisButton
            appearance="text"
            onClick={onBackToCommand}
            data-testid="epis2-back-to-command"
          >
            {backLabel}
          </EpisButton>
        </>
      ) : null}
    </Stack>
  );
}
