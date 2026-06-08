export type ClinicalSlashCommand = {
  command: string;
  label: string;
  template: string;
};

export const CLINICAL_SLASH_COMMANDS: readonly ClinicalSlashCommand[] = [
  {
    command: '/diagnostico',
    label: 'Diagnóstico',
    template: 'Diagnóstico:\n- \n',
  },
  {
    command: '/orden',
    label: 'Orden clínica',
    template: 'Orden:\n- \n',
  },
  {
    command: '/examen',
    label: 'Examen',
    template: 'Exámenes solicitados:\n- \n',
  },
  {
    command: '/resumen',
    label: 'Resumen breve',
    template: 'Resumen:\n',
  },
];

export function applySlashCommand(text: string, command: string): string | undefined {
  const hit = CLINICAL_SLASH_COMMANDS.find((c) => c.command === command);
  if (!hit) return undefined;
  const lines = text.split('\n');
  const last = lines[lines.length - 1] ?? '';
  if (!last.trim().startsWith(command)) return undefined;
  lines[lines.length - 1] = hit.template.trimEnd();
  return `${lines.slice(0, -1).join('\n')}${lines.length > 1 ? '\n' : ''}${hit.template}`;
}

export function detectSlashCommandAtCursor(text: string): ClinicalSlashCommand | undefined {
  const line = text.split('\n').pop() ?? '';
  const token = line.trim().split(/\s+/).pop() ?? '';
  return CLINICAL_SLASH_COMMANDS.find((c) => token === c.command);
}
