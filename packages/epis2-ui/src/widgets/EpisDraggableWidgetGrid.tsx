import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { useCallback, useState, type ReactNode } from 'react';
import { prefersReducedMotion } from '../theme/motion.js';
import { useEpis2ThemePreferences } from '../providers/EpisThemePreferences.js';
import { Epis2WidgetGrid } from './Epis2WidgetGrid.js';

export type EpisDraggableWidgetItem = {
  id: string;
  node: ReactNode;
};

export type EpisDraggableWidgetGridProps = {
  items: readonly EpisDraggableWidgetItem[];
  onReorder: (widgetIds: readonly string[]) => void;
  'data-testid'?: string;
};

/** Rejilla de widgets con reordenación por arrastre (HTML5 DnD). */
export function EpisDraggableWidgetGrid({
  items,
  onReorder,
  'data-testid': testId = 'epis2-draggable-widget-grid',
}: EpisDraggableWidgetGridProps) {
  const { preferences } = useEpis2ThemePreferences();
  const reducedMotion = preferences.motion === 'reduced' || prefersReducedMotion();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const reorder = useCallback(
    (sourceId: string, targetId: string) => {
      if (sourceId === targetId) return;
      const ids = items.map((item) => item.id);
      const from = ids.indexOf(sourceId);
      const to = ids.indexOf(targetId);
      if (from < 0 || to < 0) return;
      const next = [...ids];
      next.splice(from, 1);
      next.splice(to, 0, sourceId);
      onReorder(next);
    },
    [items, onReorder],
  );

  return (
    <Epis2WidgetGrid data-testid={testId}>
      {items.map((item) => (
        <Box
          key={item.id}
          draggable
          onDragStart={(event) => {
            setDraggingId(item.id);
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/plain', item.id);
          }}
          onDragEnd={() => {
            setDraggingId(null);
            setOverId(null);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setOverId(item.id);
          }}
          onDrop={(event) => {
            event.preventDefault();
            const sourceId = event.dataTransfer.getData('text/plain') || draggingId;
            if (sourceId) reorder(sourceId, item.id);
            setDraggingId(null);
            setOverId(null);
          }}
          sx={{
            gridColumn: 'span 12',
            position: 'relative',
            opacity: draggingId === item.id ? 0.65 : 1,
            outline: overId === item.id && draggingId !== item.id ? 2 : 0,
            outlineColor: 'primary.main',
            outlineOffset: 4,
            borderRadius: 2,
            transition: reducedMotion ? 'none' : 'opacity 150ms ease',
          }}
          data-testid={`epis2-widget-draggable-${item.id}`}
        >
          <IconButton
            size="small"
            aria-label="Arrastrar widget"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 1,
              bgcolor: 'background.paper',
              border: 1,
              borderColor: 'divider',
              cursor: 'grab',
              '&:active': { cursor: 'grabbing' },
            }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <DragIndicatorIcon fontSize="small" />
          </IconButton>
          {item.node}
        </Box>
      ))}
    </Epis2WidgetGrid>
  );
}
