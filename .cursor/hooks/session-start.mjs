#!/usr/bin/env node
/**
 * Cursor sessionStart — recordatorio EPIS2 (brief + tablero).
 * Windows-safe: invoca node directamente.
 */
import { createInterface } from 'node:readline';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { formatVelocityBanner, resolveVelocityContext } from '../../scripts/dev/velocity-lib.mjs';

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

const response = {
  env: {
    EPIS2_DEV_BRIEF: 'reports/dev-agent-brief.md',
    EPIS2_VELOCITY_DOC: 'docs/dev/EPIS2_DEV_VELOCITY.md',
  },
  additional_context: [
    'EPIS2 velocity (sessionStart hook)',
    banner,
    '',
    'Iteración: npm run dev:rapid · Arranque: npm run dev:velocity · /epis2-session',
    'Cierre: npm run dev:velocity:gates · quality:clinical · /epis2-close',
    `session: ${sessionId}`,
  ].join('\n'),
};

process.stdout.write(`${JSON.stringify(response)}\n`);
