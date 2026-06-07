import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { walkSourceFiles } from './lib/scan-sources.mjs';

const ROOT = join(import.meta.dirname, '../..');
const STORYBOOK_DIR = join(ROOT, 'packages/epis2-ui/.storybook');
const STORIES_DIR = join(ROOT, 'packages/epis2-ui/src/stories');

const CREATE_THEME = /\bcreateTheme\s*\(/;
const DIRECT_MUI = /from\s+['"]@mui\/material['"]/;

/** MUI-G16: Storybook usa Epis2ThemeProvider — mismo tema que producción. */
export async function validate() {
  if (!existsSync(STORYBOOK_DIR)) {
    return {
      ok: true,
      message: 'Storybook no configurado (skip)',
      details: [],
    };
  }

  const details = [];
  const previewPath = join(STORYBOOK_DIR, 'preview.tsx');
  if (!existsSync(previewPath)) {
    details.push('Falta packages/epis2-ui/.storybook/preview.tsx');
  } else {
    const preview = readFileSync(previewPath, 'utf8');
    if (!preview.includes('Epis2ThemeProvider')) {
      details.push('.storybook/preview.tsx debe envolver con Epis2ThemeProvider');
    }
    if (CREATE_THEME.test(preview)) {
      details.push('.storybook/preview.tsx no debe llamar createTheme directamente');
    }
  }

  for await (const { rel, content } of walkSourceFiles({ roots: ['packages/epis2-ui/.storybook'] })) {
    if (CREATE_THEME.test(content) && !rel.includes('preview.tsx')) {
      details.push(`${rel} → createTheme prohibido fuera del provider canónico`);
    }
  }

  if (existsSync(STORIES_DIR)) {
    for await (const { rel, content } of walkSourceFiles({ roots: ['packages/epis2-ui/src/stories'] })) {
      if (CREATE_THEME.test(content)) {
        details.push(`${rel} → createTheme prohibido en stories`);
      }
      if (DIRECT_MUI.test(content)) {
        details.push(`${rel} → import directo @mui/material en stories (usar primitivos epis2-ui)`);
      }
    }
  }

  return {
    ok: details.length === 0,
    message:
      details.length === 0
        ? 'Storybook sincronizado con Epis2ThemeProvider'
        : 'Storybook con deriva de tema o imports MUI directos',
    details,
  };
}
