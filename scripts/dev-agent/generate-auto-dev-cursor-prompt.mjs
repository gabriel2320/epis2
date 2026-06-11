#!/usr/bin/env node
/**
 * Genera prompt Cursor para tramo Tier X (PM-03).
 *
 *   node scripts/dev-agent/generate-auto-dev-cursor-prompt.mjs --tramo 2
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync, appendFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const tramoIdx = args.includes('--tramo') ? Number(args[args.indexOf('--tramo') + 1]) : NaN;

const ledger = JSON.parse(
  readFileSync(join(root, 'docs/quality/auto-dev-6h-ledger.json'), 'utf8'),
);
const tramo = ledger.tramos.find((t) => t.order === tramoIdx);
if (!tramo) {
  console.error(`Tramo ${tramoIdx} no encontrado en ledger`);
  process.exit(1);
}

const briefPath = join(root, 'reports/dev-agent-brief.md');
const brief = existsSync(briefPath) ? readFileSync(briefPath, 'utf8').slice(0, 4000) : '(ejecutar npm run dev:session)';

const openclawBriefPath = join(root, 'reports/openclaw-latest-brief.md');
const openclawBrief = existsSync(openclawBriefPath)
  ? readFileSync(openclawBriefPath, 'utf8').slice(0, 3000)
  : null;

const canon = [
  'docs/product/PRODUCT_INVARIANTS.md',
  'docs/design/EPIS2_DUAL_CHART_VISUAL_CANON.md',
  'docs/product/EPIS2_CLINICAL_TERMINOLOGY.md',
].filter((p) => existsSync(join(root, p)));

const prompt = `# Auto-dev tramo ${tramoIdx} — ${tramo.id}

**Programa:** PROG-AUTO-DEV-6H / EPIS2-PM-03  
**Tramo:** ${tramo.name}  
**Gate:** ${tramo.gate ?? 'npm run check'}

## Objetivo

Implementar el tramo con diff mínimo. Al cerrar:

\`\`\`bash
npm run ${tramo.gate ?? 'check'}
\`\`\`

## Canon (leer antes de codear)

${canon.map((c) => `- @${c}`).join('\n')}

## Evidencia ledger

- ID: ${tramo.id}
- Commands: ${(tramo.commands ?? []).join(', ')}

## Brief sesión (extracto)

${brief}

${openclawBrief ? `## OpenClaw brief (read-only — revisar antes de implementar)\n\n@reports/openclaw-latest-brief.md\n\n${openclawBrief}\n` : '## OpenClaw\n\n_(ejecutar `npm run openclaw:tramo -- --tramo ' + tramoIdx + ' --phase brief` si EPIS2_AUTO_DEV_OPENCLAW=1)_\n'}

## Reglas

- No @mui/* directo desde apps/web
- IA no aprueba clínica
- Español en UI visible
- Commit message: chore(auto-dev): ${tramo.id} — ${tramo.name}
`;

mkdirSync(join(root, 'reports'), { recursive: true });
const outPath = join(root, `reports/auto-dev-cursor-prompt-tramo-${tramoIdx}.md`);
writeFileSync(outPath, prompt, 'utf8');

appendFileSync(
  join(root, 'reports/auto-dev-cursor-queue.jsonl'),
  `${JSON.stringify({
    at: new Date().toISOString(),
    tramo: tramoIdx,
    id: tramo.id,
    promptPath: outPath,
  })}\n`,
  'utf8',
);

console.log(`cursor prompt → ${outPath}`);
