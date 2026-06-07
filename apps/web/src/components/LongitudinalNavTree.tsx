import { EpisWorkspaceSection, EpisTreeViewSuspense } from '@epis2/epis2-ui';
import type { PatientLongitudinalResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
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
    <EpisWorkspaceSection title={copy.tree.navTitle} testId="epis2-longitudinal-nav-tree">
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
    </EpisWorkspaceSection>
  );
}
