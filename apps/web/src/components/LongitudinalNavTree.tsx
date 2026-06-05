import type { PatientLongitudinalResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import { EpisTreeViewSuspense, Paper, Typography } from '@epis2/epis2-ui';
import { buildLongitudinalSectionTree, resolveTimelineDraftId } from '../tree/longitudinalTree.js';

export type LongitudinalNavTreeProps = {
  data: PatientLongitudinalResponse;
  onOpenDraft?: (draftId: string) => void;
};

export function LongitudinalNavTree({ data, onOpenDraft }: LongitudinalNavTreeProps) {
  const items = buildLongitudinalSectionTree(data);
  if (items.length === 0) return null;

  const defaultExpanded = items.slice(0, 2).map((n) => n.id);

  return (
    <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-longitudinal-nav-tree">
      <Typography variant="subtitle2" gutterBottom>
        {copy.tree.navTitle}
      </Typography>
      <EpisTreeViewSuspense
        items={items}
        defaultExpandedItems={defaultExpanded}
        emptyMessage={copy.tree.empty}
        loadingLabel={copy.tree.loading}
        onItemClick={(itemId) => {
          const draftId = resolveTimelineDraftId(data, itemId);
          if (draftId && onOpenDraft) onOpenDraft(draftId);
        }}
        data-testid="epis2-longitudinal-tree"
      />
    </Paper>
  );
}
