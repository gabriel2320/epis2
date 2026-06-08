import { copy } from '@epis2/design-system';
import { EpisButton, EpisContextMenu, Stack, type EpisContextMenuItem } from '@epis2/epis2-ui';
import { CLINICAL_SNIPPETS } from '../snippets/clinicalSnippets.js';
import { CLINICAL_SLASH_COMMANDS } from './clinicalTextCommands.js';
import { getTextboxSnippetMenuItems } from './clinicalSnippets.js';

export type ClinicalTextBoxMiniToolbarProps = {
  onCopy: () => void;
  onInsertPatient: () => void;
  onInsertMedications: () => void;
  onInsertLabs: () => void;
  onInsertSnippet: (body: string, trigger: string) => void;
  onSlashCommand: (command: string) => void;
  onReformulate: () => void;
  onSoapConvert: () => void;
  onDetectOmissions: () => void;
  disabled?: boolean;
  testId?: string;
};

const MAX_VISIBLE = 4;

/** Mini-toolbar contextual — máx. 4 acciones + menú ⋯ (MD3 sobrio). */
export function ClinicalTextBoxMiniToolbar({
  onCopy,
  onInsertPatient,
  onInsertMedications,
  onInsertLabs,
  onInsertSnippet,
  onSlashCommand,
  onReformulate,
  onSoapConvert,
  onDetectOmissions,
  disabled = false,
  testId = 'epis2-clinical-textbox-toolbar',
}: ClinicalTextBoxMiniToolbarProps) {
  const altaBody = CLINICAL_SNIPPETS.find((s) => s.trigger === '.alta')?.body ?? '';

  const overflowItems: EpisContextMenuItem[] = [
    ...CLINICAL_SLASH_COMMANDS.map((c) => ({
      id: c.command,
      label: c.label,
      onClick: () => onSlashCommand(c.command),
    })),
    { id: 'meds', label: copy.clinicalProductivity.textBoxInsertMeds, onClick: onInsertMedications },
    { id: 'labs', label: copy.clinicalProductivity.textBoxInsertLabs, onClick: onInsertLabs },
    { id: 'reformulate', label: copy.clinicalProductivity.textBoxReformulate, onClick: onReformulate },
    { id: 'soap', label: copy.clinicalProductivity.textBoxSoapConvert, onClick: onSoapConvert },
    { id: 'omissions', label: copy.clinicalProductivity.textBoxDetectOmissions, onClick: onDetectOmissions },
    ...getTextboxSnippetMenuItems()
      .filter((s) => !['.soap', '.alta'].includes(s.trigger))
      .map((s) => ({
        id: s.trigger,
        label: `${s.trigger} — ${s.title}`,
        onClick: () => onInsertSnippet(s.body, s.trigger),
      })),
  ];

  const visible = [
    { id: 'copy', label: copy.clinicalProductivity.textBoxCopy, onClick: onCopy },
    { id: 'patient', label: copy.clinicalProductivity.textBoxInsertPatient, onClick: onInsertPatient },
    {
      id: 'snippet-soap',
      label: '.soap',
      onClick: () => onInsertSnippet('S:\nO:\nA:\nP:\n', '.soap'),
    },
    {
      id: 'snippet-alta',
      label: '.alta',
      onClick: () => onInsertSnippet(altaBody, '.alta'),
    },
  ].slice(0, MAX_VISIBLE);

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      flexWrap="wrap"
      useFlexGap
      data-testid={testId}
      sx={{ py: 0.5 }}
    >
      {visible.map((action) => (
        <EpisButton
          key={action.id}
          size="small"
          appearance="text"
          disabled={disabled}
          onClick={action.onClick}
          data-testid={`${testId}-${action.id}`}
        >
          {action.label}
        </EpisButton>
      ))}
      <EpisContextMenu
        items={overflowItems}
        ariaLabel={copy.clinicalProductivity.textBoxMoreActions}
        testId={`${testId}-more`}
      />
    </Stack>
  );
}
