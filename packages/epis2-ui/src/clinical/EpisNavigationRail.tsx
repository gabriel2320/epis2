import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { EpisIconButton } from '../primitives/EpisIconButton.js';
import { EpisM3Text } from '../primitives/EpisM3Text.js';
import { epis2NavigationRailSx } from './patient-chart-tokens.js';

import Divider from '@mui/material/Divider';

export type EpisNavigationRailItem = {
  id: string;
  label: string;
  icon?: ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  href?: string;
  variant?: 'item' | 'divider';
  'data-testid'?: string;
};

export type EpisNavigationRailProps = {
  items: EpisNavigationRailItem[];
  footer?: ReactNode;
  testId?: string;
};

/** Nivel 0 — Navigation Rail MD3 anclado (sin drawer oculto). */
export function EpisNavigationRail({
  items,
  footer,
  testId = 'epis2-navigation-rail',
}: EpisNavigationRailProps) {
  return (
    <Box
      component="nav"
      aria-label="Navegación principal"
      sx={epis2NavigationRailSx}
      data-testid={testId}
    >
      <Box
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, flex: 1 }}
      >
        {items.map((item) => {
          if (item.variant === 'divider') {
            return (
              <Divider
                key={item.id}
                flexItem
                sx={{ width: '70%', my: 1, borderColor: 'divider' }}
                data-testid={item['data-testid'] ?? 'epis2-nav-rail-divider'}
              />
            );
          }

          const button = (
            <EpisIconButton
              aria-label={item.label}
              color={item.active ? 'primary' : 'default'}
              {...(item.disabled ? { disabled: true } : {})}
              {...(item.onClick ? { onClick: item.onClick } : {})}
              {...(item.active ? { 'aria-current': 'page' as const } : {})}
              data-testid={item['data-testid'] ?? `epis2-nav-rail-${item.id}`}
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                bgcolor: item.active ? 'action.selected' : 'transparent',
              }}
            >
              {item.icon}
            </EpisIconButton>
          );

          return (
            <Tooltip key={item.id} title={item.label} placement="right">
              <Box
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.25 }}
              >
                {button}
                <EpisM3Text
                  role="labelMedium"
                  color={item.active ? 'primary.main' : 'text.secondary'}
                  sx={{ textAlign: 'center', maxWidth: 72, lineHeight: 1.2 }}
                >
                  {item.label}
                </EpisM3Text>
              </Box>
            </Tooltip>
          );
        })}
      </Box>
      {footer ? <Box sx={{ pb: 1 }}>{footer}</Box> : null}
    </Box>
  );
}
