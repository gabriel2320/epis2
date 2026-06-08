import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { findNextReady, loadLedger } from '../quality/microphase-ledger-lib.mjs';
import { pingOllama } from './ollama-client.mjs';

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
  const ollamaUp = await pingOllama(ollamaUrl);
  const hasEnv = existsSync(join(root, '.env'));
  return {
    ollamaUp,
    ollamaUrl,
    model: process.env.OLLAMA_MODEL ?? 'qwen3:8b',
    hasEnv,
    databaseUrl: Boolean(process.env.DATABASE_URL),
  };
}

/** @param {string} root */
export function readOllamaPlan(root) {
  const path = join(root, 'reports/dev-agent-ollama-plan.json');
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

/** @param {string[]} files @param {{ tramo?: string, phase?: string }} opts */
export function suggestPrimarySubagent(files, { tramo, phase = 'B' } = {}) {
  if (tramo) return 'tramo-implementer';
  const text = files.join(' ').toLowerCase();
  if (text.includes('local-ai') || text.includes('assist') || text.includes('ollama')) {
    return 'ollama-clinical';
  }
  if (text.includes('e2e/') || text.includes('golden-clinical')) return 'golden-guardian';
  if (text.includes('apps/web') || text.includes('epis2-ui') || text.includes('clinical-productivity')) {
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
