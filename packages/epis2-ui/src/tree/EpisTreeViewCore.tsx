import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import type { ReactNode } from 'react';

export type EpisTreeNode = {
  id: string;
  label: string;
  children?: EpisTreeNode[];
};

export type EpisTreeViewProps = {
  items: EpisTreeNode[];
  emptyMessage?: string;
  defaultExpandedItems?: string[];
  onItemClick?: (itemId: string) => void;
  'data-testid'?: string;
};

function renderTreeItems(nodes: EpisTreeNode[]): ReactNode {
  return nodes.map((node) => (
    <TreeItem key={node.id} itemId={node.id} label={node.label}>
      {node.children?.length ? renderTreeItems(node.children) : null}
    </TreeItem>
  ));
}

export function EpisTreeView({
  items,
  emptyMessage = 'Sin nodos.',
  defaultExpandedItems,
  onItemClick,
  'data-testid': testId,
}: EpisTreeViewProps) {
  if (items.length === 0) {
    return (
      <Box data-testid={testId}>
        <Typography variant="body2" color="text.secondary">
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      data-testid={testId}
      sx={{
        maxHeight: 360,
        overflow: 'auto',
        borderRadius: 2,
        bgcolor: 'background.paper',
        p: 1,
      }}
    >
      <SimpleTreeView
        {...(defaultExpandedItems ? { defaultExpandedItems } : {})}
        {...(onItemClick
          ? {
              onItemClick: (_event, itemId) => {
                onItemClick(itemId);
              },
            }
          : {})}
      >
        {renderTreeItems(items)}
      </SimpleTreeView>
    </Box>
  );
}
