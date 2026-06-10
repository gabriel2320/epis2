import { copy } from '@epis2/design-system';
import { EpisButton, Stack, Typography } from '@epis2/epis2-ui';
import { useCallback, type ClipboardEvent, type ReactNode } from 'react';
import { createTextOrigin } from '../safety/textOrigin.js';

export type ClinicalCopyPasteToolsProps = {
  copyLabel?: string;
  pasteHint?: string;
  getCopyText: () => string;
  onPastePlain?: (text: string, origin: ReturnType<typeof createTextOrigin>) => void;
  aiSourceHint?: boolean;
  children?: ReactNode;
  testId?: string;
};

export function ClinicalCopyPasteTools({
  copyLabel = copy.uiSimplify.copyText,
  pasteHint = copy.uiSimplify.pasteHint,
  getCopyText,
  onPastePlain,
  aiSourceHint = false,
  children,
  testId = 'epis2-clinical-copy-paste',
}: ClinicalCopyPasteToolsProps) {
  const handleCopy = useCallback(async () => {
    const text = getCopyText();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* noop en test */
    }
  }, [getCopyText]);

  const handlePaste = useCallback(
    (event: ClipboardEvent<HTMLDivElement>) => {
      if (!onPastePlain) return;
      event.preventDefault();
      const plain = event.clipboardData.getData('text/plain');
      const fromAi = plain.includes('[IA]') || aiSourceHint;
      const origin = createTextOrigin(
        fromAi ? 'ai_suggestion' : 'paste',
        fromAi ? 'IA' : 'Portapapeles',
      );
      onPastePlain(plain.replace(/\[IA\]/g, '').trim(), origin);
    },
    [onPastePlain, aiSourceHint],
  );

  return (
    <Stack spacing={1} data-testid={testId}>
      <Stack direction="row" spacing={1} alignItems="center">
        <EpisButton size="small" appearance="text" onClick={() => void handleCopy()}>
          {copyLabel}
        </EpisButton>
        {onPastePlain ? (
          <Typography variant="caption" color="text.secondary">
            {pasteHint}
          </Typography>
        ) : null}
      </Stack>
      {onPastePlain ? (
        <div onPaste={handlePaste} data-testid={`${testId}-paste-zone`}>
          {children}
        </div>
      ) : (
        children
      )}
    </Stack>
  );
}
