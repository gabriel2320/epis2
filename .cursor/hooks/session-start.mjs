#!/usr/bin/env node
/**
 * Cursor sessionStart — contexto vivo EPIS2 (velocity + STRENGTHEN + MF-RAPID).
 */
import { createInterface } from 'node:readline';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { formatVelocityBanner, resolveVelocityContext } from '../../scripts/dev/velocity-lib.mjs';
import { formatStrengthenLine } from '../../scripts/dev/strengthen-context.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

async function readStdin() {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin });
    const chunks = [];
    rl.on('line', (line) => chunks.push(line));
    rl.on('close', () => resolve(chunks.join('\n')));
  });
}

const raw = await readStdin();
let sessionId = 'unknown';
try {
  if (raw.trim()) {
    const input = JSON.parse(raw);
    sessionId = input.session_id ?? input.sessionId ?? sessionId;
  }
} catch {
  // stdin vacío en algunos modos — continuar
}

const ctx = resolveVelocityContext(root);
const banner = formatVelocityBanner(ctx);
const strengthenLine = ctx.strengthen ? formatStrengthenLine(ctx.strengthen) : '';

const response = {
  env: {
    EPIS2_AGENT_CONTEXT: 'docs/AGENT_CONTEXT_MINIMAL.md',
    EPIS2_DEV_BRIEF: 'reports/dev-agent-brief.md',
    EPIS2_VELOCITY_DOC: 'docs/dev/EPIS2_DEV_VELOCITY.md',
    EPIS2_STRENGTHEN_MF: ctx.strengthen?.active?.id ?? '',
  },
  additional_context: [
    'EPIS2 agent loop (sessionStart)',
    banner,
    '',
    'Adjuntar en Cursor: @docs/AGENT_CONTEXT_MINIMAL.md @reports/dev-agent-brief.md',
    ctx.brief.stale ? 'Brief stale → npm run dev:session' : '',
    strengthenLine,
    'Iteración: npm run dev:rapid · Cierre MF: npm run quality:clinical',
    'No iniciar MF READY salvo petición explícita del usuario.',
    `session: ${sessionId}`,
  ]
    .filter(Boolean)
    .join('\n'),
};

process.stdout.write(`${JSON.stringify(response)}\n`);
