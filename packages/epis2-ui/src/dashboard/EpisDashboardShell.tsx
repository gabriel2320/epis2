import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

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
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', px: 2, py: 3 }}>
      <Stack spacing={3} sx={{ maxWidth, mx: 'auto' }} data-testid={testId}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={1}>
          <Box>
            <Typography variant="h5" component="h1">
              {title}
            </Typography>
            {subtitle ? (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            ) : null}
          </Box>
          <Button variant="outlined" data-testid="epis2-back-to-command" onClick={onBackToCommand}>
            {backLabel}
          </Button>
        </Stack>

        {demoBadge ? (
          <Chip
            label={demoBadge}
            size="small"
            color="warning"
            variant="outlined"
            sx={{ alignSelf: 'flex-start' }}
          />
        ) : null}

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

        {children}

        {showFooterBack ? (
          <>
            <Divider />
            <Button variant="text" onClick={onBackToCommand}>
              {backLabel}
            </Button>
          </>
        ) : null}
      </Stack>
    </Box>
  );
}
