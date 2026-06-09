import { EpisUniversalCommandBar } from '../command/EpisUniversalCommandBar.js';

export type EpisDashboardMd3CommandBarProps = {
  query: string;
  onQueryChange: (value: string) => void;
  onSubmit: () => void;
  suggestions?: readonly string[];
  onSuggestionSelect?: (label: string) => void;
  disabled?: boolean;
  testId?: string;
};

/** Command bar dashboard — delega en EpisUniversalCommandBar. */
export function EpisDashboardMd3CommandBar(props: EpisDashboardMd3CommandBarProps) {
  return (
    <EpisUniversalCommandBar
      variant="dashboard-operational"
      query={props.query}
      onQueryChange={props.onQueryChange}
      onSubmit={props.onSubmit}
      suggestions={props.suggestions}
      onSuggestionSelect={props.onSuggestionSelect}
      disabled={props.disabled ?? false}
      testId={props.testId ?? 'epis2-dashboard-md3-command-bar'}
    />
  );
}
