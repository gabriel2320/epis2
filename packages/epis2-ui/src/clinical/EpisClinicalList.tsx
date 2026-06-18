import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { EpisButton } from '../primitives/EpisButton.js';
import { EpisM3Text } from '../primitives/EpisM3Text.js';
import { cicaEpis2gVisual } from '../cica/cicaEpis2gVisual.js';
import { useCicaThemeTokens } from '../cica/useCicaThemeTokens.js';

export type EpisClinicalListItem = {
  id: string;
  primaryLabel: string;
  secondaryLabel?: string;
};

export type EpisClinicalListVisualProfile = 'default' | 'cica';

export type EpisClinicalListProps = {
  items: readonly EpisClinicalListItem[];
  emptyMessage: string;
  actionLabel: string;
  onOpenItem: (id: string) => void;
  visualProfile?: EpisClinicalListVisualProfile;
  testId?: string;
  emptyTestId?: string;
  rowTestId?: (id: string) => string;
  openButtonTestId?: (id: string) => string;
};

function defaultRowTestId(id: string): string {
  return `epis2-patient-search-result-${id}`;
}

function defaultOpenTestId(id: string): string {
  return `epis2-patient-search-open-${id}`;
}

function cicaRowTestId(testId: string, id: string): string {
  return `${testId}-row-${id}`;
}

/** Lista clínica compartida — CICA y legacy búsqueda/censo (MF-PONY-05). */
export function EpisClinicalList({
  items,
  emptyMessage,
  actionLabel,
  onOpenItem,
  visualProfile = 'default',
  testId,
  emptyTestId,
  rowTestId,
  openButtonTestId,
}: EpisClinicalListProps) {
  const isCica = visualProfile === 'cica';
  const { isDark } = useCicaThemeTokens();
  const listTestId = testId ?? (isCica ? 'cica-clinical-list' : 'epis2-patient-search-results');
  const emptyId = emptyTestId ?? (isCica ? `${listTestId}-empty` : 'epis2-patient-search-empty');
  const resolveRowTestId = rowTestId ?? (isCica ? (id) => cicaRowTestId(listTestId, id) : defaultRowTestId);
  const resolveOpenTestId =
    openButtonTestId ?? (isCica ? (id) => `cica-patient-search-open-${id}` : defaultOpenTestId);

  if (items.length === 0) {
    return (
      <EpisM3Text role="bodyMedium" color="text.secondary" data-testid={emptyId}>
        {emptyMessage}
      </EpisM3Text>
    );
  }

  return (
    <Stack spacing={isCica ? 2 : 1.5} data-testid={listTestId}>
      {items.map((item) => (
        <Box
          key={item.id}
          data-testid={resolveRowTestId(item.id)}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            justifyContent: 'space-between',
            gap: isCica ? 2 : 1.5,
            py: isCica ? 2.5 : 2,
            px: isCica ? 2.5 : 2,
            borderRadius: isCica ? `${cicaEpis2gVisual.cardRadius}px` : 2,
            border: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
            ...(isCica
              ? {
                  boxShadow: isDark ? 0 : 1,
                  cursor: 'default',
                  transition: 'border-color 150ms ease, box-shadow 150ms ease',
                  '&:hover': {
                    borderColor: cicaEpis2gVisual.cardHoverBorder,
                    boxShadow: 2,
                  },
                }
              : {}),
          }}
        >
          <Stack
            direction={isCica ? 'row' : 'column'}
            spacing={isCica ? 1.75 : 0.25}
            alignItems={isCica ? 'flex-start' : undefined}
            minWidth={0}
            flex={isCica ? 1 : undefined}
          >
            {isCica ? (
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
            ) : null}
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
            data-testid={resolveOpenTestId(item.id)}
            sx={{
              flexShrink: 0,
              alignSelf: { xs: 'stretch', sm: 'center' },
              ...(isCica ? { borderRadius: 2 } : {}),
            }}
          >
            {actionLabel}
          </EpisButton>
        </Box>
      ))}
    </Stack>
  );
}
