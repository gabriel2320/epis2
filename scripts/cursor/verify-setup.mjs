#!/usr/bin/env node
/**
 * Verifica setup Cursor MCP para EPIS2 (sin secretos en stdout).
 *
 *   npm run cursor:verify
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnvFile } from '../load-env.mjs';

loadEnvFile();

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const mcpPath = join(root, '.cursor/mcp.json');

const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN?.trim();
const hasToken = Boolean(token && token.length > 10);

console.log('EPIS2 Cursor setup\n');

if (existsSync(mcpPath)) {
  const raw = readFileSync(mcpPath, 'utf8');
  const usesEnv = raw.includes('${env:GITHUB_PERSONAL_ACCESS_TOKEN}');
  console.log(`  .cursor/mcp.json     ${usesEnv ? 'OK (usa env var)' : 'WARN (revisa que no haya PAT en git)'}`);
} else {
  console.log('  .cursor/mcp.json     MISSING — copia desde .cursor/mcp.json.example');
}

console.log(`  GITHUB_PAT env       ${hasToken ? 'OK (definido)' : 'MISSING — ver docs/dev/CURSOR_PLUGINS_EPIS2.md'}`);

const skills = ['epis2-session', 'epis2-close', 'epis2-ci'];
for (const s of skills) {
  const p = join(root, '.cursor/skills', s, 'SKILL.md');
  console.log(`  skill ${s.padEnd(14)} ${existsSync(p) ? 'OK' : 'MISSING'}`);
}

const pluginManifest = join(root, 'cursor-plugin/epis2/.cursor-plugin/plugin.json');
console.log(`  plugin epis2         ${existsSync(pluginManifest) ? 'OK' : 'MISSING'}`);

const velocityDoc = join(root, 'docs/dev/EPIS2_DEV_VELOCITY.md');
console.log(`  dev velocity doc     ${existsSync(velocityDoc) ? 'OK' : 'MISSING'}`);

console.log('\nVelocidad: npm run dev:velocity · gates: npm run dev:velocity:gates');
console.log('Notion / Figma MCP: Cursor Marketplace → Install → Connect en Settings → MCP.');
console.log('Doc: docs/dev/CURSOR_PLUGINS_EPIS2.md\n');

if (!hasToken) {
  process.exitCode = 1;
}
