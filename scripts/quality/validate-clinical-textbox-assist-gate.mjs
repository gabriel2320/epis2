#!/usr/bin/env node
/** MF-CLINICAL-TEXTBOX-TOOLS — endpoints IA/spellcheck textbox cableados. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const apiAiRoutes = join(root, 'apps/api/src/ai/routes.ts');
const apiClinicalRoutes = join(root, 'apps/api/src/clinical/routes.ts');
const localAiApp = join(root, 'services/local-ai/src/app.ts');
const localAiAssist = join(root, 'services/local-ai/src/textboxAssist.ts');
const contracts = join(root, 'packages/contracts/src/ai.ts');
const webAssist = join(root, 'apps/web/src/clinical/clinicalTextBoxAssist.ts');

for (const p of [apiAiRoutes, apiClinicalRoutes, localAiApp, localAiAssist, contracts, webAssist]) {
  if (!existsSync(p)) errors.push(`Falta ${p.replace(root + '/', '')}`);
}

const aiRoutes = readFileSync(apiAiRoutes, 'utf8');
if (!aiRoutes.includes('/api/ai/assist/textbox')) {
  errors.push('API debe exponer POST /api/ai/assist/textbox');
}
if (!aiRoutes.includes('aiTextboxAssistResponseSchema')) {
  errors.push('API textbox assist debe validar respuesta con Zod');
}

const clinicalRoutes = readFileSync(apiClinicalRoutes, 'utf8');
if (!clinicalRoutes.includes('/api/clinical/text-spellcheck')) {
  errors.push('API debe exponer POST /api/clinical/text-spellcheck');
}

const localSrc = readFileSync(localAiApp, 'utf8');
if (!localSrc.includes('/assist/textbox')) {
  errors.push('local-ai debe exponer POST /assist/textbox');
}

const assistSrc = readFileSync(localAiAssist, 'utf8');
if (!assistSrc.includes('localAiTextboxAssistOutputSchema')) {
  errors.push('textboxAssist debe validar salida con Zod');
}
if (!assistSrc.includes('requiresHumanReview')) {
  errors.push('textboxAssist debe exigir revisión humana');
}

const contractsSrc = readFileSync(contracts, 'utf8');
if (!contractsSrc.includes('aiTextboxAssistRequestSchema')) {
  errors.push('contracts debe definir aiTextboxAssistRequestSchema');
}

const webSrc = readFileSync(webAssist, 'utf8');
if (!webSrc.includes('requestTextboxAssist')) {
  errors.push('web debe consumir requestTextboxAssist');
}

if (errors.length) {
  console.error(
    'clinical-textbox-assist-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'),
  );
  process.exit(1);
}

console.log('clinical-textbox-assist-gate OK — IA/spellcheck textbox cableados');
