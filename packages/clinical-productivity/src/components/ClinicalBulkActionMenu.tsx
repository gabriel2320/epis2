import { copy } from '@epis2/design-system';
import { EpisButton, EpisChip, Stack, Typography } from '@epis2/epis2-ui';

export type ClinicalBulkActionItem = {
  id: string;
  label: string;
  onClick: () => void;
  destructive?: boolean;
  requiresConfirmation?: boolean;
};

export type ClinicalBulkActionMenuProps = {
  selectedCount: number;
  actions: ClinicalBulkActionItem[];
  onClearSelection: () => void;
  confirmDestructive?: (label: string) => boolean;
  testId?: string;
};

const RISKY = new Set(['firmar', 'aprobar', 'eliminar', 'cerrar', 'enviar']);

function isRiskyAction(label: string): boolean {
  const lower = label.toLowerCase();
  return [...RISKY].some((word) => lower.includes(word));
}

/** Acciones masivas — solo con selección activa; riesgosas confirman. */
export function ClinicalBulkActionMenu({
  selectedCount,
  actions,
  onClearSelection,
  confirmDestructive,
  testId = 'epis2-clinical-bulk-menu',
}: ClinicalBulkActionMenuProps) {
  if (selectedCount <= 0) return null;

  const run = (action: ClinicalBulkActionItem) => {
    const needsConfirm =
      action.requiresConfirmation || action.destructive || isRiskyAction(action.label);
    if (needsConfirm) {
      const ok = confirmDestructive
        ? confirmDestructive(action.label)
        : window.confirm(copy.uiSimplify.bulkConfirm.replace('{action}', action.label));
      if (!ok) return;
    }
    action.onClick();
  };

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      flexWrap="wrap"
      data-testid={testId}
      sx={{ py: 1, px: 1.5, bgcolor: 'action.selected', borderRadius: 1 }}
    >
      <EpisChip
        size="small"
        label={copy.uiSimplify.bulkSelected.replace('{count}', String(selectedCount))}
        variant="filled"
      />
      {actions.map((action) => (
        <EpisButton
          key={action.id}
          size="small"
          appearance={action.destructive ? 'outlined' : 'text'}
          onClick={() => run(action)}
          data-testid={`${testId}-${action.id}`}
        >
          {action.label}
        </EpisButton>
      ))}
      <EpisButton appearance="text" size="small" onClick={onClearSelection}>
        {copy.uiSimplify.bulkClear}
      </EpisButton>
      <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
        {copy.uiSimplify.bulkHint}
      </Typography>
    </Stack>
  );
}
