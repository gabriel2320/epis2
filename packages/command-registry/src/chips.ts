import { pickChipSampleEs } from './chip-samples.js';
import { filterDefinitionsForRole, getRoleAiCommandHints, isClinicalRole } from './roleSuggestions.js';
import type { ClinicalIntent } from './types.js';

export type CommandChip = {
  id: string;
  labelEs: string;
  sampleEs: string;
  intent: ClinicalIntent;
  aiAssisted?: boolean;
};

/** Chips del Centro de Comando (MVP v1). @deprecated Usar getCommandChipsForRole */
export function getMvpCommandChips(): CommandChip[] {
  return getCommandChipsForRole('physician', ['command.execute', 'dashboard.read']);
}

/** Frase demo para abrir Modo tablero desde el Centro de Comando. */
export const DASHBOARD_COMMAND_SAMPLE = 'abre el tablero' as const;

export function getCommandChipsForRole(
  role: string,
  permissions: readonly string[],
  options?: { aiAvailable?: boolean; maxChips?: number },
): CommandChip[] {
  const max = options?.maxChips ?? 8;
  const defs = filterDefinitionsForRole(role, permissions)
    .filter((def) => !def.intent.startsWith('open_dashboard') || def.intent !== 'open_dashboard')
    .sort((a, b) => b.priority - a.priority);

  const clinical = defs
    .filter((d) => d.requiredPermission === 'command.execute')
    .slice(0, max)
    .map((def) => ({
      id: def.intent,
      labelEs: def.labelEs,
      sampleEs: pickChipSampleEs(def.aliasesEs, def.labelEs),
      intent: def.intent,
    }));

  const dashboard = defs
    .filter((d) => d.requiredPermission === 'dashboard.read' || d.requiredPermission === 'audit.read')
    .slice(0, 3)
    .map((def) => ({
      id: def.intent,
      labelEs: def.labelEs,
      sampleEs: pickChipSampleEs(def.aliasesEs, def.labelEs),
      intent: def.intent,
    }));

  const aiHints = getRoleAiCommandHints(role, options?.aiAvailable ?? false).map((h, i) => ({
    id: `ai-hint-${i}`,
    labelEs: h.captionEs,
    sampleEs: h.sampleEs,
    intent: 'summarize_patient' as ClinicalIntent,
    aiAssisted: true as const,
  }));

  const seen = new Set<string>();
  const merged: CommandChip[] = [];
  for (const chip of [...aiHints, ...clinical, ...dashboard]) {
    const key = chip.sampleEs.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(chip);
  }
  return merged.slice(0, max + (options?.aiAvailable ? 2 : 0));
}

/** Presupuesto visual MF-UI-DENSITY — pantalla de decisión /comando. */
export const COMMAND_CENTER_DENSITY = {
  maxQuickChips: 4,
  maxCardChips: 0,
  maxContinueWorkRows: 5,
} as const;

/** Wire híbrido Centro de Comando — chips rápidos (+ tarjetas solo si density lo permite). */
export function getCommandCenterWireSuggestions(
  role: string,
  permissions: readonly string[],
  options?: { aiAvailable?: boolean; richCards?: boolean },
): { quickChips: CommandChip[]; cardChips: CommandChip[] } {
  const all = getCommandChipsForRole(role, permissions, {
    ...(options?.aiAvailable !== undefined ? { aiAvailable: options.aiAvailable } : {}),
    maxChips: 12,
  });
  const actionable = all.filter(
    (chip) => !chip.aiAssisted && !chip.intent.startsWith('open_dashboard'),
  );
  const cardLimit = options?.richCards ? 4 : COMMAND_CENTER_DENSITY.maxCardChips;
  return {
    quickChips: actionable.slice(0, COMMAND_CENTER_DENSITY.maxQuickChips),
    cardChips: cardLimit > 0 ? actionable.slice(0, cardLimit) : [],
  };
}

export function getCommandBarAiHint(role: string, aiAvailable: boolean): string | undefined {
  if (!isClinicalRole(role)) return undefined;
  if (!aiAvailable) {
    const off: Record<string, string> = {
      physician: 'IA local apagada — comandos y formularios manuales disponibles.',
      nurse: 'Sin asistencia de IA — notas y MAR se completan manualmente.',
      paramedic: 'Sin asistencia de IA — urgencias y triaje manual.',
      kinesiologist: 'Sin asistencia de IA — plan kinésico manual.',
      pharmacist: 'Sin asistencia de IA — validación farmacéutica manual.',
      admin: 'Sin asistencia de IA — tableros y auditoría operativos.',
      auditor: 'Sin asistencia de IA — tablero de calidad disponible.',
    };
    return off[role];
  }
  const on: Record<string, string> = {
    physician: 'IA local activa — asistencia en evolución, epicrisis y receta (siempre borrador).',
    nurse: 'IA local activa — apoyo en notas de enfermería y MAR (revisión humana).',
    paramedic: 'IA local activa — apoyo en triaje (revisión humana).',
    kinesiologist: 'IA local activa — apoyo en plan kinésico (revisión humana).',
    pharmacist: 'IA local activa — apoyo en validación farmacéutica (no dispensa).',
    admin: 'IA local activa — consultas en ficha; comandos de administración sin cambios.',
    auditor: 'IA local activa — lectura y trazabilidad; sin ejecución clínica.',
  };
  return on[role];
}
