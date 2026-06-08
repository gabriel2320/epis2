import { DEV_SUBAGENTS } from './subagents.mjs';
import {
  getActivePhaseHint,
  getGitSummary,
  getNextMicrophase,
  getStackHints,
  readOllamaPlan,
  suggestPrimarySubagent,
} from './context.mjs';
import { buildSessionIndex } from './prompt-builder.mjs';

const AI_DEV_LOOP = [
  '**1. Alcance** — Declarar MF, archivos permitidos y prohibidos antes de editar.',
  '**2. Contexto mínimo** — Leer solo canon + prompt del subagente activo; no re-leer todo el repo.',
  '**3. Diff mínimo** — Un problema, un PR lógico; reutilizar patrones existentes (`DashboardPanelGridSection`, RAD shell).',
  '**4. Verificar tarde** — `npm run check` al cerrar, no tras cada línea (salvo typecheck puntual).',
  '**5. Gates del rol** — Ejecutar solo los del subagente + cierre estándar.',
  '**6. Reporte** — `reports/epis2-*.md` con alcance, gates, riesgos, próximo paso exacto.',
  '**7. Humano decide** — Sin commit/push automático; Ollama planifica, no ejecuta.',
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
  const stack = await getStackHints(root);
  const ollamaPlan = readOllamaPlan(root);
  const primary =
    opts.primarySubagent ??
    suggestPrimarySubagent(git.files, { tramo, phase: resolvedPhase });

  const primaryAgent = DEV_SUBAGENTS[primary];
  const lines = [
    '# EPIS2 — Dev Brief (IA asistida)',
    '',
    '> **Inicio rápido:** abrir `@reports/dev-agent-brief.md` + `@reports/dev-agent-prompt-' +
      primary +
      '.md` en Cursor y declarar alcance en el primer mensaje.',
    '',
    `**Generado:** ${new Date().toISOString()} · **Fase:** ${resolvedPhase}${tramo ? ` · Tramo ${tramo}` : ''}`,
    '',
    '## Objetivo sugerido',
    '',
  ];

  if (ollamaPlan?.plan?.objective) {
    lines.push(`- **Ollama:** ${ollamaPlan.plan.objective}`);
    lines.push(`- **MF propuesta:** ${ollamaPlan.plan.nextMicrophase}`);
  } else if (mf) {
    lines.push(`- **Ledger READY:** \`${mf.id}\` — ${mf.name}`);
  } else {
    lines.push('- Ver `docs/product/EPIS2_GLOBAL_DEV_PLAN.md` — Fase B: Command palette + Ola 2');
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

  lines.push(
    '',
    '## Stack local',
    '',
    `- Ollama: ${stack.ollamaUp ? '✓ up' : '✗ down'} (\`${stack.ollamaUrl}\`, modelo \`${stack.model}\`)`,
    `- .env: ${stack.hasEnv ? '✓' : '✗'} · DATABASE_URL: ${stack.databaseUrl ? '✓' : '✗'}`,
    '',
    '```bash',
    'npm run stack:dev          # si falta Postgres/Ollama',
    'npm run dev:ai             # terminal 2 — assist clínico',
    'npm run dev:session        # regenerar este brief',
    '```',
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
    '',
    '## Cierre sesión',
    '',
    '```bash',
    'npm run check',
    'npm run test',
    'npm run db:validate',
    'npm run quality:layers-integration-gate   # si tocaste UI',
    'npm run dev:agent:close                     # checklist + plantilla reporte',
    '```',
    '',
    '---',
    '',
    buildSessionIndex(root, { phase: resolvedPhase, tramo, sequence }),
  );

  return lines.join('\n');
}

export { AI_DEV_LOOP };
