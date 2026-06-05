#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { REPO_ROOT } from './lib/paths.mjs';
import { validateMaterialThemes } from './validate-material-theme.mjs';
import { validateClinicalSemanticRoles } from './validate-clinical-semantic-roles.mjs';
import { validateNoHardcodedColors } from './validate-no-hardcoded-colors.mjs';

async function main() {
  const material = await validateMaterialThemes();
  const clinical = await validateClinicalSemanticRoles();
  const hardcoded = await validateNoHardcodedColors();

  const lines = [
    '# EPIS2 — Reporte de tema (generado)',
    '',
    `**Fecha:** ${new Date().toISOString().slice(0, 10)}`,
    '',
    '## Material Theme Builder',
    '',
    `- Temas fuente: **${material.sources?.length ?? 0}**`,
    `- Validación M3: **${material.ok ? 'OK' : 'FAIL'}**`,
    '',
    '## Roles clínicos protegidos',
    '',
    `- Validación: **${clinical.ok ? 'OK' : 'FAIL'}**`,
    '',
    '## Colores hardcodeados',
    '',
    `- Gate: **${hardcoded.ok ? 'OK' : 'FAIL'}**`,
    hardcoded.violations?.length
      ? hardcoded.violations.map((v) => `- ${v}`).join('\n')
      : '- Sin violaciones',
    '',
    '## Comandos',
    '',
    '```bash',
    'npm run theme:validate',
    'npm run theme:generate',
    'npm run theme:report',
    '```',
    '',
  ];

  const out = path.join(REPO_ROOT, 'reports/theme-pipeline-latest.md');
  await fs.writeFile(out, lines.join('\n'), 'utf8');
  console.log(`generate-theme-report OK → ${path.relative(REPO_ROOT, out)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
