#!/usr/bin/env node
/** MF-CLINICAL-FORM-RHF — React Hook Form + Zod encapsulados en epis2-ui / clinical-forms. */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const required = [
  'packages/clinical-forms/src/blueprintFormSchema.ts',
  'packages/epis2-ui/src/forms/useEpisClinicalBlueprintForm.ts',
  'packages/epis2-ui/src/forms/EpisClinicalFormRhf.tsx',
  'apps/web/src/pages/GeneratedClinicalFormPage.tsx',
];

for (const rel of required) {
  if (!existsSync(join(root, rel))) errors.push(`Falta ${rel}`);
}

const schemaSrc = readFileSync(
  join(root, 'packages/clinical-forms/src/blueprintFormSchema.ts'),
  'utf8',
);
if (!schemaSrc.includes('buildBlueprintFormSchema')) {
  errors.push('blueprintFormSchema.ts sin buildBlueprintFormSchema');
}

const hookSrc = readFileSync(
  join(root, 'packages/epis2-ui/src/forms/useEpisClinicalBlueprintForm.ts'),
  'utf8',
);
if (!hookSrc.includes('zodResolver')) errors.push('useEpisClinicalBlueprintForm sin zodResolver');
if (!hookSrc.includes('buildBlueprintFormSchema')) {
  errors.push('useEpisClinicalBlueprintForm sin buildBlueprintFormSchema');
}

const rhfFormSrc = readFileSync(
  join(root, 'packages/epis2-ui/src/forms/EpisClinicalFormRhf.tsx'),
  'utf8',
);
if (!rhfFormSrc.includes('Controller')) errors.push('EpisClinicalFormRhf sin Controller');
if (!rhfFormSrc.includes('useFormContext')) errors.push('EpisClinicalFormRhf sin useFormContext');

const formsIndex = readFileSync(join(root, 'packages/epis2-ui/src/forms/index.ts'), 'utf8');
for (const exportName of ['FormProvider', 'EpisClinicalFormRhf', 'useEpisClinicalBlueprintForm']) {
  if (!formsIndex.includes(exportName)) errors.push(`forms/index.ts no exporta ${exportName}`);
}

const pageSrc = readFileSync(
  join(root, 'apps/web/src/pages/GeneratedClinicalFormPage.tsx'),
  'utf8',
);
if (!pageSrc.includes('useEpisClinicalBlueprintForm')) {
  errors.push('GeneratedClinicalFormPage no usa useEpisClinicalBlueprintForm');
}
if (!pageSrc.includes('EpisClinicalFormRhf')) {
  errors.push('GeneratedClinicalFormPage no usa EpisClinicalFormRhf');
}
if (!pageSrc.includes('FormProvider')) {
  errors.push('GeneratedClinicalFormPage no envuelve FormProvider');
}
if (pageSrc.includes('<EpisClinicalForm\n') || pageSrc.includes('<EpisClinicalForm ')) {
  errors.push('GeneratedClinicalFormPage aún renderiza EpisClinicalForm legacy');
}

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === 'node_modules') continue;
      walk(full, acc);
    } else if (/\.(tsx|ts)$/.test(entry)) {
      acc.push(full);
    }
  }
  return acc;
}

const webRoot = join(root, 'apps/web/src');
for (const file of walk(webRoot)) {
  const rel = relative(root, file);
  const src = readFileSync(file, 'utf8');
  if (
    src.includes("from 'react-hook-form'") ||
    src.includes('from "react-hook-form"') ||
    src.includes("from '@hookform/resolvers'") ||
    src.includes('from "@hookform/resolvers"')
  ) {
    errors.push(`${rel} importa RHF directamente — usar @epis2/epis2-ui`);
  }
}

if (errors.length) {
  console.error('clinical-form-rhf-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('clinical-form-rhf-gate OK — RHF + Zod encapsulados en capas EPIS2');
