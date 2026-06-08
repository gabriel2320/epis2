#!/usr/bin/env node
/** MF-CLINICAL-PRODUCTIVITY — IA estructurada validada con Zod + parser Ollama. */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const schemaPath = join(root, 'packages/clinical-productivity/src/schemas/structuredOutput.ts');
const originPath = join(root, 'packages/clinical-productivity/src/safety/textOrigin.ts');
const extractPath = join(root, 'services/local-ai/src/extractOllamaJson.ts');
const validateAssistPath = join(root, 'services/local-ai/src/validateOutput.ts');
const validateRoutePath = join(root, 'services/local-ai/src/validateCommandRouteOutput.ts');
const devJsonPath = join(root, 'scripts/ollama/json-from-response.mjs');

for (const [label, path] of [
  ['structuredOutput.ts', schemaPath],
  ['textOrigin.ts', originPath],
  ['extractOllamaJson.ts', extractPath],
  ['json-from-response.mjs', devJsonPath],
]) {
  if (!existsSync(path)) errors.push(`Falta ${label}`);
}

const schemaSrc = readFileSync(schemaPath, 'utf8');
if (!schemaSrc.includes('z.object')) errors.push('structuredOutput debe usar Zod');
if (!schemaSrc.includes('requiresConfirmation: z.literal(true)')) {
  errors.push('Órdenes sugeridas deben requerir confirmación');
}
if (!schemaSrc.includes('parseStructuredAiOutput')) {
  errors.push('Falta parseStructuredAiOutput');
}

const originSrc = readFileSync(originPath, 'utf8');
if (!originSrc.includes('mayAutoSign')) errors.push('textOrigin debe bloquear firma automática');
if (!originSrc.includes('ai_suggestion')) errors.push('textOrigin debe marcar IA');

const extractSrc = readFileSync(extractPath, 'utf8');
if (!extractSrc.includes('parseJsonFromOllamaText')) {
  errors.push('Falta parseJsonFromOllamaText en local-ai');
}

for (const [file, path] of [
  ['validateOutput', validateAssistPath],
  ['validateCommandRouteOutput', validateRoutePath],
]) {
  const src = readFileSync(path, 'utf8');
  if (!src.includes('parseJsonFromOllamaText')) {
    errors.push(`${file} debe usar parseJsonFromOllamaText`);
  }
}

const ollamaSrc = readFileSync(join(root, 'services/local-ai/src/ollama.ts'), 'utf8');
if (!ollamaSrc.includes('think: false')) {
  errors.push('ollama.ts debe desactivar think para JSON estructurado');
}
if (!ollamaSrc.includes('/api/chat')) {
  errors.push('ollama.ts debe usar chat API para modelos Qwen');
}

if (errors.length) {
  console.error('ollama-structured-output-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('ollama-structured-output-gate OK — salida IA estructurada segura');
