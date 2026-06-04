import { EPIS2_COMMAND_DEFINITIONS } from './definitions.js';

export type CommandChip = {
  id: string;
  labelEs: string;
  sampleEs: string;
};

/** Chips del Centro de Comando (MVP v1). */
export function getMvpCommandChips(): CommandChip[] {
  return EPIS2_COMMAND_DEFINITIONS.filter((def) => !def.intent.startsWith('open_dashboard')).map(
    (def) => ({
    id: def.intent,
    labelEs: def.labelEs,
      sampleEs: def.aliasesEs[0] ?? def.labelEs,
    }),
  );
}

/** Frase demo para abrir Modo tablero desde el Centro de Comando. */
export const DASHBOARD_COMMAND_SAMPLE = 'abre el tablero' as const;
