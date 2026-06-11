import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { findNextReady, loadLedger } from '../quality/microphase-ledger-lib.mjs';
import { getOllamaStatus } from '../ollama/native-client.mjs';
import { resolveAllOllamaRoutes } from '../ollama/model-router.mjs';
import { getWorkstationProfile } from '../ollama/workstation-profile.mjs';

/** @param {string} root */
export function getNextMicrophase(root) {
  try {
    const ledger = loadLedger(join(root, 'docs/quality/microphase-ledger.json'));
    const result = findNextReady(ledger);
    if (!result.ok || !result.next) return null;
    return result.next;
  } catch {
    return null;
  }
}

/** @param {string} root @param {number} maxFiles */
export function getGitSummary(root, maxFiles = 24) {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', {
      cwd: root,
      encoding: 'utf8',
    }).trim();
    const status = execSync('git status --short', { cwd: root, encoding: 'utf8' })
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    const files = status.map((line) => line.replace(/^\S+\s+/, '').trim());
    return {
      branch,
      dirtyCount: status.length,
      lines: status.slice(0, maxFiles),
      files: files.slice(0, maxFiles),
      truncated: status.length > maxFiles,
    };
  } catch {
    return { branch: 'unknown', dirtyCount: 0, lines: [], files: [], truncated: false };
  }
}

/** @param {string} root */
export async function getStackHints(root) {
  const ollamaUrl = process.env.OLLAMA_BASE_URL ?? 'http://127.0.0.1:11434';
  const clinicalModel = process.env.OLLAMA_MODEL ?? 'qwen3:8b';
  const status = await getOllamaStatus({ baseUrl: ollamaUrl, model: clinicalModel });
  const workstation = getWorkstationProfile();
  const routes = await resolveAllOllamaRoutes(ollamaUrl);
  const hasEnv = existsSync(join(root, '.env'));
  return {
    ollamaUp: status.up,
    ollamaModelReady: status.modelReady,
    ollamaUrl,
    model: clinicalModel,
    workstation,
    routes: {
      clinical: routes.clinical,
      devPlan: routes['dev-plan'],
      devWrite: routes['dev-write'],
    },
    hasEnv,
    databaseUrl: Boolean(process.env.DATABASE_URL),
  };
}

const OLLAMA_PLAN_MAX_AGE_MS = 24 * 60 * 60 * 1000;

/** @param {string} root */
export function readOllamaPlan(root) {
  const path = join(root, 'reports/dev-agent-ollama-plan.json');
  if (!existsSync(path)) return null;
  try {
    const plan = JSON.parse(readFileSync(path, 'utf8'));
    // Plan viejo = contexto erróneo para el agente; el tablero manda.
    const generatedAt = Date.parse(plan.generatedAt ?? '');
    if (!Number.isFinite(generatedAt) || Date.now() - generatedAt > OLLAMA_PLAN_MAX_AGE_MS) {
      return null;
    }
    return plan;
  } catch {
    return null;
  }
}

/**
 * Estado vivo del tablero — fuente canónica del «siguiente paso» (SDEPIS2).
 * @param {string} root
 * @returns {{ activeThreads: string[], nextSteps: string[] }}
 */
export function getTableroState(root) {
  const path = join(root, 'docs/product/EPIS2_TABLERO.md');
  if (!existsSync(path)) return { activeThreads: [], nextSteps: [] };
  const text = readFileSync(path, 'utf8');

  /** @param {string} heading @param {(cells: string[]) => string | null} pick */
  const rowsUnder = (heading, pick) => {
    const section = text.split(new RegExp(`^## ${heading}$`, 'm'))[1]?.split(/^## /m)[0] ?? '';
    const out = [];
    for (const line of section.split('\n')) {
      if (!line.startsWith('|') || line.includes('---')) continue;
      const cells = line
        .split('|')
        .map((c) => c.trim())
        .filter(Boolean);
      if (cells.length < 2) continue;
      const picked = pick(cells);
      if (picked) out.push(picked.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1'));
    }
    return out;
  };

  const activeThreads = rowsUnder('En curso', (cells) =>
    cells[0] && !/^Hilo$/i.test(cells[0])
      ? `${cells[0]}${cells[1] ? ` — ${cells[1]}` : ''}`
      : null,
  );
  const nextSteps = rowsUnder('Siguiente', (cells) =>
    cells[0] && !/^(?:Prioridad|Entrega)$/i.test(cells[0]) ? `${cells[0]}: ${cells[1] ?? ''}` : null,
  );
  return { activeThreads, nextSteps };
}

/** @param {string[]} files @param {{ tramo?: string, phase?: string }} opts */
export function suggestPrimarySubagent(files, { tramo, phase = 'B' } = {}) {
  if (tramo) return 'tramo-implementer';
  const text = files.join(' ').toLowerCase();
  if (text.includes('local-ai') || text.includes('assist') || text.includes('ollama')) {
    return 'ollama-clinical';
  }
  if (text.includes('e2e/') || text.includes('golden-clinical')) return 'golden-guardian';
  if (
    text.includes('apps/web') ||
    text.includes('epis2-ui') ||
    text.includes('clinical-productivity')
  ) {
    return phase === 'A' ? 'm3-guardian' : 'layers-integrator';
  }
  if (text.includes('microphase') || text.includes('reports/epis2')) return 'ledger-keeper';
  if (text.includes('.github') || text.includes('scripts/quality')) return 'ci-parity';
  return phase === 'B' ? 'layers-integrator' : 'gate-runner';
}

/** @param {string} root */
export function getActivePhaseHint(root) {
  const planPath = join(root, 'docs/product/EPIS2_GLOBAL_DEV_PLAN.md');
  if (!existsSync(planPath)) return 'B';
  const plan = readFileSync(planPath, 'utf8');
  if (plan.includes('Command palette')) return 'B';
  return process.env.EPIS2_DEV_AGENT_PHASE ?? 'B';
}
