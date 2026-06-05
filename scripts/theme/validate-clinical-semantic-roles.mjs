#!/usr/bin/env node
import fs from 'node:fs/promises';
import { CLINICAL_SEMANTIC_ROLES_FILE } from './lib/paths.mjs';
import { isHexColor } from './lib/contrast.mjs';

const REQUIRED_KEYS = [
  'critical',
  'warning',
  'approved',
  'draft',
  'blocked',
  'aiAssistance',
  'missingData',
];

export async function validateClinicalSemanticRoles() {
  const content = await fs.readFile(CLINICAL_SEMANTIC_ROLES_FILE, 'utf8');
  const errors = [];

  for (const key of REQUIRED_KEYS) {
    if (!content.includes(`${key}:`)) {
      errors.push(`Falta rol clínico protegido: ${key}`);
    }
  }

  const hexMatches = content.match(/#[0-9A-Fa-f]{6}/g) ?? [];
  for (const hex of hexMatches) {
    if (!isHexColor(hex)) errors.push(`Color inválido: ${hex}`);
  }

  if (content.includes('Ollama')) {
    errors.push('clinical-semantic-roles no debe mencionar Ollama');
  }

  return { ok: errors.length === 0, errors };
}

async function main() {
  const result = await validateClinicalSemanticRoles();
  if (!result.ok) {
    console.error('validate-clinical-semantic-roles FAILED');
    for (const e of result.errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  console.log('validate-clinical-semantic-roles OK');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
