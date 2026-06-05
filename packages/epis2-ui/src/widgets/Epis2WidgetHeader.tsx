import type { ReactNode } from 'react';
import { EpisChip } from '../primitives/EpisChip.js';
import { EpisM3Text } from '../primitives/EpisM3Text.js';
import Stack from '@mui/material/Stack';

export type Epis2WidgetHeaderProps = {
  title: string;
  description?: string;
  badge?: string;
  extra?: ReactNode;
};

export function Epis2WidgetHeader({ title, description, badge, extra }: Epis2WidgetHeaderProps) {
  return (
    <Stack spacing={0.5} data-testid="epis2-widget-header">
      <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap>
        <EpisM3Text role="titleMedium" component="h2">
          {title}
        </EpisM3Text>
        {badge ? <EpisChip size="small" label={badge} variant="outlined" /> : null}
        {extra}
      </Stack>
      {description ? (
        <EpisM3Text role="bodyMedium" color="text.secondary">
          {description}
        </EpisM3Text>
      ) : null}
    </Stack>
  );
}
