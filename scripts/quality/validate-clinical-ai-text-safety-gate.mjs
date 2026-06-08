#!/usr/bin/env node
/** MF-CLINICAL-TEXTBOX-TOOLS — IA clínica como sugerencia editable, nunca SoT. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const aiPath = join(root, 'packages/clinical-productivity/src/textbox/clinicalAiAssist.ts');
const textboxPath = join(root, 'packages/clinical-productivity/src/textbox/ClinicalTextBox.tsx');
const originPath = join(root, 'packages/clinical-productivity/src/safety/textOrigin.ts');

for (const p of [aiPath, textboxPath, originPath]) {
  if (!existsSync(p)) errors.push(`Falta ${p.replace(root + '/', '')}`);
}

const aiSrc = readFileSync(aiPath, 'utf8');
if (!aiSrc.includes('requiresHumanReview: z.literal(true)')) {
  errors.push('clinicalAiAssist debe validar requiresHumanReview=true con Zod');
}
if (!aiSrc.includes('requiresMedicationConfirmation')) {
  errors.push('clinicalAiAssist debe exigir confirmación para fármacos/unidades');
}
if (aiSrc.includes('onSign') || aiSrc.includes('autoApprove')) {
  errors.push('clinicalAiAssist no debe firmar ni auto-aprobar');
}

const textboxSrc = readFileSync(textboxPath, 'utf8');
const statePath = join(root, 'packages/clinical-productivity/src/textbox/useClinicalTextBoxState.ts');
const stateSrc = readFileSync(statePath, 'utf8');
if (!textboxSrc.includes('ai_suggestion') && !stateSrc.includes('ai_suggestion')) {
  errors.push('ClinicalTextBox debe marcar origen ai_suggestion');
}
if (!stateSrc.includes('confirmPending')) {
  errors.push('ClinicalTextBox debe pedir confirmación para medicamentos/exámenes');
}
if (!textboxSrc.includes('textBoxAiBadge')) {
  errors.push('ClinicalTextBox debe mostrar badge de sugerencia IA');
}

const originSrc = readFileSync(originPath, 'utf8');
if (!originSrc.includes('mayAutoSign')) {
  errors.push('textOrigin debe exponer mayAutoSign');
}
if (!originSrc.match(/mayAutoSign[\s\S]*return false/)) {
  errors.push('mayAutoSign debe devolver false siempre');
}

if (errors.length) {
  console.error('clinical-ai-text-safety-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('clinical-ai-text-safety-gate OK — IA clínica segura');
