#!/usr/bin/env node
/**
 * Genera blueprint + checklist de archivos a tocar (MF automation).
 * Uso: node scripts/quality/scaffold-mf-blueprint.mjs transfer_note "Nota de traslado" transfer_patient /espacio/traslado
 */
const [blueprintId, label, intentId, routePath] = process.argv.slice(2);
if (!blueprintId || !label || !intentId || !routePath) {
  console.error(
    'Uso: scaffold-mf-blueprint.mjs <blueprintId> <label> <intentId> <routePath>',
  );
  process.exit(1);
}

const kebab = blueprintId.replace(/_/g, '-');
console.log(`# Scaffold MF — ${blueprintId}`);
console.log('');
console.log('1. packages/clinical-forms/src/blueprints/' + kebab + '.ts');
console.log('2. packages/clinical-forms/src/blueprints/index.ts + registry.ts');
console.log('3. packages/command-registry types/routes/definitions');
console.log('4. database/migrations/NNN_' + blueprintId + '_draft_type.sql');
console.log('5. apps/api clinical routes + service approve hook');
console.log('6. apps/web router + clinicalApi mappings');
console.log('7. services/local-ai assistSchemas + draftPromptCatalog');
console.log('8. reports/epis2-mf-XXX-' + kebab + '.md + microphase-ledger.json');
console.log('');
console.log(`Intent: ${intentId} → ${routePath}`);
console.log(`Label: ${label}`);
