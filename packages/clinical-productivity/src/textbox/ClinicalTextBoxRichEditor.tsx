import { Box } from '@epis2/epis2-ui';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useRef } from 'react';

export type ClinicalTextBoxRichEditorProps = {
  value: string;
  disabled?: boolean;
  minRows?: number;
  testId?: string;
  onFocus: () => void;
  onBlur: () => void;
  onPlainTextChange: (text: string) => void;
  onPastePlain: (raw: string) => void;
  onCopySelection: (selection: { start: number; end: number }) => void;
};

function plainTextFromEditorText(text: string): string {
  return text.replace(/\u00a0/g, ' ').trimEnd();
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function plainTextToHtml(text: string): string {
  if (!text.trim()) return '';
  return text
    .split('\n')
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join('');
}

/** Editor enriquecido Tiptap — valor canónico sigue siendo texto plano. */
export function ClinicalTextBoxRichEditor({
  value,
  disabled = false,
  minRows = 6,
  testId = 'epis2-clinical-textbox-rich',
  onFocus,
  onBlur,
  onPlainTextChange,
  onPastePlain,
  onCopySelection,
}: ClinicalTextBoxRichEditorProps) {
  const lastEmitted = useRef(value);

  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: false })],
    content: plainTextToHtml(value),
    editable: !disabled,
    onUpdate: ({ editor: ed }) => {
      const next = plainTextFromEditorText(ed.getText({ blockSeparator: '\n' }));
      if (next !== lastEmitted.current) {
        lastEmitted.current = next;
        onPlainTextChange(next);
      }
    },
    onFocus,
    onBlur,
    editorProps: {
      attributes: {
        'data-testid': `${testId}-input`,
        class: 'epis2-clinical-textbox-rich-root',
      },
      handlePaste: (_view, event) => {
        const text = event.clipboardData?.getData('text/plain') ?? '';
        if (!text) return false;
        event.preventDefault();
        onPastePlain(text);
        return true;
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = plainTextFromEditorText(editor.getText({ blockSeparator: '\n' }));
    if (value !== current && value !== lastEmitted.current) {
      lastEmitted.current = value;
      editor.commands.setContent(plainTextToHtml(value), { emitUpdate: false });
    }
  }, [editor, value]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [editor, disabled]);

  return (
    <Box
      data-testid={testId}
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        px: 1.5,
        py: 1,
        minHeight: minRows * 24,
        bgcolor: disabled ? 'action.disabledBackground' : 'background.paper',
        '& .epis2-clinical-textbox-rich-root': {
          outline: 'none',
          minHeight: minRows * 22,
          font: 'inherit',
          color: 'text.primary',
          '& p': { m: 0, mb: 0.75 },
          '& p:last-child': { mb: 0 },
        },
        '&:focus-within': {
          borderColor: 'primary.main',
          boxShadow: (theme) => `0 0 0 1px ${theme.palette.primary.main}`,
        },
      }}
      onCopy={() => {
        if (!editor) return;
        const { from, to } = editor.state.selection;
        onCopySelection({ start: from, end: to });
      }}
    >
      <EditorContent editor={editor} />
    </Box>
  );
}
