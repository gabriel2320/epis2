#!/usr/bin/env node
/**
 * Genera brief de sesión para la fase READY de PROG-DUAL-CHART.
 *
 *   npm run dev:dual-chart:session
 *   npm run dev:dual-chart:session -- --write
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadDualChartLedger, findNextDualChartPhase } from '../quality/dual-chart-ledger-lib.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const shouldWrite = args.includes('--write') || !args.includes('--stdout');

const ledger = loadDualChartLedger();
const result = findNextDualChartPhase(ledger);

if (!result.ok) {
  console.error('Ledger inválido:');
  for (const e of result.errors) console.error(`  - ${e}`);
  process.exit(1);
}

const phase = result.next;
if (!phase) {
  console.log('PROG-DUAL-CHART completo — sin fase READY.');
  process.exit(0);
}

const lines = [
  '# EPIS2 — Brief sesión PROG-DUAL-CHART',
  '',
  `> Generado: ${new Date().toISOString().slice(0, 10)} · \`npm run dev:dual-chart:session\``,
  '',
  '## Alcance SDEPIS2',
  '',
  `| Campo | Valor |`,
  `|-------|-------|`,
  `| Programa | PROG-DUAL-CHART |`,
  `| Fase | **${phase.id}** — ${phase.name} |`,
  `| ADR | [ADR-002](docs/adr/ADR-002-dual-chart-modes.md) |`,
  `| Estado ledger | ${phase.state} |`,
  '',
  '## Objetivo único de sesión',
  '',
  ...phase.evidenceRequired.map((e) => `- [ ] ${e}`),
  '',
  '## Archivos permitidos',
  '',
  '```text',
  (phase.allowedPaths ?? []).join('\n'),
  '```',
  '',
  '## Prohibido esta sesión',
  '',
  '- Segundo registry temporal',
  '- Import EPIS sin manifest',
  '- Romper `three-modes-journey.spec.ts`',
  '- `@mui/*` directo desde apps/web',
  '- IA que apruebe o firme',
  '',
  '## Comandos automatizados',
  '',
  '```bash',
  'npm run stack:dev                    # una vez al día',
  'npm run dev:dual-chart:session       # este brief',
  'npm run quality:dual-chart-next      # JSON fase activa',
  `npm run quality:dual-chart-plan -- --phase ${phase.phase} --verify`,
  'VITE_ENABLE_DUAL_CHART_MODES=true npm run dev:web',
  '# Preview: http://localhost:5173/dev/chart-modes',
  '',
  '# Cierre fase (cuando gate pase):',
  `npm run quality:dual-chart-plan -- --phase ${phase.phase} --verify --e2e --legacy`,
  'npm run dev:agent:close',
  '```',
  '',
  '## Referencias Figma',
  '',
  '- [Ficha electrónica tradicional](https://www.figma.com/make/PhZ55jJhxLQUtIWEuf17ZO/Medical-Record)',
  '- [Ficha papel editable](https://www.figma.com/make/AJ9MNrSyClA0hh8jB8sx49/Crear-p%C3%A1ginas-de-ficha-m%C3%A9dica)',
  '',
  '## Rollback',
  '',
  '`VITE_ENABLE_DUAL_CHART_MODES=false` — cero impacto rutas legacy.',
  '',
  '## Cierre',
  '',
  `Reporte: \`${phase.closureReport}\``,
  '',
  'Actualizar `docs/quality/dual-chart-ledger.json`: marcar DONE → siguiente READY.',
  '',
];

const content = lines.join('\n');
const outPath = join(root, 'reports/dual-chart-session-brief.md');

if (shouldWrite) {
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, content, 'utf8');
  console.log(`Brief escrito: ${outPath}`);
} else {
  console.log(content);
}

console.log(`\nFase activa: ${phase.id} — ${phase.name}`);
console.log(`Gate: npm run ${phase.gate}`);
