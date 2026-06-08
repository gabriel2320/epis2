import { copy } from '@epis2/design-system';
import { EpisTextField, Stack, Typography } from '@epis2/epis2-ui';
import { useState, type ChangeEvent } from 'react';
import { expandClinicalSnippet } from '../snippets/clinicalSnippets.js';
import { createTextOrigin } from '../safety/textOrigin.js';

export type ClinicalRichTextEditorProps = {
  label: string;
  value: string;
  onChange: (value: string, origin?: ReturnType<typeof createTextOrigin>) => void;
  minRows?: number;
  testId?: string;
};

/** Editor clínico Fase B — plain text + snippets; Tiptap headless pendiente. */
export function ClinicalRichTextEditor({
  label,
  value,
  onChange,
  minRows = 8,
  testId = 'epis2-clinical-rich-text',
}: ClinicalRichTextEditorProps) {
  const [hint, setHint] = useState<string | undefined>();

  return (
    <Stack spacing={0.5}>
      <EpisTextField
        label={label}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
          onChange(e.target.value, createTextOrigin('manual', 'Teclado'))
        }
        onBlur={() => {
          const { expanded, snippet } = expandClinicalSnippet(value);
          if (snippet) {
            onChange(expanded, createTextOrigin('snippet', snippet.trigger));
            setHint(copy.clinicalProductivity.snippetInserted.replace('{trigger}', snippet.trigger));
          }
        }}
        multiline
        minRows={minRows}
        fullWidth
        data-testid={testId}
      />
      {hint ? (
        <Typography variant="caption" color="text.secondary">
          {hint}
        </Typography>
      ) : null}
    </Stack>
  );
}

export { expandClinicalSnippet as ClinicalSnippetExpander };
