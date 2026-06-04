import { EPIS2_COMMAND_DEFINITIONS } from './definitions.js';

export type CommandChip = {
  id: string;
  labelEs: string;
  sampleEs: string;
};

/** Chips del Centro de Comando (MVP v1). */
export function getMvpCommandChips(): CommandChip[] {
  return EPIS2_COMMAND_DEFINITIONS.map((def) => ({
    id: def.intent,
    labelEs: def.labelEs,
    sampleEs: def.aliasesEs[0] ?? def.labelEs,
  }));
}
