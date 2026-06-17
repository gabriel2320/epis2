import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DEV_SUBAGENTS, ARCHIVED_SUBAGENT_IDS } from './subagents.mjs';

function readExcerpt(root, rel, maxLines = 40) {
  const path = join(root, rel);
  if (!existsSync(path)) return `(no encontrado: ${rel})`;
  return readFileSync(path, 'utf8').split('\n').slice(0, maxLines).join('\n');
}

function tramoPlanPath(root, tramo) {
  return join(root, `docs/product/EPIS2_TRAMO_${tramo}_PLAN.md`);
}

function tramoInventoryNote(root, tramo) {
  for (const rel of [
    `docs/product/EPIS2_TRAMO_${tramo}_QUALITY_INVENTORY.md`,
    `docs/product/EPIS2_TRAMO_${tramo}_PHARMACY_INVENTORY.md`,
    `docs/product/EPIS2_TRAMO_${tramo}_INVENTORY.md`,
  ]) {
    if (existsSync(join(root, rel))) return rel;
  }
  return null;
}

export function buildSubagentPrompt(root, subagentId, context = {}) {
  const agent = DEV_SUBAGENTS[subagentId];
  if (!agent) {
    throw new Error(`Subagente desconocido: ${subagentId}`);
  }
  if (ARCHIVED_SUBAGENT_IDS.has(subagentId)) {
    return `# ARCHIVADO — subagente \`${subagentId}\`

**No usar para planificar.** ${agent.archiveReason ?? 'Ver docs/archive/AGENT_SCOPE_EXCLUSIONS.md'}

Canon activo: \`docs/EPIS2_CURRENT_STATE.md\` · CICA: \`apps/web/src/cica/\`

Reabrir solo con MF autorizada + \`EPIS2_ALLOW_ARCHIVED_SCOPE=1\`.
`;
  }

  const tramo = context.tramo?.toUpperCase();
  const mf = context.mf ?? (tramo ? `MF-TRAMO-${tramo}-002` : 'MF-PURGE-CICA');
  const phase = context.phase ?? 'cica';

  const tramoBlock =
    tramo && existsSync(tramoPlanPath(root, tramo))
      ? `\n## Plan tramo ${tramo}\n\n${readExcerpt(root, `docs/product/EPIS2_TRAMO_${tramo}_PLAN.md`, 45)}\n\nInventario: ${tramoInventoryNote(root, tramo) ?? '—'}`
      : '';

  const activePlan = readExcerpt(root, 'docs/EPIS2_CURRENT_STATE.md', 45);

  return `# EPIS2 — Subagente \`${agent.id}\`

**Rol:** ${agent.title}  
**Microfase / alcance:** ${mf} · Fase ${phase}${tramo ? ` · Tramo ${tramo}` : ''}

## Canon obligatorio

${agent.canon.map((d) => `- \`${d}\``).join('\n')}

## Disparadores

${agent.triggers.map((t) => `- ${t}`).join('\n')}

## Gates de este rol

\`\`\`bash
${agent.gates.join('\n')}
\`\`\`

## Brújula activa (extracto)

${activePlan}

## Perímetro agente

\`docs/archive/AGENT_SCOPE_EXCLUSIONS.md\` — no planificar desde \`reports/archive/\` ni programas cerrados.
${tramoBlock}

## Reglas EPIS2 (no negociables)

- Home = censo \`/espacio/buscar-paciente\` · experiencia activa CICA \`/app/*\`
- PostgreSQL = SoT; IA no firma ni aprueba
- Sin import desde \`../Epis\` sin \`legacy-import-manifest.json\`
- No planificar desde \`reports/archive/\` ni programas en \`docs/archive/ARCHIVED_PROGRAMS_INDEX.md\`
- No commit ni push salvo orden explícita del humano
- Cerrar sesión con reporte en \`reports/\`

## Entregables

1. Cambios mínimos acotados al alcance
2. \`npm run check\` + gates del rol
3. Reporte \`reports/epis2-*.md\` con riesgos y próximo paso

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
`;
}

export function buildTramoImplementerPrompt(root, tramo, mf) {
  return buildSubagentPrompt(root, 'tramo-implementer', { tramo, mf });
}

export function buildSessionIndex(root, { phase, tramo, sequence }) {
  const lines = [
    '# EPIS2 — Sesión subagentes de desarrollo',
    '',
    `**Fase:** ${phase}${tramo ? ` · **Tramo:** ${tramo}` : ''}`,
    `**Generado:** ${new Date().toISOString()}`,
    '',
    '## Secuencia recomendada',
    '',
    ...sequence.map(
      (id, i) =>
        `${i + 1}. [\`${id}\`](./dev-agent-prompt-${id}.md) — ${DEV_SUBAGENTS[id]?.title ?? id}`,
    ),
    '',
    '## Stack Ollama (desarrollo)',
    '',
    '```bash',
    'npm run stack:dev          # Postgres + Ollama smoke',
    'npm run dev:ai             # terminal 2 — local-ai :3002',
    'npm run dev:agent:ollama   # plan JSON estructurado (opcional)',
    'npm run ai:evals:live      # evals clínicos assist',
    '```',
    '',
    '## Cierre sesión',
    '',
    '```bash',
    'npm run dev:rapid',
    'npm run quality:clinical   # cierre MF clínico',
    'npm run quality:full       # pre-PR',
    '```',
    '',
  ];
  return lines.join('\n');
}
