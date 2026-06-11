#!/usr/bin/env node
/**
 * C-2.4 — Captura scaffold signoff Calm Premium (6 superficies).
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const date = new Date().toISOString().slice(0, 10);
const evidenceDir = join(root, 'reports', 'm3-visual-evidence', 'calm-premium', date);
const reportPath = join(root, 'reports', `epis2-calm-premium-signoff-${date}.md`);

function gitShortHead() {
  try {
    return execSync('git rev-parse --short HEAD', { cwd: root, encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
}

mkdirSync(evidenceDir, { recursive: true });

const dualFlag = process.env.VITE_ENABLE_DUAL_CHART_MODES === 'true';
const dbUrl = process.env.DATABASE_URL ?? 'postgresql://epis2_app:epis2@127.0.0.1:5433/epis2';

console.log(`\nCalm Premium signoff → ${evidenceDir}\n`);
console.log(`VITE_ENABLE_DUAL_CHART_MODES=${dualFlag ? 'true' : 'false'}\n`);

const result = spawnSync(
  'npx',
  ['playwright', 'test', 'e2e/calm-premium-signoff-capture.spec.ts'],
  {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: {
      ...process.env,
      DATABASE_URL: dbUrl,
      CALM_PREMIUM_EVIDENCE_DIR: evidenceDir,
      VITE_ENABLE_DUAL_CHART_MODES: dualFlag ? 'true' : 'false',
    },
  },
);

const shots = [
  ['s1-comando-calm-light.png', 'Comando', 'clinical-calm light'],
  ['s2-censo-calm-light.png', 'Censo + barra', 'requiere dual flag'],
  ['s3-traditional-calm-light.png', 'Ficha traditional', 'requiere dual flag'],
  ['s4-paper-calm-light.png', 'Ficha papel', 'requiere dual flag'],
  ['s5-dark-paper-calm.png', 'Dark + paper', 'requiere dual flag'],
  ['s6-print-letter-calm.png', 'Impresión Carta', 'requiere dual flag'],
];

const relDir = `m3-visual-evidence/calm-premium/${date}`;
const tableRows = shots
  .map(([file, surface, note]) => {
    const ok = existsSync(join(evidenceDir, file));
    const status = ok ? 'PASS' : dualFlag ? 'MISSING' : 'SKIP (dual off)';
    return `| ${surface} | ${note} | ${status} | \`${relDir}/${file}\` |`;
  })
  .join('\n');

const verdict =
  dualFlag && shots.every(([f]) => existsSync(join(evidenceDir, f)))
    ? 'GO scaffold — pendiente revisión humana'
    : 'NO-GO scaffold — completar capturas (activar dual flag para 2–6)';

const report = `# EPIS2 — Signoff scaffold Calm Premium C-2.4 (${date})

**Commit:** \`${gitShortHead()}\` · **Script:** \`npm run quality:calm-premium-signoff\`  
**THEME-CALM-01:** canvas \`#F7F9FC\` / dark \`#101418\` vía \`clinical-calm\`

---

## Matriz 6 superficies

| Superficie | Nota | Estado | Evidencia |
|------------|------|--------|-----------|
${tableRows}

---

## Veredicto automatizado

**${verdict}**

Revisión humana: comparar con \`docs/design/EPIS2_CLINICAL_CALM_PREMIUM_PLAN.md\` §Signoff.

\`\`\`bash
VITE_ENABLE_DUAL_CHART_MODES=true npm run quality:calm-premium-signoff
\`\`\`
`;

writeFileSync(reportPath, report, 'utf8');
console.log(`Reporte → ${reportPath}`);

if (result.status !== 0) {
  console.error('capture-calm-premium-signoff FAILED — revisar Playwright');
  process.exit(result.status ?? 1);
}

console.log('capture-calm-premium-signoff OK');
