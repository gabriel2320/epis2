import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { EpisButton } from '../primitives/EpisButton.js';
import { EpisM3Text } from '../primitives/EpisM3Text.js';
import { cicaTokens } from './cicaTokens.js';

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
  if (items.length === 0) {
    return (
      <EpisM3Text
        role="bodyMedium"
        color="text.secondary"
        data-testid={`${testId}-empty`}
      >
        {emptyMessage}
      </EpisM3Text>
    );
  }

  return (
    <Stack spacing={1.5} data-testid={testId}>
      {items.map((item) => (
        <Box
          key={item.id}
          data-testid={`${testId}-row-${item.id}`}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            justifyContent: 'space-between',
            gap: cicaTokens.unit / 4,
            py: 2,
            px: 2,
            borderRadius: 1.5,
            border: 1,
            borderColor: cicaTokens.borderColor,
            bgcolor: 'background.paper',
          }}
        >
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
          <EpisButton
            variant="outlined"
            size="medium"
            onClick={() => onOpenItem(item.id)}
            data-testid={`cica-patient-search-open-${item.id}`}
            sx={{ flexShrink: 0, alignSelf: { xs: 'stretch', sm: 'center' } }}
          >
            {actionLabel}
          </EpisButton>
        </Box>
      ))}
    </Stack>
  );
}
