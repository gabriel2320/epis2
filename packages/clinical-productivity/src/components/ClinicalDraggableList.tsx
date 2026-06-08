import { copy } from '@epis2/design-system';
import { EpisButton, Stack, Typography } from '@epis2/epis2-ui';
import { useCallback, useState, type ReactNode } from 'react';

export type ClinicalDraggableListProps<T extends { id: string }> = {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  onReorder: (items: T[]) => void;
  editModeLabel?: string;
  saveLabel?: string;
  cancelLabel?: string;
  testId?: string;
};

/** DnD local seguro — modo edición explícito (dnd-kit en Fase E). */
export function ClinicalDraggableList<T extends { id: string }>({
  items,
  renderItem,
  onReorder,
  editModeLabel = copy.uiSimplify.dragEditMode,
  saveLabel = copy.uiSimplify.dragSave,
  cancelLabel = copy.uiSimplify.dragCancel,
  testId = 'epis2-clinical-draggable-list',
}: ClinicalDraggableListProps<T>) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(items);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const moveItem = useCallback((from: number, to: number) => {
    if (from === to) return;
    setDraft((current) => {
      const next = [...current];
      const removed = next.splice(from, 1)[0];
      if (!removed) return current;
      next.splice(to, 0, removed);
      return next;
    });
  }, []);

  return (
    <Stack spacing={1} data-testid={testId}>
      <Stack direction="row" spacing={1} justifyContent="flex-end">
        {editing ? (
          <>
            <EpisButton
              size="small"
              appearance="outlined"
              onClick={() => {
                setDraft(items);
                setEditing(false);
              }}
            >
              {cancelLabel}
            </EpisButton>
            <EpisButton
              size="small"
              appearance="filled"
              onClick={() => {
                onReorder(draft);
                setEditing(false);
              }}
            >
              {saveLabel}
            </EpisButton>
          </>
        ) : (
          <EpisButton
            size="small"
            appearance="text"
            onClick={() => {
              setDraft(items);
              setEditing(true);
            }}
          >
            {editModeLabel}
          </EpisButton>
        )}
      </Stack>
      <Stack spacing={1}>
        {draft.map((item, index) => (
          <Stack
            key={item.id}
            direction="row"
            spacing={1}
            alignItems="center"
            draggable={editing}
            onDragStart={() => setDragIndex(index)}
            onDragOver={(e: React.DragEvent) => e.preventDefault()}
            onDrop={() => {
              if (dragIndex !== null) moveItem(dragIndex, index);
              setDragIndex(null);
            }}
            sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 1 }}
          >
            {editing ? (
              <Typography component="span" aria-hidden data-testid={`${testId}-handle`}>
                ⋮⋮
              </Typography>
            ) : null}
            <Typography component="div" variant="body2" sx={{ flex: 1, minWidth: 0 }}>
              {renderItem(item, index)}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
