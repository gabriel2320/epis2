import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import type { ReactNode } from 'react';
import { EpisButton } from '../primitives/EpisButton.js';
import { EpisDemoBadgeChip } from '../primitives/EpisDemoBadgeChip.js';
import { EpisM3Text } from '../primitives/EpisM3Text.js';
import { EpisAppearancePreferencesLink } from '../providers/EpisAppearancePreferencesLink.js';
import { EpisThemeModeToggle } from '../providers/EpisThemeModeToggle.js';
import { epis2CanvasSx, epis2IslandPaddingSx, epis2IslandSx } from '../theme/island-layout.js';
import { epis2Shape } from '../theme/shape.js';

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
    <Box sx={{ ...epis2CanvasSx, px: { xs: 3, sm: 4, md: 5 }, py: { xs: 4, md: 5 } }}>
      <Stack
        spacing={4}
        sx={{
          ...epis2IslandSx,
          ...epis2IslandPaddingSx,
          maxWidth,
          mx: 'auto',
        }}
        data-testid={testId}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={1}>
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
          <Stack direction="row" spacing={0.5} alignItems="center" flexShrink={0}>
            <EpisAppearancePreferencesLink data-testid="epis2-dashboard-appearance-link" />
            <EpisThemeModeToggle data-testid="epis2-dashboard-theme-toggle" />
            <EpisButton
              appearance="outlined"
              data-testid="epis2-back-to-command"
              onClick={onBackToCommand}
            >
              {backLabel}
            </EpisButton>
          </Stack>
        </Stack>

        {demoBadge ? (
          <EpisDemoBadgeChip label={demoBadge} sx={{ alignSelf: 'flex-start' }} />
        ) : null}

        <Box
          sx={{
            borderRadius: epis2Shape.large,
            border: 1,
            borderColor: 'divider',
            bgcolor: 'background.default',
          }}
        >
          <Tabs value={activeTab} onChange={(_, v) => onTabChange(String(v))} variant="scrollable">
            {tabs.map((t) => (
              <Tab
                key={t.value}
                label={t.label}
                value={t.value}
                {...(t['data-testid'] ? { 'data-testid': t['data-testid'] } : {})}
              />
            ))}
          </Tabs>
        </Box>

        <Box
          sx={{
            borderRadius: epis2Shape.large,
            p: { xs: 1, md: 2 },
            border: 1,
            borderColor: 'divider',
            bgcolor: 'background.default',
          }}
        >
          {children}
        </Box>

        {showFooterBack ? (
          <>
            <Divider />
            <EpisButton appearance="text" onClick={onBackToCommand}>
              {backLabel}
            </EpisButton>
          </>
        ) : null}
      </Stack>
    </Box>
  );
}
