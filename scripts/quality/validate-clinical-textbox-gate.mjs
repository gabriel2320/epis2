#!/usr/bin/env node
/** MF-CLINICAL-TEXTBOX-TOOLS — wrapper EPIS2, mini-toolbar, trazabilidad. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const textboxPath = join(root, 'packages/clinical-productivity/src/textbox/ClinicalTextBox.tsx');
const toolbarPath = join(
  root,
  'packages/clinical-productivity/src/textbox/ClinicalTextBoxMiniToolbar.tsx',
);
const indexPath = join(root, 'packages/clinical-productivity/src/index.ts');
const bridgePath = join(root, 'apps/web/src/clinical/clinicalTextBoxField.tsx');
const formPagePath = join(root, 'apps/web/src/pages/GeneratedClinicalFormPage.tsx');
const allergyBlueprint = join(
  root,
  'packages/clinical-forms/src/blueprints/allergy-entry.ts',
);

for (const p of [textboxPath, toolbarPath, indexPath, bridgePath, allergyBlueprint]) {
  if (!existsSync(p)) errors.push(`Falta ${p.replace(root + '/', '')}`);
}

const indexSrc = readFileSync(indexPath, 'utf8');
if (!indexSrc.includes('ClinicalTextBox')) {
  errors.push('index.ts debe exportar ClinicalTextBox');
}

const textboxSrc = readFileSync(textboxPath, 'utf8');
if (!textboxSrc.includes('ClinicalTextBoxRichEditor') && !textboxSrc.includes("mode === 'rich'")) {
  errors.push('ClinicalTextBox debe soportar modo rich vía Tiptap wrapper');
}
const richPath = join(root, 'packages/clinical-productivity/src/textbox/ClinicalTextBoxRichEditor.tsx');
if (!existsSync(richPath)) errors.push('Falta ClinicalTextBoxRichEditor.tsx (Tiptap)');
if (!textboxSrc.includes('createTextOrigin')) {
  errors.push('ClinicalTextBox debe registrar origen de texto');
}
if (!textboxSrc.includes('sanitizePastedClinicalText') && !readFileSync(join(root, 'packages/clinical-productivity/src/textbox/useClinicalTextBoxState.ts'), 'utf8').includes('sanitizePastedClinicalText')) {
  errors.push('ClinicalTextBox debe pegar limpio vía pasteSanitizer');
}
if (textboxSrc.includes('mayAutoSign') && textboxSrc.match(/mayAutoSign\([^)]+\)\s*\?\s*onSign/)) {
  errors.push('ClinicalTextBox no debe firmar según origen');
}
if (textboxSrc.includes('Toolbar') && !textboxSrc.includes('ClinicalTextBoxMiniToolbar')) {
  errors.push('ClinicalTextBox no debe usar toolbar grande propia');
}

const toolbarSrc = readFileSync(toolbarPath, 'utf8');
const maxMatch = toolbarSrc.match(/MAX_VISIBLE\s*=\s*(\d+)/);
if (!maxMatch || Number(maxMatch[1]) > 5) {
  errors.push('Mini-toolbar debe exponer máximo 5 acciones visibles');
}
if (!toolbarSrc.includes('EpisContextMenu')) {
  errors.push('Acciones avanzadas deben ir en menú ⋯');
}

const bridgeSrc = readFileSync(bridgePath, 'utf8');
if (bridgeSrc.includes('@tiptap/') || bridgeSrc.includes('languagetool')) {
  errors.push('apps/web no debe importar Tiptap/LanguageTool directamente');
}

const formSrc = readFileSync(formPagePath, 'utf8');
if (!formSrc.includes('renderClinicalTextBox')) {
  errors.push('GeneratedClinicalFormPage debe cablear renderClinicalTextBox');
}
if (!formSrc.includes('attachToDraftBody') || !formSrc.includes('useClinicalTextBoxOrigins')) {
  errors.push('GeneratedClinicalFormPage debe persistir trazabilidad al guardar borrador');
}
if (!formSrc.includes('hydratedDraftIdRef') || !formSrc.includes('editingDraftId')) {
  errors.push('GeneratedClinicalFormPage debe hidratar borrador una sola vez por draftId');
}
if (!formSrc.includes('updateDraftMutation')) {
  errors.push('GeneratedClinicalFormPage debe actualizar borrador existente');
}

const draftReviewPath = join(root, 'apps/web/src/pages/DraftReviewPage.tsx');
if (existsSync(draftReviewPath)) {
  const reviewSrc = readFileSync(draftReviewPath, 'utf8');
  if (!reviewSrc.includes('extractTextOriginsFromDraftBody')) {
    errors.push('DraftReviewPage debe mostrar trazabilidad de texto');
  }
}

const originsPath = join(root, 'packages/clinical-productivity/src/textbox/draftTextOrigins.ts');
if (!existsSync(originsPath)) errors.push('Falta textbox/draftTextOrigins.ts');

const allergySrc = readFileSync(allergyBlueprint, 'utf8');
if (!allergySrc.includes('clinicalTextBox: true')) {
  errors.push('allergy-entry debe pilotar ClinicalTextBox en reactionNotes');
}

if (errors.length) {
  console.error('clinical-textbox-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('clinical-textbox-gate OK — MF-CLINICAL-TEXTBOX-TOOLS');
