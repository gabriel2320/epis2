#!/usr/bin/env node
/**
 * Ollama dev — propone y opcionalmente aplica parches de bajo riesgo (reportes/docs).
 *
 *   npm run dev:agent:ollama-write
 *   npm run dev:agent:ollama-write -- --apply
 *   npm run dev:agent:ollama-write -- --document
 *
 * Tier L0 (--apply): reports/, docs/product/, docs/design/
 * Tier L1: en plan; aplicar manual o --apply-all (no recomendado en CI)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadEnvFile } from '../load-env.mjs';
import { generateOllamaJson } from './ollama-client.mjs';
import { applyLowRiskPatches, LOW_RISK_TIER_L0_PREFIXES } from './low-risk-policy.mjs';
import { ensureOllamaReady, resolveOllamaRoute } from '../ollama/native-client.mjs';
import { parseDevLowRiskWritePlanFromOllamaText } from './parse-ollama-plan.mjs';
import {
  getActivePhaseHint,
  getGitSummary,
  getNextMicrophase,
  readOllamaPlan,
} from './context.mjs';

loadEnvFile();

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const apply = args.includes('--apply');
const applyAll = args.includes('--apply-all');
const documentMode = args.includes('--document');
const skipCheck = args.includes('--skip-check');

const phase = process.env.EPIS2_DEV_AGENT_PHASE ?? getActivePhaseHint(root);
const git = getGitSummary(root, 10);
const mf = getNextMicrophase(root);
const sessionPlan = readOllamaPlan(root);

const policyExcerpt = readFileSync(
  join(root, 'docs/product/EPIS2_DEV_AGENT_LOW_RISK_WRITE.md'),
  'utf8',
).slice(0, 2200);

const prompt = `Eres el agente de desarrollo EPIS2 que documenta y escribe SOLO parches de bajo riesgo.
Responde JSON válido según el schema. Español en reportes y docs.

Fase: ${phase}
${mf ? `MF ledger: ${mf.id} — ${mf.name}` : ''}
${sessionPlan?.plan?.objective ? `Plan sesión: ${sessionPlan.plan.objective}` : ''}
Git: ${git.files.slice(0, 6).join(', ') || 'limpio'}

Política (extracto):
${policyExcerpt}

Paths Tier L0 permitidos (create/append):
${LOW_RISK_TIER_L0_PREFIXES.map((p) => `- ${p}`).join('\n')}

${documentMode ? 'Modo documentación: generar reporte de sesión en reports/ con alcance, gates, riesgos, próximo paso.' : 'Incluir parches útiles: reporte reports/epis2-*.md y/o append a docs/product si aplica.'}

Schema JSON:
{
  "objective": "string",
  "patches": [
    {
      "path": "reports/epis2-dev-agent-write-YYYY-MM-DD.md",
      "action": "create",
      "content": "# markdown completo...",
      "summary": "Reporte sesión dev"
    }
  ],
  "gatesToRun": ["npm run check"],
  "manualFollowUps": ["revisar diff L1 si aplica"],
  "risks": ["..."],
  "requiresHumanReview": true
}

Reglas:
- Máximo 8 parches; preferir 1–2 reportes bien hechos
- action solo create o append
- NO tocar código clínico, API, migraciones, registries
- requiresHumanReview debe ser true
`;

async function main() {
  const route = await resolveOllamaRoute({ function: 'dev-write' });
  const OLLAMA_URL = route.baseUrl;
  const MODEL = route.model;
  console.log(`dev-agent-ollama-write · ${route.function} → ${MODEL} (tier ${route.tier}, ${route.mode})`);

  const ready = await ensureOllamaReady({ function: 'dev-write' });
  if (!ready.ready) {
    console.error(`dev-agent-ollama-write FAILED [${ready.stage}]: ${ready.reason}`);
    console.error(`  ${ready.hint}`);
    process.exit(1);
  }

  const result = await generateOllamaJson(OLLAMA_URL, MODEL, prompt, 90_000);
  if (!result.ok) {
    console.error(`dev-agent-ollama-write FAILED: ${result.reason}`);
    process.exit(1);
  }

  const parsed = parseDevLowRiskWritePlanFromOllamaText(result.text);
  if (!parsed.ok) {
    console.error(`dev-agent-ollama-write FAILED: schema — ${parsed.error}`);
    console.error(result.text.slice(0, 600));
    process.exit(1);
  }

  const outPath = join(root, 'reports/dev-agent-ollama-write-plan.json');
  const out = {
    generatedAt: new Date().toISOString(),
    model: result.model,
    route: { function: route.function, tier: route.tier, mode: route.mode },
    ollamaUrl: OLLAMA_URL,
    mode: documentMode ? 'document' : 'write',
    dryRun: !apply && !applyAll,
    plan: parsed.data,
  };
  writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
  console.log(`dev-agent-ollama-write OK → ${outPath}`);
  console.log(`  Objetivo: ${parsed.data.objective}`);
  console.log(`  Parches: ${parsed.data.patches.length}`);

  if (!apply && !applyAll) {
    console.log('\n  Revisar plan. Aplicar Tier L0: npm run dev:agent:ollama-write -- --apply');
    return;
  }

  const applyResult = applyLowRiskPatches(parsed.data.patches, {
    root,
    applyTier: applyAll ? 'L0+L1' : 'L0',
  });

  console.log(`\n  Aplicados: ${applyResult.applied.length}`);
  for (const { patch, tier } of applyResult.applied) {
    console.log(`    [${tier}] ${patch.action} ${patch.path}`);
  }
  if (applyResult.skipped.length) {
    console.log(`  Omitidos (L1/manual): ${applyResult.skipped.length}`);
  }
  if (applyResult.errors.length) {
    console.error('\ndev-agent-ollama-write ERRORES:');
    for (const e of applyResult.errors) {
      console.error(`  - ${e.patch.path}: ${e.error}`);
    }
    process.exit(1);
  }

  if (!skipCheck) {
    console.log('\n▶ npm run check (post-apply)…');
    const r = spawnSync('npm', ['run', 'check'], {
      cwd: root,
      stdio: 'inherit',
      shell: true,
    });
    if (r.status !== 0) {
      console.error('check falló tras apply — revisar diff manualmente');
      process.exit(1);
    }
  }

  console.log('\nListo. Humano: revisar diff y commit explícito.');
}

main();
