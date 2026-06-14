/**
 * Helpers compartidos para flujo de velocidad dev EPIS2.
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { DEV_SUBAGENTS } from '../dev-agent/subagents.mjs';
import {
  getActivePhaseHint,
  getGitSummary,
  getNextMicrophase,
  suggestPrimarySubagent,
} from '../dev-agent/context.mjs';
import { formatStrengthenLine, getStrengthenActive } from './strengthen-context.mjs';

/** @param {string} root */
export function readTableroNext(root) {
  const path = join(root, 'docs/product/EPIS2_TABLERO.md');
  if (!existsSync(path)) return null;
  const text = readFileSync(path, 'utf8');
  const section = text.match(/## Siguiente[\s\S]*?(?=\n## |\n---|$)/);
  if (!section) return null;
  const rows = [...section[0].matchAll(/\|\s*\*\*P\d+\*\*\s*\|\s*([^|]+)\|/g)];
  return rows.map((m) => m[1].trim());
}

/** @param {string} root */
export function getBriefStatus(root) {
  const path = join(root, 'reports/dev-agent-brief.md');
  if (!existsSync(path)) {
    return { exists: false, ageHours: null, path: 'reports/dev-agent-brief.md' };
  }
  const mtime = statSync(path).mtimeMs;
  const ageHours = (Date.now() - mtime) / (1000 * 60 * 60);
  return { exists: true, ageHours, path: 'reports/dev-agent-brief.md', stale: ageHours > 12 };
}

/**
 * @param {string} root
 * @param {{ tramo?: string, phase?: string }} opts
 */
export function resolveVelocityContext(root, opts = {}) {
  const git = getGitSummary(root);
  const phase = opts.phase ?? getActivePhaseHint(root);
  const tramo = opts.tramo?.toUpperCase();
  const subagent = opts.subagent ?? suggestPrimarySubagent(git.files, { tramo, phase });
  const agent = DEV_SUBAGENTS[subagent];
  const mf = getNextMicrophase(root);
  const strengthen = getStrengthenActive(root);
  const tableroNext = readTableroNext(root);
  const brief = getBriefStatus(root);
  const head = getHeadShort(root);

  return {
    git,
    phase,
    tramo,
    subagent,
    agentTitle: agent?.title ?? subagent,
    gates: agent?.gates ?? DEV_SUBAGENTS['gate-runner'].gates,
    mf,
    strengthen,
    tableroNext,
    brief,
    head,
  };
}

/** @param {string} root @param {string} subagent @param {{ tramo?: string, fast?: boolean }} opts */
export function buildGateCommands(root, subagent, opts = {}) {
  const agent = DEV_SUBAGENTS[subagent] ?? DEV_SUBAGENTS['gate-runner'];
  const commands = [];

  if (!opts.fast) {
    commands.push({ label: 'check', npm: 'check', required: true });
  }

  for (const gate of agent.gates ?? []) {
    if (gate.startsWith('npm run ')) {
      const script = gate.replace('npm run ', '');
      if (opts.fast && script === 'check') continue;
      commands.push({ label: gate, npm: script, required: false });
    } else if (gate.startsWith('quality:') || gate.startsWith('test:')) {
      commands.push({ label: gate, npm: gate, required: false });
    }
  }

  const tramo = opts.tramo?.toUpperCase();
  if (tramo === 'J') {
    commands.push({
      label: 'tramo-j-pharmacy',
      npm: 'quality:tramo-j-pharmacy-gate',
      required: false,
    });
    commands.push({ label: 'e2e-tramo-j', npm: 'test:e2e:tramo-j', required: false });
  } else if (tramo === 'C') {
    commands.push({
      label: 'tramo-c-admission',
      npm: 'test:e2e:tramo-c-admission',
      required: false,
    });
  }

  if (!commands.some((c) => c.npm === 'test')) {
    commands.push({ label: 'test', npm: 'test', required: false });
  }
  if (!commands.some((c) => c.npm === 'db:validate')) {
    commands.push({ label: 'db:validate', npm: 'db:validate', required: true });
  }

  return dedupeCommands(commands);
}

/** @param {{ label: string, npm: string, required: boolean }[]} commands */
function dedupeCommands(commands) {
  const seen = new Set();
  return commands.filter((c) => {
    if (seen.has(c.npm)) return false;
    seen.add(c.npm);
    return true;
  });
}

/** @param {string} root */
export function getHeadShort(root) {
  try {
    return execSync('git rev-parse --short HEAD', { cwd: root, encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
}

/**
 * @param {ReturnType<typeof resolveVelocityContext>} ctx
 */
export function formatVelocityBanner(ctx) {
  const lines = [
    'EPIS2 dev velocity',
    `- HEAD: ${ctx.head ?? 'unknown'}`,
    `- Subagente: ${ctx.subagent} (${ctx.agentTitle})`,
    `- Rama: ${ctx.git.branch} · cambios: ${ctx.git.dirtyCount}`,
  ];
  if (ctx.tramo) lines.push(`- Tramo: ${ctx.tramo}`);
  if (ctx.strengthen) lines.push(formatStrengthenLine(ctx.strengthen));
  if (ctx.tableroNext?.length) lines.push(`- Tablero P1: ${ctx.tableroNext[0]}`);
  if (ctx.mf && !ctx.strengthen?.active) lines.push(`- MF ledger: ${ctx.mf.id}`);
  if (ctx.brief.exists) {
    lines.push(
      `- Brief: @${ctx.brief.path}${ctx.brief.stale ? ' (stale — npm run dev:session)' : ''}`,
    );
  } else {
    lines.push('- Brief: missing — npm run dev:session');
  }
  lines.push('- Contexto: @docs/AGENT_CONTEXT_MINIMAL.md');
  lines.push('- Iteración: npm run dev:rapid (quality:fast + audit-diff opcional)');
  lines.push('- No iniciar MF siguiente salvo petición explícita del usuario');
  lines.push('- Cursor: /epis2-session · cierre: /epis2-close');
  lines.push('- Doc: docs/dev/EPIS2_DEV_VELOCITY.md');
  return lines.join('\n');
}
