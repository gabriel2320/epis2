import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
export const LEDGER_PATH = join(ROOT, 'docs/quality/microphase-ledger.json');

const ID_PATTERN = /^MF-\d{3}$/;
const EXPECTED_FIRST = 151;
const EXPECTED_LAST = 182;

export function loadLedger(path = LEDGER_PATH) {
  const raw = readFileSync(path, 'utf8');
  return JSON.parse(raw);
}

export function validateLedger(ledger) {
  const errors = [];
  const warnings = [];
  const items = ledger.microphases ?? [];
  const validStates = new Set(ledger.states ?? []);

  if (items.length !== EXPECTED_LAST - EXPECTED_FIRST + 1) {
    errors.push(`Se esperan ${EXPECTED_LAST - EXPECTED_FIRST + 1} microfases; hay ${items.length}`);
  }

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
    if (item.state === 'DONE' && item.closureReport && !existsSync(join(ROOT, item.closureReport))) {
      warnings.push(`${item.id}: closureReport no existe aún: ${item.closureReport}`);
    }
  }

  for (let n = EXPECTED_FIRST; n <= EXPECTED_LAST; n += 1) {
    const id = `MF-${n}`;
    if (!byId.has(id)) {
      errors.push(`Falta microfase ${id}`);
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
      const target = byId.get(unblocks);
      if (target && !(target.dependsOn ?? []).includes(item.id)) {
        warnings.push(
          `${item.id} desbloquea ${unblocks} pero ${unblocks} no declara dependsOn ${item.id}`,
        );
      }
    }
  }

  const ready = items.filter((i) => i.state === 'READY');
  const inProgress = items.filter((i) => i.state === 'IN_PROGRESS');
  if (ready.length !== 1) {
    errors.push(`Debe haber exactamente 1 microfase READY; hay ${ready.length}: ${ready.map((i) => i.id).join(', ') || 'ninguna'}`);
  }
  if (inProgress.length > 1) {
    errors.push(`Como máximo 1 IN_PROGRESS; hay ${inProgress.length}`);
  }

  const sorted = topologicalSort(items, byId, errors);
  for (const id of sorted) {
    const item = byId.get(id);
    for (const dep of item.dependsOn ?? []) {
      const depItem = byId.get(dep);
      if (depItem?.state !== 'DONE' && item.state === 'READY') {
        errors.push(`${id} está READY pero dependencia ${dep} no está DONE (${depItem?.state})`);
      }
    }
  }

  return { ok: errors.length === 0, errors, warnings, ready: ready[0] ?? null, inProgress: inProgress[0] ?? null };
}

function topologicalSort(items, byId, errors) {
  const visited = new Set();
  const stack = new Set();
  const order = [];

  function visit(id) {
    if (stack.has(id)) {
      errors.push(`Ciclo de dependencias en ${id}`);
      return;
    }
    if (visited.has(id)) return;
    stack.add(id);
    const item = byId.get(id);
    for (const dep of item?.dependsOn ?? []) visit(dep);
    stack.delete(id);
    visited.add(id);
    order.push(id);
  }

  for (const item of items) visit(item.id);
  return order;
}

export function findNextReady(ledger) {
  const validation = validateLedger(ledger);
  if (!validation.ok) return { ...validation, next: null };
  return { ...validation, next: validation.ready };
}
