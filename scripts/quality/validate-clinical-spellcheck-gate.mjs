#!/usr/bin/env node
/** MF-CLINICAL-TEXTBOX-TOOLS — corrector clínico no invasivo (textbox + legacy). */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const textboxSpell = join(root, 'packages/clinical-productivity/src/textbox/clinicalSpellcheck.ts');
if (!existsSync(textboxSpell)) errors.push('Falta textbox/clinicalSpellcheck.ts');

const src = readFileSync(textboxSpell, 'utf8');
if (!src.includes('simulatedLanguageToolAdapter')) {
  errors.push('clinicalSpellcheck debe exponer adaptador LanguageTool simulado');
}
if (!src.includes('isWhitelistedClinicalTerm')) {
  errors.push('clinicalSpellcheck debe respetar lista blanca');
}
if (/\.replace\s*\(\s*text/i.test(src)) {
  errors.push('clinicalSpellcheck no debe reemplazar texto silenciosamente');
}
if (!src.includes('suggestions')) {
  errors.push('clinicalSpellcheck debe devolver sugerencias visibles');
}

const ltPath = join(root, 'packages/clinical-productivity/src/textbox/languageToolAdapter.ts');
if (!existsSync(ltPath)) errors.push('Falta languageToolAdapter.ts');
const ltSrc = readFileSync(ltPath, 'utf8');
if (!ltSrc.includes('createLanguageToolAdapter')) {
  errors.push('languageToolAdapter debe exponer createLanguageToolAdapter');
}
if (!ltSrc.includes('createEpisSpellcheckAdapter')) {
  errors.push('languageToolAdapter debe exponer createEpisSpellcheckAdapter');
}

const composePath = join(root, 'docker-compose.yml');
if (existsSync(composePath)) {
  const composeSrc = readFileSync(composePath, 'utf8');
  if (!composeSrc.includes('languagetool') || !composeSrc.includes('profiles:')) {
    errors.push('docker-compose.yml debe exponer profile languagetool');
  }
  if (!composeSrc.includes('8010:8010')) {
    errors.push('docker-compose languagetool debe mapear puerto 8010');
  }
}

const e2ePath = join(root, 'e2e/clinical-textbox-evolution-draft.spec.ts');
if (!existsSync(e2ePath)) {
  errors.push('Falta e2e clinical-textbox-evolution-draft.spec.ts');
}

const legacy = spawnSync('node', [join(root, 'scripts/quality/validate-spellcheck-gate.mjs')], {
  cwd: root,
  encoding: 'utf8',
});
if (legacy.status !== 0) {
  errors.push(`validate-spellcheck-gate.mjs falló:\n${legacy.stdout ?? ''}${legacy.stderr ?? ''}`);
}

if (errors.length) {
  console.error('clinical-spellcheck-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('clinical-spellcheck-gate OK — corrector clínico textbox');
