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
import { generateOllamaJson, pingOllama } from './ollama-client.mjs';
import { parseDevSessionPlan } from './schemas.mjs';
import { resolveSubagentSequence } from './subagents.mjs';
import {
  getActivePhaseHint,
  getGitSummary,
  getNextMicrophase,
  suggestPrimarySubagent,
} from './context.mjs';

loadEnvFile();

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const OLLAMA_URL = process.env.OLLAMA_BASE_URL ?? 'http://127.0.0.1:11434';
const MODEL = process.env.OLLAMA_MODEL ?? 'qwen3:8b';
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

Propón la próxima sesión de desarrollo concreta.

Estado conocido (no repetir trabajo ya hecho):
- Fase A visual CERRADA: dashboard tabs en grids RAD, quality tab migrado, layers-integration-gate OK
- Siguiente prioridad Fase B: ClinicalCommandPalette Ctrl+K en shell global + autocomplete búsqueda paciente
- Tramo J farmacia BLOQUEADO hasta signoff UX-G02
`;

async function main() {
  const up = await pingOllama(OLLAMA_URL);
  if (!up) {
    console.error('dev-agent-ollama FAILED: Ollama no responde.');
    console.error('  npm run ai:enable && ollama pull ' + MODEL);
    process.exit(1);
  }

  const result = await generateOllamaJson(OLLAMA_URL, MODEL, prompt);
  if (!result.ok) {
    console.error(`dev-agent-ollama FAILED: ${result.reason}`);
    process.exit(1);
  }

  let raw;
  try {
    raw = JSON.parse(result.text);
  } catch {
    console.error('dev-agent-ollama FAILED: JSON inválido de Ollama');
    console.error(result.text.slice(0, 500));
    process.exit(1);
  }

  const parsed = parseDevSessionPlan(raw);
  if (!parsed.ok) {
    console.error(`dev-agent-ollama FAILED: schema — ${parsed.error}`);
    process.exit(1);
  }

  const out = {
    generatedAt: new Date().toISOString(),
    model: result.model,
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
