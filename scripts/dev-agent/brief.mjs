import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DEV_SUBAGENTS } from './subagents.mjs';
import {
  getActivePhaseHint,
  getGitSummary,
  getNextMicrophase,
  getStackHints,
  getTableroState,
  readOllamaPlan,
  suggestPrimarySubagent,
} from './context.mjs';
import { formatStrengthenLine, getStrengthenActive } from '../dev/strengthen-context.mjs';
import { formatFichaFirstLine, getFichaFirstActive } from '../dev/ficha-first-context.mjs';
import { getHeadShort } from '../dev/velocity-lib.mjs';
import { buildSessionIndex } from './prompt-builder.mjs';
import { isEvolabPresent, resolveEvolabRoot } from './evolab-bridge.mjs';

function getEvolabOpenFindingsHint(root) {
  if (!process.env.EPIS2_EVOLAB_ROOT?.trim() && !isEvolabPresent()) return null;
  const syncPath = join(root, 'reports/evolab-open-findings.json');
  if (!existsSync(syncPath)) {
    return 'Evolab configurado — ejecutar `npm run dev:evolab:sync` para conteo de hallazgos abiertos';
  }
  try {
    const data = JSON.parse(readFileSync(syncPath, 'utf8'));
    const count = data.count ?? data.findings?.length ?? 0;
    return `Evolab hallazgos abiertos: **${count}** (sync ${data.syncedAt ?? '?'})`;
  } catch {
    return 'Evolab sync ilegible — `npm run dev:evolab:sync`';
  }
}

const AI_DEV_LOOP = [
  '**1. Alcance** — Declarar MF, archivos permitidos y prohibidos antes de editar.',
  '**2. Contexto mínimo** — Leer solo canon + prompt del subagente activo; no re-leer todo el repo.',
  '**3. Diff mínimo** — Un problema, un PR lógico; reutilizar patrones existentes (`DashboardPanelGridSection`, RAD shell).',
  '**4. Verificar tarde** — `npm run check` al cerrar, no tras cada línea (salvo typecheck puntual).',
  '**5. Gates del rol** — Ejecutar solo los del subagente + cierre estándar.',
  '**6. Reporte** — `reports/epis2-*.md` con alcance, gates, riesgos, próximo paso exacto.',
  '**7. Humano decide** — Sin commit/push automático; Ollama auto (`dev:agent:ollama-auto`) o apply L0 tras revisar plan.',
];

/**
 * Brief único para Cursor / agente — pegar o @mention al iniciar sesión.
 * @param {string} root
 * @param {{ phase?: string, tramo?: string, sequence: string[], primarySubagent?: string }} opts
 */
export async function buildDevBrief(root, opts) {
  const { phase, tramo, sequence } = opts;
  const resolvedPhase = phase ?? getActivePhaseHint(root);
  const git = getGitSummary(root);
  const mf = getNextMicrophase(root);
  const strengthen = getStrengthenActive(root);
  const fichaFirst = getFichaFirstActive(root);
  const stack = await getStackHints(root);
  const ollamaPlan = readOllamaPlan(root);
  const tablero = getTableroState(root);
  const head = getHeadShort(root);
  const primary =
    opts.primarySubagent ?? suggestPrimarySubagent(git.files, { tramo, phase: resolvedPhase });

  const primaryAgent = DEV_SUBAGENTS[primary];
  const lines = [
    '# EPIS2 — Dev Brief (IA asistida)',
    '',
    '> **Inicio rápido:** `@docs/AGENT_CONTEXT_MINIMAL.md` + `@docs/archive/AGENT_SCOPE_EXCLUSIONS.md` + `@reports/dev-agent-brief.md` + `@reports/dev-agent-prompt-' +
      primary +
      '.md` — declarar alcance en el primer mensaje.',
    '',
    `**Generado:** ${new Date().toISOString()} · **HEAD:** \`${head}\` · **Fase:** ${resolvedPhase}${tramo ? ` · Tramo ${tramo}` : ''}`,
    '',
    '## Orquestador (PROG-PURGE-CICA + CICA)',
    '',
    '- **Alcance agente:** `docs/archive/AGENT_SCOPE_EXCLUSIONS.md` — no retomar tramos/olas archivados',
    '- **Iteración:** `npm run dev:rapid` · cierre MF: `npm run quality:clinical`',
    '- **Visual activa:** CICA `/app/*` · legacy `/espacio/*` = fallback only',
    '- **No** iniciar MF READY de programas cerrados salvo petición explícita + `EPIS2_ALLOW_ARCHIVED_SCOPE=1`',
    ...(strengthen ? [formatStrengthenLine(strengthen)] : []),
    ...(fichaFirst ? [formatFichaFirstLine(fichaFirst)] : []),
    strengthen?.active
      ? `- Allowlist: ${strengthen.active.allowedPaths.slice(0, 4).join(', ')}${strengthen.active.allowedPaths.length > 4 ? '…' : ''}`
      : '',
    '',
    '## Estado del tablero (fuente canónica)',
    '',
  ];

  if (tablero.activeThreads.length > 0) {
    lines.push(...tablero.activeThreads.map((t) => `- **En curso:** ${t}`));
  }
  if (tablero.nextSteps.length > 0) {
    lines.push(...tablero.nextSteps.slice(0, 3).map((s) => `- **Siguiente:** ${s}`));
  }
  if (tablero.activeThreads.length === 0 && tablero.nextSteps.length === 0) {
    lines.push('- Tablero no legible — revisar `docs/product/EPIS2_TABLERO.md` manualmente.');
  }

  lines.push('', '## Objetivo sugerido', '');

  if (strengthen?.active) {
    lines.push(
      `- **STRENGTHEN ${strengthen.active.state}:** \`${strengthen.active.id}\` — ${strengthen.active.name}`,
    );
    if (strengthen.active.gate) {
      lines.push(`- **Gate:** \`${strengthen.active.gate}\``);
    }
  } else if (mf) {
    lines.push(`- **Ledger READY:** \`${mf.id}\` — ${mf.name}`);
  } else if (tablero.nextSteps.length > 0) {
    lines.push(`- ${tablero.nextSteps[0]}`);
  } else {
    lines.push('- Ver `docs/product/EPIS2_TABLERO.md` § Siguiente.');
  }
  if (ollamaPlan?.plan?.objective) {
    lines.push(`- **Ollama (≤24 h):** ${ollamaPlan.plan.objective}`);
    lines.push(`- **MF propuesta:** ${ollamaPlan.plan.nextMicrophase}`);
  }

  lines.push(
    '',
    '## Subagente primario',
    '',
    `**[\`${primary}\`](./dev-agent-prompt-${primary}.md)** — ${primaryAgent?.title ?? primary}`,
    '',
    '## Secuencia completa',
    '',
    ...sequence.map((id, i) => `${i + 1}. \`${id}\` — ${DEV_SUBAGENTS[id]?.title ?? id}`),
    '',
    '## Working tree',
    '',
    `- Rama: \`${git.branch}\` · cambios: ${git.dirtyCount}${git.truncated ? ' (lista truncada)' : ''}`,
  );

  if (git.lines.length > 0) {
    lines.push('', '```', ...git.lines, '```');
  } else {
    lines.push('', '_Working tree limpio._');
  }

  const evolabHint = getEvolabOpenFindingsHint(root);
  if (evolabHint) {
    lines.push(
      '',
      '## Evolab (QA externo)',
      '',
      `- ${evolabHint}`,
      `- Root: \`${resolveEvolabRoot()}\``,
    );
  }

  const openclawBrief = join(root, 'reports/archive/2026-06/openclaw-latest-brief.md');
  if (existsSync(openclawBrief)) {
    lines.push(
      '',
      '## OpenClaw (revisores read-only)',
      '',
      '- Brief: `@reports/archive/2026-06/openclaw-latest-brief.md`',
      '- Handoff cierre: `npm run openclaw:handoff -- --agents auto`',
      '- Docs: `docs/product/EPIS2_OPENCLAW_INTEGRATION.md`',
    );
  }

  lines.push(
    '',
    '## Stack local',
    '',
    `- Estación: tier **${stack.workstation.tier}** · ${stack.workstation.ramGb} GB RAM · ${stack.workstation.vramGb || '?'} GB VRAM`,
    `- Ollama clínica: ${stack.ollamaUp ? '✓ up' : '✗ down'}${stack.ollamaUp && !stack.ollamaModelReady ? ' (modelo pendiente pull)' : ''} → \`${stack.model}\``,
    `- dev-plan: \`${stack.routes.devPlan.model}\` (${stack.routes.devPlan.mode}) · dev-write: \`${stack.routes.devWrite.model}\` (${stack.routes.devWrite.mode})`,
    `- Enrutado: \`npm run ollama:route\` · pull coders: \`npm run ai:pull-coder-models\``,
    `- .env: ${stack.hasEnv ? '✓' : '✗'} · DATABASE_URL: ${stack.databaseUrl ? '✓' : '✗'}`,
    '',
    '```bash',
    'npm run stack:dev          # si falta Postgres/Ollama',
    'npm run dev:velocity       # banner vivo',
    'npm run dev:rapid          # iteración MF-RAPID',
    'npm run dev:session        # regenerar este brief',
    '```',
    '',
    '## Fuera de alcance (archivado)',
    '',
    '- `reports/archive/**` · tramos A–K · three modes · olas M3 · subagentes `tramo-implementer`, `layers-integrator`, `m3-guardian`',
    '- Índice programas cerrados: `docs/archive/ARCHIVED_PROGRAMS_INDEX.md`',
    '',
    '## Loop IA (mejores prácticas EPIS2)',
    '',
    ...AI_DEV_LOOP.map((l) => `- ${l}`),
    '',
    '## Prohibido',
    '',
    '- OpenMRS / Carbon / dashboard como home',
    '- Import masivo EPIS sin manifest',
    '- Auto-aprobación clínica · IA escribiendo SoT',
    '- Segundo Command/Form Registry temporal',
    '- Planificar desde `reports/archive/` o reabrir tramos/olas sin MF + EPIS2_ALLOW_ARCHIVED_SCOPE=1',
    '',
    '## Cierre sesión',
    '',
    '```bash',
    'npm run dev:rapid',
    'npm run quality:clinical   # cierre MF clínico',
    'npm run quality:full       # pre-PR',
    'npm run db:validate',
    'npm run dev:agent:close    # checklist + plantilla reporte',
    '```',
    '',
    '---',
    '',
    buildSessionIndex(root, { phase: resolvedPhase, tramo, sequence }),
  );

  return lines.join('\n');
}

export { AI_DEV_LOOP };
