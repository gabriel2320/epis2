import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useTheme } from '@mui/material/styles';
import type { ReactNode } from 'react';
import { EpisButton } from '../primitives/EpisButton.js';
import { EpisChip } from '../primitives/EpisChip.js';
import { EpisM3Text } from '../primitives/EpisM3Text.js';
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
  const theme = useTheme();
  const surfaces = theme.epis2?.surfaces;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: surfaces?.surfaceContainer ?? 'background.default',
        px: { xs: 2, md: 3 },
        py: 3,
      }}
    >
      <Stack
        spacing={3}
        sx={{
          maxWidth,
          mx: 'auto',
          p: { xs: 0, md: 2 },
          borderRadius: epis2Shape.large,
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
          <EpisButton
            appearance="outlined"
            data-testid="epis2-back-to-command"
            onClick={onBackToCommand}
          >
            {backLabel}
          </EpisButton>
        </Stack>

        {demoBadge ? (
          <EpisChip
            label={demoBadge}
            size="small"
            color="warning"
            variant="outlined"
            sx={{ alignSelf: 'flex-start' }}
          />
        ) : null}

        <Box
          sx={{
            bgcolor: surfaces?.surface ?? 'background.paper',
            borderRadius: epis2Shape.medium,
            border: 1,
            borderColor: surfaces?.outlineVariant ?? 'divider',
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
            bgcolor: surfaces?.surface ?? 'background.paper',
            borderRadius: epis2Shape.large,
            p: { xs: 1, md: 2 },
            border: 1,
            borderColor: surfaces?.outlineVariant ?? 'divider',
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
