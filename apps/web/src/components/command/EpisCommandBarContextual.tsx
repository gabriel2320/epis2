import { copy } from '@epis2/design-system';
import { Box, EpisCommandBar, type EpisCommandBarProps } from '@epis2/epis2-ui';

export type EpisCommandBarContextualProps = EpisCommandBarProps;

/**
 * Command bar contextual — reemplaza botones repetidos en workspaces.
 */
export function EpisCommandBarContextual({
  placeholder = copy.commandCenter.powerBarPlaceholder,
  label = copy.uiSimplify.contextualCommandLabel,
  ...rest
}: EpisCommandBarContextualProps) {
  return (
    <Box data-testid="epis2-contextual-command-bar">
      <EpisCommandBar
        label={label}
        placeholder={placeholder}
        {...rest}
      />
    </Box>
  );
}

/** Comando global del Centro de Comando. */
export { EpisCommandBar } from '@epis2/epis2-ui';
