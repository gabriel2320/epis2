#!/usr/bin/env node
import { validateMaterialThemes } from './validate-material-theme.mjs';

async function main() {
  const result = await validateMaterialThemes();
  if (!result.ok) {
    console.error('validate-material-color-roles FAILED');
    for (const e of result.errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  console.log('validate-material-color-roles OK');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
