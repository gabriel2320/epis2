import { copy } from '@epis2/design-system';
import { EpisButton, EpisSplitPane, Stack } from '@epis2/epis2-ui';
import { useCallback, useEffect, useState, type ReactNode } from 'react';

const STORAGE_PREFIX = 'epis2-split-workspace:';

export type EpisSplitWorkspaceMode = 'document' | 'aiSummary' | 'comparison' | 'timeline';

export type EpisSplitWorkspaceProps = {
  primary: ReactNode;
  secondary?: ReactNode;
  /** Clave única para persistir preferencia local. */
  persistKey: string;
  mode?: EpisSplitWorkspaceMode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  openLabel?: string;
  closeLabel?: string;
  toggleTestId?: string;
  testId?: string;
};

/**
 * MD3 supporting pane — panel secundario opcional, colapsable, sin ActionBar global.
 */
export function EpisSplitWorkspace({
  primary,
  secondary,
  persistKey,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  openLabel = copy.uiSimplify.splitOpen,
  closeLabel = copy.uiSimplify.splitClose,
  toggleTestId,
  testId = 'epis2-split-workspace',
}: EpisSplitWorkspaceProps) {
  const storageKey = `${STORAGE_PREFIX}${persistKey}`;

  const [internalOpen, setInternalOpen] = useState(() => {
    if (typeof window === 'undefined') return defaultOpen;
    const stored = window.localStorage.getItem(storageKey);
    if (stored === '1') return true;
    if (stored === '0') return false;
    return defaultOpen;
  });

  const open = controlledOpen ?? internalOpen;

  const setOpen = useCallback(
    (value: boolean | ((prev: boolean) => boolean)) => {
      const next = typeof value === 'function' ? value(open) : value;
      if (onOpenChange) {
        onOpenChange(next);
      } else {
        setInternalOpen(next);
      }
    },
    [onOpenChange, open],
  );

  useEffect(() => {
    if (controlledOpen === undefined) {
      window.localStorage.setItem(storageKey, open ? '1' : '0');
    }
  }, [open, storageKey, controlledOpen]);

  const toggle = useCallback(() => {
    setOpen((value) => !value);
  }, []);

  const canSplit = Boolean(secondary);

  return (
    <Stack spacing={1} data-testid={testId} sx={{ width: '100%' }}>
      {canSplit ? (
        <Stack direction="row" justifyContent="flex-end">
          {/* primary.dark (onPrimaryContainer M3): primary no alcanza 4.5:1 sobre surfaceContainer (MF-NORM-401b). */}
          <EpisButton
            appearance="text"
            size="small"
            onClick={toggle}
            data-testid={toggleTestId ?? `${testId}-toggle`}
            sx={{ color: 'primary.dark' }}
          >
            {open ? closeLabel : openLabel}
          </EpisButton>
        </Stack>
      ) : null}
      <EpisSplitPane
        primary={primary}
        secondary={secondary}
        secondaryOpen={open && canSplit}
        testId={`${testId}-pane`}
      />
    </Stack>
  );
}
