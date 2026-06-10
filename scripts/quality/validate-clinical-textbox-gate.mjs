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
const allergyBlueprint = join(root, 'packages/clinical-forms/src/blueprints/allergy-entry.ts');

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
const richPath = join(
  root,
  'packages/clinical-productivity/src/textbox/ClinicalTextBoxRichEditor.tsx',
);
if (!existsSync(richPath)) errors.push('Falta ClinicalTextBoxRichEditor.tsx (Tiptap)');
const termDropdownPath = join(
  root,
  'packages/clinical-productivity/src/textbox/ClinicalTextBoxTermDropdown.tsx',
);
if (!existsSync(termDropdownPath)) {
  errors.push('Falta ClinicalTextBoxTermDropdown.tsx (autocomplete inline)');
}
const statePath = join(
  root,
  'packages/clinical-productivity/src/textbox/useClinicalTextBoxState.ts',
);
const stateSrc = readFileSync(statePath, 'utf8');
if (!stateSrc.includes('autocompleteClinicalTerms') || !stateSrc.includes('insertTermSuggestion')) {
  errors.push('useClinicalTextBoxState debe cablear autocomplete inline del diccionario');
}
if (!textboxSrc.includes('ClinicalTextBoxTermDropdown')) {
  errors.push('ClinicalTextBox debe renderizar dropdown de términos clínicos');
}
if (!textboxSrc.includes('createTextOrigin')) {
  errors.push('ClinicalTextBox debe registrar origen de texto');
}
if (
  !textboxSrc.includes('sanitizePastedClinicalText') &&
  !readFileSync(
    join(root, 'packages/clinical-productivity/src/textbox/useClinicalTextBoxState.ts'),
    'utf8',
  ).includes('sanitizePastedClinicalText')
) {
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
// La persistencia vive en el hook extraído (auditoría 4.1) — validar página + hook.
const persistenceHookPath = join(
  root,
  'apps/web/src/clinical/generated-form/useGeneratedFormDraftPersistence.ts',
);
const persistenceSrc = existsSync(persistenceHookPath)
  ? readFileSync(persistenceHookPath, 'utf8')
  : '';
const formAndPersistenceSrc = formSrc + persistenceSrc;
if (!formSrc.includes('renderClinicalTextBox')) {
  errors.push('GeneratedClinicalFormPage debe cablear renderClinicalTextBox');
}
if (!formSrc.includes('attachToDraftBody') || !formSrc.includes('useClinicalTextBoxOrigins')) {
  errors.push('GeneratedClinicalFormPage debe persistir trazabilidad al guardar borrador');
}
if (!formSrc.includes('hydratedDraftIdRef') || !formSrc.includes('editingDraftId')) {
  errors.push('GeneratedClinicalFormPage debe hidratar borrador una sola vez por draftId');
}
if (!formAndPersistenceSrc.includes('updateDraftMutation')) {
  errors.push('GeneratedClinicalFormPage debe actualizar borrador existente');
}

const draftReviewPath = join(root, 'apps/web/src/pages/DraftReviewPage.tsx');
if (existsSync(draftReviewPath)) {
  const reviewSrc = readFileSync(draftReviewPath, 'utf8');
  if (!reviewSrc.includes('summarizeDraftTextBoxMeta')) {
    errors.push('DraftReviewPage debe mostrar meta completa de ClinicalTextBox');
  }
  if (!reviewSrc.includes('mergeDraftFieldMetaFromBody')) {
    errors.push('DraftReviewPage debe leer _epis2TextBoxMeta con retrocompat');
  }
}

const metaSchemaPath = join(
  root,
  'packages/clinical-productivity/src/textbox/draftBodyMetaSchema.ts',
);
if (!existsSync(metaSchemaPath)) {
  errors.push('Falta draftBodyMetaSchema.ts (validación Zod meta borrador)');
}
const routesPath = join(root, 'apps/api/src/clinical/routes.ts');
if (existsSync(routesPath)) {
  const routesSrc = readFileSync(routesPath, 'utf8');
  if (!routesSrc.includes('validateDraftBodyEpis2Meta')) {
    errors.push('API drafts debe validar meta _epis2 con Zod');
  }
}

const originsPath = join(root, 'packages/clinical-productivity/src/textbox/draftTextOrigins.ts');
if (!existsSync(originsPath)) errors.push('Falta textbox/draftTextOrigins.ts');
const originsSrc = readFileSync(originsPath, 'utf8');
if (!originsSrc.includes('EPIS2_DRAFT_TEXTBOX_META_KEY')) {
  errors.push('draftTextOrigins debe persistir _epis2TextBoxMeta');
}
if (!originsSrc.includes('attachClinicalTextBoxTraceToDraftBody')) {
  errors.push('draftTextOrigins debe adjuntar meta completa ClinicalTextBox');
}

const originsHookPath = join(root, 'apps/web/src/clinical/useClinicalTextBoxOrigins.ts');
if (existsSync(originsHookPath)) {
  const hookSrc = readFileSync(originsHookPath, 'utf8');
  if (!hookSrc.includes('attachClinicalTextBoxTraceToDraftBody')) {
    errors.push('useClinicalTextBoxOrigins debe persistir meta completa');
  }
}

const allergySrc = readFileSync(allergyBlueprint, 'utf8');
if (!allergySrc.includes('clinicalTextBox: true')) {
  errors.push('allergy-entry debe pilotar ClinicalTextBox en reactionNotes');
}

if (errors.length) {
  console.error('clinical-textbox-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('clinical-textbox-gate OK — MF-CLINICAL-TEXTBOX-TOOLS');
