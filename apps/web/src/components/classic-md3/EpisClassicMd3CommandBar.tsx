import { EPIS_COMMAND_BAR_MAX_SUGGESTIONS } from '../../quality/uiDensityRules.js';
import { EpisUniversalCommandBar } from '../command/EpisUniversalCommandBar.js';

export type EpisClassicMd3CommandBarProps = {
  query: string;
  onQueryChange: (value: string) => void;
  onSubmit: () => void;
  suggestions?: readonly string[];
  onSuggestionSelect?: (label: string) => void;
  disabled?: boolean;
  testId?: string;
  embedded?: boolean;
};

/** Command bar clásica — delega en EpisUniversalCommandBar. */
export function EpisClassicMd3CommandBar({
  embedded = false,
  ...props
}: EpisClassicMd3CommandBarProps) {
  return (
    <EpisUniversalCommandBar
      variant="classic-contextual"
      query={props.query}
      onQueryChange={props.onQueryChange}
      onSubmit={props.onSubmit}
      suggestions={props.suggestions?.slice(0, EPIS_COMMAND_BAR_MAX_SUGGESTIONS)}
      onSuggestionSelect={props.onSuggestionSelect}
      disabled={props.disabled ?? false}
      testId={props.testId ?? 'epis2-classic-md3-command-bar'}
      embedded={embedded}
    />
  );
}
