import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { EpisCard } from '../primitives/EpisCard.js';

export type EpisTaskListItem = {
  id: string;
  label: string;
  actionLabel: string;
  disabled?: boolean;
  onAction: () => void;
};

export type EpisTaskListProps = {
  title: string;
  items: EpisTaskListItem[];
  emptyMessage?: string;
  'data-testid'?: string;
};

export function EpisTaskList({
  title,
  items,
  emptyMessage,
  'data-testid': testId,
}: EpisTaskListProps) {
  return (
    <EpisCard variant="outlined" sx={{ p: 2 }} data-testid={testId}>
      <Typography variant="subtitle2" gutterBottom>
        {title}
      </Typography>
      {items.length === 0 && emptyMessage ? (
        <Typography variant="body2" color="text.secondary">
          {emptyMessage}
        </Typography>
      ) : (
        <Stack spacing={1}>
          {items.map((task) => (
            <Stack key={task.id} direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" sx={{ flex: 1 }}>
                {task.label}
              </Typography>
              <Button
                size="small"
                variant="text"
                {...(task.disabled ? { disabled: true } : {})}
                onClick={task.onAction}
              >
                {task.actionLabel}
              </Button>
            </Stack>
          ))}
        </Stack>
      )}
    </EpisCard>
  );
}
