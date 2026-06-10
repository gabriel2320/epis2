import { walkSourceFiles } from './lib/scan-sources.mjs';

/** Frases visibles prohibidas en inglés (UI clínica). */
const FORBIDDEN_VISIBLE_EN = [
  'Sign in',
  'Log in',
  'Dashboard',
  'Patient Chart',
  'Save draft',
  'What do you need',
  'Command Center',
  'Loading...',
  'Error:',
  'Unauthorized',
];

export async function validate() {
  const details = [];

  for await (const { rel, content } of walkSourceFiles()) {
    if (!rel.startsWith('apps/web/src')) continue;
    if (!/\.(tsx|jsx|html)$/.test(rel)) continue;
    if (rel.includes('.test.')) continue;

    for (const phrase of FORBIDDEN_VISIBLE_EN) {
      const inLiteral = new RegExp(
        `['"\`]${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"\`]`,
      ).test(content);
      const inJsxText = new RegExp(
        `>\\s*${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*<`,
      ).test(content);
      if (inLiteral || inJsxText) {
        details.push(`${rel} → microcopy visible en inglés: "${phrase}"`);
      }
    }
  }

  return {
    ok: details.length === 0,
    message:
      details.length === 0
        ? 'Microcopy visible en español (ámbito apps/web)'
        : 'Se detectó microcopy clínica en inglés',
    details,
  };
}
