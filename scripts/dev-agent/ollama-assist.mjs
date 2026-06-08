#!/usr/bin/env node
/**
 * Asistente Ollama para planificación de sesión dev (JSON estructurado).
 * No modifica código ni ejecuta gates — solo propone plan revisable por humano.
 *
 * Requiere: Ollama nativo (npm run ai:enable)
 *
 * EPIS2_DEV_AGENT_PHASE=B
 * EPIS2_DEV_AGENT_TRAMO=J
 * OLLAMA_BASE_URL / OLLAMA_MODEL desde .env
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnvFile } from '../load-env.mjs';
import { generateOllamaJson } from './ollama-client.mjs';
import { ensureOllamaReady, resolveOllamaRoute } from '../ollama/native-client.mjs';
import { parseDevSessionPlanFromOllamaText } from './parse-ollama-plan.mjs';
import { resolveSubagentSequence } from './subagents.mjs';
import {
  getActivePhaseHint,
  getGitSummary,
  getNextMicrophase,
  suggestPrimarySubagent,
} from './context.mjs';

loadEnvFile();

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const phase = process.env.EPIS2_DEV_AGENT_PHASE ?? getActivePhaseHint(root);
const tramo = process.env.EPIS2_DEV_AGENT_TRAMO?.toUpperCase();
const git = getGitSummary(root, 12);
const mf = getNextMicrophase(root);
const primary = suggestPrimarySubagent(git.files, { tramo, phase });

const globalPlan = existsSync(join(root, 'docs/product/EPIS2_GLOBAL_DEV_PLAN.md'))
  ? readFileSync(join(root, 'docs/product/EPIS2_GLOBAL_DEV_PLAN.md'), 'utf8').slice(0, 3500)
  : '';

const sequence = resolveSubagentSequence({ phase, tramo });

const prompt = `Eres el asistente de planificación de desarrollo EPIS2 (EMR clínico chileno).
Responde SOLO JSON válido según el schema implícito abajo. No inventes rutas fuera del monorepo epis2.
Nunca propongas OpenMRS, Carbon, dashboard como home, auto-aprobación clínica ni import masivo desde EPIS.

Contexto fase: ${phase}${tramo ? ` tramo ${tramo}` : ''}
Subagente primario sugerido: ${primary}
Subagentes disponibles: ${sequence.join(', ')}
${mf ? `Ledger READY: ${mf.id} — ${mf.name}` : ''}
Archivos modificados (git): ${git.files.slice(0, 8).join(', ') || 'ninguno'}

Extracto plan global:
${globalPlan}

Schema JSON requerido:
{
  "activePhase": "string",
  "nextMicrophase": "string",
  "objective": "string",
  "allowedPaths": ["apps/web/...", "packages/..."],
  "forbiddenPatterns": ["OpenMRS", "auto-approve", ...],
  "gatesToRun": ["npm run check", "quality:..."],
  "subagentSequence": ["layers-integrator", "gate-runner", ...],
  "risks": ["..."],
  "requiresHumanReview": true
}

Propón la próxima sesión de desarrollo concreta según la fase activa (${phase}) y el plan global.
No repitas trabajo ya marcado como cerrado en el extracto del plan.
`;

async function main() {
  const route = await resolveOllamaRoute({ function: 'dev-plan' });
  const OLLAMA_URL = route.baseUrl;
  const MODEL = route.model;
  console.log(`dev-agent-ollama · ${route.function} → ${MODEL} (tier ${route.tier}, ${route.mode})`);

  const ready = await ensureOllamaReady({ function: 'dev-plan' });
  if (!ready.ready) {
    console.error(`dev-agent-ollama FAILED [${ready.stage}]: ${ready.reason}`);
    console.error(`  ${ready.hint}`);
    process.exit(1);
  }

  const result = await generateOllamaJson(OLLAMA_URL, MODEL, prompt);
  if (!result.ok) {
    console.error(`dev-agent-ollama FAILED: ${result.reason}`);
    process.exit(1);
  }

  const parsed = parseDevSessionPlanFromOllamaText(result.text);
  if (!parsed.ok) {
    console.error(`dev-agent-ollama FAILED: schema — ${parsed.error}`);
    console.error(result.text.slice(0, 500));
    process.exit(1);
  }

  const out = {
    generatedAt: new Date().toISOString(),
    model: result.model,
    route: { function: route.function, tier: route.tier, mode: route.mode, model: route.model },
    ollamaUrl: OLLAMA_URL,
    plan: parsed.data,
  };

  const outPath = join(root, 'reports/dev-agent-ollama-plan.json');
  writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
  console.log(`dev-agent-ollama OK → ${outPath}`);
  console.log(`  Objetivo: ${parsed.data.objective}`);
  console.log(`  Próxima MF: ${parsed.data.nextMicrophase}`);
}

main();
