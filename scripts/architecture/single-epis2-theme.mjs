import { walkSourceFiles } from './lib/scan-sources.mjs';

const CREATE_THEME = /\bcreateTheme\s*\(/;

/** M3-G01: un solo generador de tema productivo. */
export async function validate() {
  const details = [];

  for await (const { rel, content } of walkSourceFiles({ roots: ['apps', 'packages'] })) {
    if (rel.includes('.test.') || rel.includes('node_modules')) continue;
    if (!CREATE_THEME.test(content)) continue;
    if (rel.includes('create-epis2-theme.ts')) continue;
    details.push(`${rel} → createTheme fuera del generador M3`);
  }

  return {
    ok: details.length === 0,
    message:
      details.length === 0
        ? 'createTheme solo en create-epis2-theme.ts'
        : 'Generadores de tema duplicados detectados',
    details,
  };
}
