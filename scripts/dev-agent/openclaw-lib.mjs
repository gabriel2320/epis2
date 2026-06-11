/**
 * EPIS2 OpenClaw helpers — read-only brief/handoff collection.
 * No external network. No repo mutations.
 * Adaptado desde patrón EPIS MF-81A; agentes y gates EPIS2-native.
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';
import { resolveOpenClawLocks } from './openclaw-policy.mjs';

export const OPENCLAW_MODE = 'read-only-reviewer';
export const OPENCLAW_VERSION = '0.1.0';

export const AGENT_IDS = [
  'security',
  'clinical-safety',
  'eval',
  'architecture',
  'golden',
  'ledger',
  'release',
  'ux',
  'programming',
];

/** @type {Record<string, { id: string, name: string, skill: string, paths: string[], gates: string[] }>} */
export const AGENT_CATALOG = {
  security: {
    id: 'security',
    name: 'Security/PHI Reviewer',
    skill: '.openclaw/epis2/skills/epis2-security-phi-reviewer/SKILL.md',
    paths: [
      '.env.example',
      'docs/product/PRODUCT_INVARIANTS.md',
      'scripts/legacy-audit',
      'docs/legacy/EPIS_POSTMORTEM.md',
    ],
    gates: ['check', 'legacy:audit', 'db:validate'],
  },
  'clinical-safety': {
    id: 'clinical-safety',
    name: 'Clinical Safety Reviewer',
    skill: '.openclaw/epis2/skills/epis2-clinical-safety-reviewer/SKILL.md',
    paths: [
      'packages/clinical-domain/src/clinicalSafety',
      'packages/clinical-domain/src/clinicalDecisionRules',
      'packages/clinical-domain/src/draftStates.ts',
      'docs/quality/GOLDEN_CLINICAL_JOURNEY.md',
    ],
    gates: ['test', 'quality:tramos-clinical-signoff-gate'],
  },
  eval: {
    id: 'eval',
    name: 'AI Eval Reviewer',
    skill: '.openclaw/epis2/skills/epis2-eval-reviewer/SKILL.md',
    paths: [
      'docs/product/EPIS2_AI_TRAMO_EVALS.md',
      'scripts/ai',
      'packages/clinical-forms/src/blueprints',
      'reports/ai-evals-live-latest.json',
    ],
    gates: ['quality:ai-tramo-evals-gate', 'ai:evals:live'],
  },
  architecture: {
    id: 'architecture',
    name: 'Architecture/Legacy Reviewer',
    skill: '.openclaw/epis2/skills/epis2-architecture-reviewer/SKILL.md',
    paths: [
      'docs/PRODUCT_CANON.md',
      'legacy-import-manifest.json',
      'docs/legacy/LEGACY_IMPORT_LEDGER.md',
      'scripts/architecture',
    ],
    gates: ['architecture:validate', 'legacy:validate-manifest'],
  },
  golden: {
    id: 'golden',
    name: 'Golden Journey Reviewer',
    skill: '.openclaw/epis2/skills/epis2-golden-reviewer/SKILL.md',
    paths: [
      'docs/quality/GOLDEN_CLINICAL_JOURNEY.md',
      'e2e',
      'scripts/quality/run-golden-journey.mjs',
    ],
    gates: ['quality:golden-journey', 'test:e2e:ux-g02'],
  },
  ledger: {
    id: 'ledger',
    name: 'Microphase Ledger Reviewer',
    skill: '.openclaw/epis2/skills/epis2-ledger-reviewer/SKILL.md',
    paths: [
      'docs/quality/microphase-ledger.json',
      'docs/quality/MICROPHASE_PROGRAM.md',
      'docs/product/EPIS2_TABLERO.md',
    ],
    gates: ['quality:microphases', 'quality:microphase-next'],
  },
  release: {
    id: 'release',
    name: 'Release/Gates Reviewer',
    skill: '.openclaw/epis2/skills/epis2-release-reviewer/SKILL.md',
    paths: [
      'package.json',
      'docs/quality/auto-dev-6h-ledger.json',
      'scripts/quality',
      'reports',
    ],
    gates: ['check', 'test', 'quality:local-ci'],
  },
  ux: {
    id: 'ux',
    name: 'UX/M3 Reviewer',
    skill: '.openclaw/epis2/skills/epis2-ux-reviewer/SKILL.md',
    paths: [
      'apps/web/src',
      'docs/design/M3_ADOPTION_PLAN.md',
      'docs/product/EPIS2_THREE_MODES_DEV_PLAN.md',
      'docs/quality/M3_ANTI_DRIFT_GATES.md',
    ],
    gates: ['quality:ui-simplify-gate', 'quality:three-modes-gate'],
  },
  programming: {
    id: 'programming',
    name: 'Programming / OpenClaw Support',
    skill: '.openclaw/epis2/skills/epis2-programming-agent/SKILL.md',
    paths: [
      'scripts/dev-agent',
      'docs/product/EPIS2_OPENCLAW_INTEGRATION.md',
      'docs/product/EPIS2_DEV_CYCLE_OPENCLAW.md',
      'docs/product/EPIS2_PM03_AUTO_ORCHESTRATION.md',
      'reports/openclaw-latest-brief.md',
      'reports/openclaw-latest-handoff.md',
      'reports/openclaw-programming-latest.md',
      'reports/auto-dev-cursor-prompt-tramo-1.md',
      '.openclaw/epis2',
    ],
    gates: ['quality:openclaw-gate', 'quality:openclaw-cycle-gate', 'check'],
  },
};

const SECRET_REDACT = [
  [/Bearer\s+[A-Za-z0-9._~+/=-]{8,}/gi, 'Bearer [REDACTED]'],
  [/password\s*[:=]\s*['"][^'"\n]{4,}['"]/gi, 'password=[REDACTED]'],
  [/api[_-]?key\s*[:=]\s*['"][^'"\n]{4,}['"]/gi, 'api_key=[REDACTED]'],
  [
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g,
    '[PRIVATE_KEY_REDACTED]',
  ],
  [/\bAKIA[0-9A-Z]{16}\b/g, '[AWS_KEY_REDACTED]'],
];

export function sanitizeText(text, _relativePath = '') {
  let out = String(text ?? '');
  for (const [pattern, replacement] of SECRET_REDACT) {
    out = out.replace(pattern, replacement);
  }
  if (/sk-[a-zA-Z0-9]{20,}/.test(out)) {
    out = out.replace(/sk-[a-zA-Z0-9]{20,}/g, 'sk-[REDACTED]');
  }
  return out;
}

export function parseArgs(argv) {
  const args = { mf: 'MF-OPENCLAW', agents: [...AGENT_IDS], json: false, out: null, notes: null };
  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--json') args.json = true;
    else if (a === '--mf' && argv[i + 1]) {
      args.mf = argv[++i];
    } else if (a === '--agents' && argv[i + 1]) {
      args.agents = argv[++i]
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    } else if (a === '--out' && argv[i + 1]) {
      args.out = argv[++i];
    } else if (a === '--notes' && argv[i + 1]) {
      args.notes = argv[++i];
    }
  }
  return args;
}

export function gitStatusShort(root) {
  const result = spawnSync('git', ['status', '--short', '--branch'], { cwd: root, encoding: 'utf8' });
  if (result.status !== 0) return '(git status unavailable)';
  return sanitizeText(result.stdout.trim() || '(clean)');
}

export function listExisting(root, relPath, maxFiles = 40) {
  const abs = join(root, relPath);
  if (!existsSync(abs)) return [];
  const st = statSync(abs);
  if (st.isFile()) return [relPath.replace(/\\/g, '/')];
  const out = [];
  function walk(dir, base) {
    if (out.length >= maxFiles) return;
    for (const name of readdirSync(dir)) {
      if (out.length >= maxFiles) break;
      if (name === 'node_modules' || name === '.git' || name === 'dist') continue;
      const full = join(dir, name);
      const rel = `${base}/${name}`.replace(/\\/g, '/');
      const s = statSync(full);
      if (s.isDirectory()) walk(full, rel);
      else out.push(rel);
    }
  }
  walk(abs, relPath.replace(/\\/g, '/'));
  return out;
}

export function readEnvExampleFlags(root) {
  const examplePath = join(root, '.env.example');
  if (!existsSync(examplePath)) return {};
  const lines = readFileSync(examplePath, 'utf8').split('\n');
  const flags = {};
  for (const line of lines) {
    const m = line.match(/^([A-Z0-9_]+)=/);
    if (m) flags[m[1]] = '(see .env.example — value not loaded)';
  }
  return flags;
}

export function ensureRunDir(root) {
  const dir = join(root, '.agent-runs/openclaw');
  mkdirSync(dir, { recursive: true });
  return dir;
}

export function writeArtifact(root, filename, content) {
  const dir = ensureRunDir(root);
  const path = join(dir, filename);
  writeFileSync(path, content, 'utf8');
  return relative(root, path).replace(/\\/g, '/');
}

/** Sugiere agentes según tramo, fase o archivos tocados. */
export function suggestAgents({ tramo, phase, changedFiles = [] }) {
  const agents = new Set(['security', 'architecture']);

  if (tramo) {
    agents.add('release');
    agents.add('ledger');
    if (['1', '2', '3', '4', 'J', 'K'].includes(String(tramo))) agents.add('programming');
    if (['J', 'K', '2', '3'].includes(String(tramo))) agents.add('ux');
    if (['J', 'K', '4', '6'].includes(String(tramo))) agents.add('golden');
  }

  if (phase === 'B') {
    agents.add('eval');
    agents.add('clinical-safety');
  }

  const fileStr = changedFiles.join(' ').toLowerCase();
  if (/clinical|safety|draft/.test(fileStr)) agents.add('clinical-safety');
  if (/e2e|journey|golden/.test(fileStr)) agents.add('golden');
  if (/apps\/web|m3|ui|modes/.test(fileStr)) agents.add('ux');
  if (/eval|ai|ollama|blueprint/.test(fileStr)) agents.add('eval');
  if (/microphase|ledger|tablero/.test(fileStr)) agents.add('ledger');
  if (/legacy|architecture|manifest/.test(fileStr)) agents.add('architecture');

  return [...agents].filter((id) => AGENT_CATALOG[id]);
}

/** Agentes OpenClaw por tramo PROG-AUTO-DEV-6H / PM-03. */
export const AUTO_DEV_TRAMO_AGENTS = {
  0: ['security', 'architecture', 'release', 'programming'],
  1: ['security', 'clinical-safety', 'ledger', 'programming'],
  2: ['security', 'ux', 'architecture', 'golden', 'programming'],
  3: ['security', 'ux', 'architecture', 'programming'],
  4: ['security', 'architecture', 'release', 'golden', 'programming'],
  5: ['security', 'ledger', 'release'],
  6: ['security', 'architecture', 'release', 'golden', 'ledger'],
};

/** Tramos con handoff OpenClaw post-ejecución en orquestador auto-dev. */
export const AUTO_DEV_OPENCLAW_HANDOFF_TRAMOS = new Set([2, 4, 6]);

export function suggestAgentsForAutoTramo(order) {
  const base = AUTO_DEV_TRAMO_AGENTS[order] ?? ['security', 'architecture'];
  return [...new Set(base)].filter((id) => AGENT_CATALOG[id]);
}

export function isOpenClawAutoDevEnabled() {
  return (
    process.env.EPIS2_AUTO_DEV_OPENCLAW === '1' || process.env.EPIS2_OPENCLAW_SESSION === '1'
  );
}

export function buildBriefMarkdown(root, { mf, agents, timestamp }) {
  const locks = resolveOpenClawLocks();
  const lines = [
    '# OpenClaw EPIS2 Brief',
    '',
    `> **Microfase:** ${mf}`,
    `> **Modo:** ${locks.mode} (${locks.level})`,
    `> **Candados:** safe-run=${locks.safeRun} · patching=${locks.patchingEnabled} · git-write=${locks.gitWrite}`,
    `> **Generado:** ${timestamp}`,
    '',
    '## Restricciones activas',
    '',
    '- Read-only reviewer/planner — sin commits, push, ni edits autónomos',
    `- Perfil ${locks.level}: ${locks.safeRun ? 'safe-run allowlist activo' : 'solo brief/handoff'}`,
    '- PostgreSQL = SoT · borradores ≠ datos aprobados · IA no aprueba ni firma',
    '- Sin import EPIS sin manifest · sin OpenMRS/Carbon · Home = Centro de Comando',
    '',
    '## Git status (sanitized)',
    '',
    '```',
    gitStatusShort(root),
    '```',
    '',
    '## Flags (.env.example keys only — valores no cargados)',
    '',
    '```json',
    JSON.stringify(readEnvExampleFlags(root), null, 2),
    '```',
    '',
  ];

  for (const agentId of agents) {
    const agent = AGENT_CATALOG[agentId];
    if (!agent) continue;
    lines.push(`## Agente: ${agent.name}`, '');
    lines.push(`- **Skill:** \`${agent.skill}\``);
    lines.push(
      `- **Gates sugeridos (solo lectura):** ${agent.gates.map((g) => `\`npm run ${g}\``).join(', ')}`,
    );
    lines.push('', '### Archivos a revisar', '');
    for (const p of agent.paths) {
      const files = listExisting(root, p, 25);
      if (!files.length) {
        lines.push(`- \`${p}\` — *(no encontrado o vacío)*`);
        continue;
      }
      for (const f of files.slice(0, 15)) {
        lines.push(`- \`${f}\``);
      }
      if (files.length > 15) lines.push(`- … +${files.length - 15} más bajo \`${p}\``);
    }
    lines.push('');
  }

  lines.push(
    '## Comandos de verificación sugeridos (humanos / Cursor)',
    '',
    '```bash',
    'npm run check',
    'npm run test',
    'npm run architecture:validate',
    'npm run db:validate',
    '```',
    '',
    '## Prompt semilla para OpenClaw',
    '',
    'Actúa como revisor read-only EPIS2. No modifiques archivos. No ejecutes push/commit/.env.',
    `Microfase objetivo: ${mf}. Revisa los archivos listados y entrega hallazgos en formato handoff.`,
    '',
  );

  return lines.join('\n');
}

export function buildHandoffMarkdown(root, { mf, agents, timestamp, findings }) {
  const f = findings ?? {};
  return `# OpenClaw EPIS2 Handoff

## Microfase
${mf}

## Modo
${OPENCLAW_MODE} · EPIS2-native

## Agentes ejecutados
${agents.map((id) => `- ${AGENT_CATALOG[id]?.name ?? id} (\`${id}\`)`).join('\n')}

## Generado
${timestamp}

## Archivos revisados
${(f.filesReviewed ?? []).map((p) => `- \`${p}\``).join('\n') || '- *(completar tras revisión OpenClaw)*'}

## Hallazgos críticos
${f.critical?.length ? f.critical.map((x) => `- ${x}`).join('\n') : '- Ninguno registrado'}

## Hallazgos medios
${f.medium?.length ? f.medium.map((x) => `- ${x}`).join('\n') : '- Ninguno registrado'}

## Hallazgos menores
${f.minor?.length ? f.minor.map((x) => `- ${x}`).join('\n') : '- Ninguno registrado'}

## Invariantes violados
${f.invariants?.length ? f.invariants.map((x) => `- ${x}`).join('\n') : '- Ninguno detectado'}

## Comandos sugeridos
\`\`\`bash
npm run check
npm run test
npm run architecture:validate
${(f.suggestedCommands ?? []).join('\n')}
\`\`\`

## Prompt recomendado para Cursor
${f.cursorPrompt ?? 'Usa este handoff como contexto. Corrige solo lo necesario en Cursor con supervisión humana. No auto-apruebes clínica ni importes EPIS sin manifest.'}

## Recomendación
${f.recommendation ?? 'Continuar / corregir / bloquear — *(completar tras revisión)*'}

---
*Handoff generado por \`scripts/dev-agent/openclaw-handoff.mjs\`. No contiene secretos cargados desde .env.*
`;
}
