import { EpisButton } from '../primitives/EpisButton.js';
import Stack from '@mui/material/Stack';

export type Epis2WidgetAction = {
  id: string;
  label: string;
  onClick?: () => void;
  href?: string;
};

export type Epis2WidgetActionsProps = {
  actions: readonly Epis2WidgetAction[];
};

/** Acciones que conducen a comando o página — sin escritura clínica directa. */
export function Epis2WidgetActions({ actions }: Epis2WidgetActionsProps) {
  if (!actions.length) return null;

  return (
    <Stack
      direction="row"
      spacing={1}
      flexWrap="wrap"
      useFlexGap
      data-testid="epis2-widget-actions"
      sx={{ pt: 0.5 }}
    >
      {actions.map((action) => (
        <EpisButton
          key={action.id}
          size="small"
          variant="outlined"
          {...(action.href ? { component: 'a', href: action.href } : {})}
          {...(action.onClick ? { onClick: action.onClick } : {})}
        >
          {action.label}
        </EpisButton>
      ))}
    </Stack>
  );
}
