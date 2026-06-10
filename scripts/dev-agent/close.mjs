#!/usr/bin/env node
/**
 * Cierre de sesión dev — checklist gates + plantilla reporte (sin auto-commit).
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const skipCheck = args.includes('--skip-check');

const gates = [
  { label: 'check (lint+types+arch)', cmd: 'npm', args: ['run', 'check'], optional: false },
  { label: 'test', cmd: 'npm', args: ['run', 'test'], optional: true },
  { label: 'db:validate', cmd: 'npm', args: ['run', 'db:validate'], optional: false },
];

console.log('EPIS2 dev:agent:close — checklist\n');

const results = [];
for (const gate of gates) {
  if (skipCheck && gate.label.startsWith('check')) {
    results.push({ ...gate, status: 'skipped' });
    console.log(`⊘ ${gate.label} (omitido)`);
    continue;
  }
  process.stdout.write(`▶ ${gate.label}… `);
  const r = spawnSync(gate.cmd, gate.args, {
    cwd: root,
    stdio: 'pipe',
    encoding: 'utf8',
    shell: true,
  });
  const ok = r.status === 0;
  results.push({ ...gate, status: ok ? 'ok' : 'fail' });
  console.log(ok ? 'OK' : 'FAIL');
  if (!ok && !gate.optional) {
    console.error((r.stdout ?? '') + (r.stderr ?? ''));
  }
}

const date = new Date().toISOString().slice(0, 10);
const reportPath = join(root, `reports/epis2-session-close-${date}.md`);
mkdirSync(join(root, 'reports'), { recursive: true });

const failed = results.filter((r) => r.status === 'fail');
const template = `# EPIS2 — Cierre sesión ${date}

## Gates

${results.map((r) => `- [${r.status === 'ok' ? 'x' : ' '}] ${r.label} (${r.status})`).join('\n')}

## Alcance

_(qué MF / archivos tocó esta sesión)_

## Decisiones

-

## Riesgos

-

## Próximo paso exacto

-

${failed.length ? `\n**Atención:** ${failed.length} gate(s) fallaron — corregir antes de commit.\n` : ''}
`;

writeFileSync(reportPath, template, 'utf8');
console.log(`\nPlantilla reporte → ${reportPath}`);
console.log('Completar alcance/riesgos/próximo paso antes de commit.');

process.exit(failed.some((f) => !gates.find((g) => g.label === f.label)?.optional) ? 1 : 0);
