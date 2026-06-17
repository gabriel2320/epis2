import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { EpisButton } from '../primitives/EpisButton.js';
import { EpisM3Text } from '../primitives/EpisM3Text.js';
import { cicaEpis2gVisual } from './cicaEpis2gVisual.js';
import { useCicaThemeTokens } from './useCicaThemeTokens.js';

export type CicaClinicalListItem = {
  id: string;
  primaryLabel: string;
  secondaryLabel?: string;
};

export type CicaClinicalListProps = {
  items: readonly CicaClinicalListItem[];
  emptyMessage: string;
  actionLabel: string;
  onOpenItem: (id: string) => void;
  testId?: string;
};

/** Lista clínica CICA — filas simples, sin grid administrativo ni shell legacy. */
export function CicaClinicalList({
  items,
  emptyMessage,
  actionLabel,
  onOpenItem,
  testId = 'cica-clinical-list',
}: CicaClinicalListProps) {
  const { isDark } = useCicaThemeTokens();

  if (items.length === 0) {
    return (
      <EpisM3Text role="bodyMedium" color="text.secondary" data-testid={`${testId}-empty`}>
        {emptyMessage}
      </EpisM3Text>
    );
  }

  return (
    <Stack spacing={2} data-testid={testId}>
      {items.map((item) => (
        <Box
          key={item.id}
          data-testid={`${testId}-row-${item.id}`}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            justifyContent: 'space-between',
            gap: 2,
            py: 2.5,
            px: 2.5,
            borderRadius: `${cicaEpis2gVisual.cardRadius}px`,
            border: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
            boxShadow: isDark ? 0 : 1,
            cursor: 'default',
            transition: 'border-color 150ms ease, box-shadow 150ms ease',
            '&:hover': {
              borderColor: cicaEpis2gVisual.cardHoverBorder,
              boxShadow: 2,
            },
          }}
        >
          <Stack direction="row" spacing={1.75} alignItems="flex-start" minWidth={0} flex={1}>
            <Box
              sx={{
                p: 1.25,
                borderRadius: 1,
                bgcolor: isDark ? 'rgba(37, 99, 235, 0.15)' : '#eff6ff',
                color: cicaEpis2gVisual.accentLabel,
                flexShrink: 0,
                display: 'flex',
              }}
            >
              <FavoriteOutlinedIcon sx={{ fontSize: 20 }} />
            </Box>
            <Stack spacing={0.25} minWidth={0}>
              <EpisM3Text role="titleMedium" component="h3">
                {item.primaryLabel}
              </EpisM3Text>
              {item.secondaryLabel ? (
                <EpisM3Text role="bodyMedium" color="text.secondary">
                  {item.secondaryLabel}
                </EpisM3Text>
              ) : null}
            </Stack>
          </Stack>
          <EpisButton
            variant="outlined"
            size="medium"
            onClick={() => onOpenItem(item.id)}
            data-testid={`cica-patient-search-open-${item.id}`}
            sx={{
              flexShrink: 0,
              alignSelf: { xs: 'stretch', sm: 'center' },
              borderRadius: 2,
            }}
          >
            {actionLabel}
          </EpisButton>
        </Box>
      ))}
    </Stack>
  );
}
