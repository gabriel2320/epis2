#!/usr/bin/env node
/**
 * Siguiente microfase PROG-PAPER-MODE (ledger JSON).
 *   npm run quality:paper-mode-next
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const ledgerPath = join(root, 'docs/quality/paper-mode-ledger.json');

const ledger = JSON.parse(readFileSync(ledgerPath, 'utf8'));

const ready = ledger.phases.find((p) => p.state === 'READY');
const inProgress = ledger.phases.find((p) => p.state === 'IN_PROGRESS');

const next =
  inProgress ??
  ready ??
  ledger.phases.find((p) => p.state === 'BLOCKED' && p.dependsOn.every((dep) => {
    const d = ledger.phases.find((x) => x.id === dep);
    return d?.state === 'DONE';
  }));

const out = {
  program: ledger.program,
  roadmap: ledger.roadmap,
  prerequisite: ledger.prerequisite,
  active: next ?? null,
  plan: ledger.canonicalPlan,
  prompt: 'reports/dev-agent-prompt-paper-mode.md',
};

console.log(JSON.stringify(out, null, 2));

if (!next) {
  console.error('No hay microfase READY/IN_PROGRESS/BLOCKED desbloqueada.');
  process.exit(1);
}
