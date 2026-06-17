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
 * Parsea brújula (CURRENT_STATE) — fuente primaria para agentes.
 * @param {string} root
 */
function getBrujulaProgram(root) {
  const path = join(root, 'docs/EPIS2_CURRENT_STATE.md');
  if (!existsSync(path)) return null;
  const text = readFileSync(path, 'utf8');
  const m = text.match(/\*\*Programa activo:\*\*\s*(.+)/);
  if (!m) return null;
  return m[1]
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Parsea tablero (índice humano) — Propuesto + Siguiente en header.
 * @param {string} root
 */
function parseTableroIndex(root) {
  const path = join(root, 'docs/product/EPIS2_TABLERO.md');
  if (!existsSync(path)) {
    return { propuestoPrograms: [], siguienteHeader: null, openTramos: [] };
  }
  const text = readFileSync(path, 'utf8');
  const header = text.split(/^---$/m)[0] ?? '';

  const siguienteHeader =
    header.match(/\*\*Siguiente:\*\*\s*(.+)/)?.[1]?.replace(/\*\*/g, '').trim() ?? null;

  const propuestoPrograms = [];
  const openTramos = [];

  for (const match of text.matchAll(/^## Propuesto — (.+)$/gm)) {
    const program = match[1].trim();
    const sectionStart = match.index ?? 0;
    const sectionEnd = text.indexOf('\n## ', sectionStart + 1);
    const section = text.slice(sectionStart, sectionEnd === -1 ? undefined : sectionEnd);
    propuestoPrograms.push(program);

    for (const line of section.split('\n')) {
      if (!line.startsWith('|') || line.includes('---')) continue;
      const cells = line
        .split('|')
        .map((c) => c.trim())
        .filter(Boolean);
      if (cells.length < 3 || /^Tramo$/i.test(cells[0])) continue;
      const row = cells.join(' ');
      if (/◐|pendiente|en curso/i.test(row) && !/✓\s*DONE|✓\s*PR|✓\s*PASS/i.test(row)) {
        openTramos.push(`${program}: ${cells[0]} — ${cells.slice(1, 3).join(' ')}`);
      }
    }
  }

  return { propuestoPrograms, siguienteHeader, openTramos };
}

/**
 * Estado brújula + tablero para brief de sesión.
 * Brújula (CURRENT_STATE) manda; tablero es índice humano.
 * @param {string} root
 */
export function getTableroState(root) {
  const brujulaProgram = getBrujulaProgram(root);
  const { propuestoPrograms, siguienteHeader, openTramos } = parseTableroIndex(root);

  const activeThreads = [];
  if (brujulaProgram) {
    activeThreads.push(`Brújula: ${brujulaProgram}`);
  }
  for (const p of propuestoPrograms) {
    activeThreads.push(`Tablero propuesto: ${p}`);
  }

  const nextSteps = [...openTramos];
  if (brujulaProgram?.includes('merge') || brujulaProgram?.includes('CICA')) {
    nextSteps.push('Merge feat/prog-aesthetic-reset-close → master (CICA)');
  }
  if (brujulaProgram?.includes('PURGE')) {
    nextSteps.push('PROG-PURGE-CICA: archivar · referenciar · perímetro agente');
  }

  let staleTableroHint = null;
  if (
    siguienteHeader &&
    brujulaProgram &&
    !brujulaProgram.includes(siguienteHeader.replace(/PROG-/g, '').split(/[\s+]/)[0]?.slice(0, 6) ?? '')
  ) {
    const brujulaHasPurge = brujulaProgram.includes('PURGE');
    const tableroHasUxLab = siguienteHeader.includes('UX-LAB');
    if (brujulaHasPurge && tableroHasUxLab) {
      staleTableroHint = `Tablero header dice "${siguienteHeader}" pero brújula dice PURGE-CICA — alinear tablero`;
    }
  }

  /** @deprecated compat — secciones legacy */
  const path = join(root, 'docs/product/EPIS2_TABLERO.md');
  const text = existsSync(path) ? readFileSync(path, 'utf8') : '';
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
  const legacyActive = rowsUnder('En curso', (cells) =>
    cells[0] && !/^Hilo$/i.test(cells[0]) ? `${cells[0]}${cells[1] ? ` — ${cells[1]}` : ''}` : null,
  );
  activeThreads.push(...legacyActive);

  return {
    brujulaProgram,
    siguienteHeader,
    propuestoPrograms,
    openTramos,
    staleTableroHint,
    activeThreads,
    nextSteps,
  };
}

/** @param {string[]} files @param {{ tramo?: string, phase?: string }} opts */
export function suggestPrimarySubagent(files, { tramo, phase: _phase = 'cica' } = {}) {
  if (tramo && process.env.EPIS2_ALLOW_ARCHIVED_SCOPE === '1') return 'tramo-implementer';
  const text = files.join(' ').toLowerCase();
  if (text.includes('cica/') || text.includes('src/cica')) return 'golden-guardian';
  if (text.includes('local-ai') || text.includes('assist') || text.includes('ollama')) {
    return 'ollama-clinical';
  }
  if (text.includes('e2e/') || text.includes('golden-clinical')) return 'golden-guardian';
  if (text.includes('reports/') || text.includes('docs/')) return 'ollama-dev-writer';
  if (text.includes('apps/web') || text.includes('epis2-ui')) return 'golden-guardian';
  if (text.includes('microphase') || text.includes('ledger')) return 'ledger-keeper';
  if (text.includes('.github') || text.includes('scripts/quality')) return 'gate-runner';
  return 'golden-guardian';
}

/** @param {string} root */
export function getActivePhaseHint(_root) {
  return process.env.EPIS2_DEV_AGENT_PHASE ?? 'cica';
}
