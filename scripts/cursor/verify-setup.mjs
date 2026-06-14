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

const REQUIRED_MCP_SERVERS = ['github', 'context7', 'playwright', 'postgres-readonly'];
const OPTIONAL_MCP_SERVERS = ['figma-desktop'];

const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN?.trim();
const hasToken = Boolean(token && token.length > 10);

const mcpDbUrl = process.env.EPIS2_MCP_DATABASE_URL?.trim();
const hasMcpDbUrl = Boolean(mcpDbUrl && mcpDbUrl.startsWith('postgresql://'));

let exitCode = 0;

function status(ok, label, detail) {
  console.log(`  ${label.padEnd(22)} ${ok ? 'OK' : 'MISSING'}${detail ? ` (${detail})` : ''}`);
  if (!ok) {
    exitCode = 1;
  }
}

function warn(label, detail) {
  console.log(`  ${label.padEnd(22)} WARN${detail ? ` (${detail})` : ''}`);
}

console.log('EPIS2 Cursor setup (MF-TOOL-02…06)\n');

if (existsSync(mcpPath)) {
  const raw = readFileSync(mcpPath, 'utf8');
  const usesEnvPat = raw.includes('${env:GITHUB_PERSONAL_ACCESS_TOKEN}');
  const usesEnvDb = raw.includes('${env:EPIS2_MCP_DATABASE_URL}');
  const hasHardcodedSecret =
    /ghp_[A-Za-z0-9]+/.test(raw) ||
    /gho_[A-Za-z0-9]+/.test(raw) ||
    /figd_[A-Za-z0-9]+/.test(raw);

  status(!hasHardcodedSecret, '.cursor/mcp.json', hasHardcodedSecret ? 'posible secreto en git' : null);
  status(usesEnvPat, '  github env var', usesEnvPat ? null : 'usa ${env:GITHUB_PERSONAL_ACCESS_TOKEN}');
  status(usesEnvDb, '  postgres env var', usesEnvDb ? null : 'usa ${env:EPIS2_MCP_DATABASE_URL}');

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    status(false, '  mcp.json parse', 'JSON inválido');
    parsed = { mcpServers: {} };
  }

  const servers = parsed.mcpServers ?? {};
  for (const name of REQUIRED_MCP_SERVERS) {
    status(Boolean(servers[name]), `  mcp:${name}`);
  }
  for (const name of OPTIONAL_MCP_SERVERS) {
    if (servers[name]) {
      console.log(`  ${`mcp:${name}`.padEnd(22)} OK (opcional)`);
    } else {
      warn(`mcp:${name}`, 'Figma Desktop bridge no configurado');
    }
  }
} else {
  status(false, '.cursor/mcp.json', 'copia desde .cursor/mcp.json.example');
}

status(hasToken, 'GITHUB_PAT env', hasToken ? null : 'ver docs/dev/CURSOR_PLUGINS_EPIS2.md');

if (hasMcpDbUrl) {
  const masked = mcpDbUrl.replace(/:([^:@/]+)@/, ':***@');
  console.log(`  EPIS2_MCP_DATABASE_URL OK (${masked})`);
} else {
  warn(
    'EPIS2_MCP_DATABASE_URL',
    'añadir a .env tras npm run db:migrate — rol epis2_mcp_ro',
  );
}

const skills = ['epis2-session', 'epis2-close', 'epis2-ci'];
for (const s of skills) {
  const p = join(root, '.cursor/skills', s, 'SKILL.md');
  status(existsSync(p), `skill ${s}`);
}

const pluginManifest = join(root, 'cursor-plugin/epis2/.cursor-plugin/plugin.json');
status(existsSync(pluginManifest), 'plugin epis2');

const velocityDoc = join(root, 'docs/dev/EPIS2_DEV_VELOCITY.md');
status(existsSync(velocityDoc), 'dev velocity doc');

const mcpRoleMigration = join(root, 'database/migrations/045_epis2_mcp_ro.sql');
status(existsSync(mcpRoleMigration), 'migration 045 mcp_ro');

const otelConfig = join(root, 'infra/otel/collector-config.yaml');
status(existsSync(otelConfig), 'otel collector config');

const codeRabbit = join(root, '.coderabbit.yaml');
status(existsSync(codeRabbit), '.coderabbit.yaml');

const langfuseTrace = join(root, 'services/local-ai/src/langfuseTrace.ts');
status(existsSync(langfuseTrace), 'langfuse trace hook');

console.log('\nSiguiente: npm run stack:up && npm run db:migrate');
console.log('Observabilidad: npm run stack:observability');
console.log('Langfuse: npm run stack:langfuse');
console.log('Playwright MCP: npm run test:e2e:install');
console.log('Figma MCP: Figma Desktop abierto o OAuth en Settings → MCP');
console.log('Reiniciar Cursor tras cambiar .env o mcp.json');
console.log('Doc: docs/dev/CURSOR_PLUGINS_EPIS2.md\n');

process.exitCode = exitCode;
