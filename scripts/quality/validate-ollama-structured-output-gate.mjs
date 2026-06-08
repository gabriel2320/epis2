#!/usr/bin/env node
/** MF-CLINICAL-PRODUCTIVITY — IA estructurada validada con Zod. */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const schemaPath = join(root, 'packages/clinical-productivity/src/schemas/structuredOutput.ts');
const originPath = join(root, 'packages/clinical-productivity/src/safety/textOrigin.ts');

if (!existsSync(schemaPath)) errors.push('Falta structuredOutput.ts');
if (!existsSync(originPath)) errors.push('Falta textOrigin.ts');

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

if (errors.length) {
  console.error('ollama-structured-output-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('ollama-structured-output-gate OK — salida IA estructurada segura');
