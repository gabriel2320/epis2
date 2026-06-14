import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
export const FICHA_FIRST_LEDGER_PATH = join(ROOT, 'docs/quality/ficha-first-ledger.json');

const ID_PATTERN = /^MF-FF-\d{2}$/;

/** @param {string} [path] */
export function loadFichaFirstLedger(path = FICHA_FIRST_LEDGER_PATH) {
  const raw = readFileSync(path, 'utf8');
  return JSON.parse(raw);
}

/** @param {ReturnType<typeof loadFichaFirstLedger>} ledger */
export function validateFichaFirstLedger(ledger) {
  const errors = [];
  const warnings = [];
  const items = ledger.phases ?? [];
  const validStates = new Set(ledger.states ?? []);

  const byId = new Map();
  for (const item of items) {
    if (!ID_PATTERN.test(item.id)) {
      errors.push(`ID inválido: ${item.id}`);
      continue;
    }
    if (byId.has(item.id)) {
      errors.push(`ID duplicado: ${item.id}`);
    }
    byId.set(item.id, item);

    if (!validStates.has(item.state)) {
      errors.push(`${item.id}: estado inválido ${item.state}`);
    }
    if (item.state === 'DONE' && !item.closureReport) {
      errors.push(`${item.id}: DONE requiere closureReport`);
    }
    if (
      item.state === 'DONE' &&
      item.closureReport &&
      !existsSync(join(ROOT, item.closureReport))
    ) {
      warnings.push(`${item.id}: closureReport no existe aún: ${item.closureReport}`);
    }
  }

  for (const item of items) {
    for (const dep of item.dependsOn ?? []) {
      if (!byId.has(dep)) {
        errors.push(`${item.id}: dependencia desconocida ${dep}`);
      }
    }
    for (const unblocks of item.unblocks ?? []) {
      if (!byId.has(unblocks)) {
        errors.push(`${item.id}: unblocks desconocido ${unblocks}`);
      }
    }
  }

  const ready = items.filter((i) => i.state === 'READY');
  const inProgress = items.filter((i) => i.state === 'IN_PROGRESS');
  const allDone = items.length > 0 && items.every((i) => i.state === 'DONE');

  if (ledger.executionStatus === 'ACTIVE' && !allDone) {
    if (ready.length !== 1) {
      errors.push(
        `Debe haber exactamente 1 fase READY; hay ${ready.length}: ${ready.map((i) => i.id).join(', ') || 'ninguna'}`,
      );
    }
    if (inProgress.length > 1) {
      errors.push(`Como máximo 1 IN_PROGRESS; hay ${inProgress.length}`);
    }
    for (const item of ready) {
      for (const dep of item.dependsOn ?? []) {
        const depItem = byId.get(dep);
        if (depItem?.state !== 'DONE') {
          errors.push(
            `${item.id} está READY pero dependencia ${dep} no está DONE (${depItem?.state})`,
          );
        }
      }
    }
  }

  const doneCount = items.filter((i) => i.state === 'DONE').length;

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    ready: ready[0] ?? null,
    inProgress: inProgress[0] ?? null,
    phases: items,
    byId,
    doneCount,
    total: items.length,
    allDone,
  };
}

/** @param {ReturnType<typeof loadFichaFirstLedger>} ledger */
export function findNextFichaFirstPhase(ledger) {
  const validation = validateFichaFirstLedger(ledger);
  if (!validation.ok) return { ...validation, next: null };
  if (validation.allDone || ledger.executionStatus === 'CLOSED') {
    return { ...validation, next: null, complete: true };
  }
  return { ...validation, next: validation.ready ?? validation.inProgress, complete: false };
}
