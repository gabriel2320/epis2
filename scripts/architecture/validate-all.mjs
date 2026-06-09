import { formatResult } from './lib/report.mjs';
import { validate as noLegacy } from './no-legacy-dependencies.mjs';
import { validate as singleCommand } from './single-command-registry.mjs';
import { validate as singleForm } from './single-form-registry.mjs';
import { validate as commandHome } from './command-center-home.mjs';
import { validate as spanishCopy } from './spanish-visible-copy.mjs';
import { validate as explicitPerms } from './explicit-permissions.mjs';
import { validate as aiBoundary } from './ai-write-boundary.mjs';
import { validate as humanApproval } from './human-approval-required.mjs';
import { validate as fhirBoundary } from './fhir-export-boundary.mjs';
import { validate as invariants } from './main-product-invariants.mjs';
import { validate as noDirectMui } from './no-direct-mui-imports.mjs';
import { validate as singleEpis2Theme } from './single-epis2-theme.mjs';
import { validate as singleWidget } from './single-widget-registry.mjs';
import { validate as widgetGates } from './widget-registry-gates.mjs';
import { validate as devCatalogGates } from './dev-catalog-gates.mjs';
import { validate as storybookThemeGate } from './storybook-theme-gate.mjs';
import { validate as layoutG12Gate } from './layout-g12-gate.mjs';
import { validate as componentsRootFrozen } from './web-components-root-frozen.mjs';

const VALIDATORS = [
  ['main-product-invariants', invariants],
  ['no-direct-mui-imports', noDirectMui],
  ['dev-catalog-gates', devCatalogGates],
  ['storybook-theme-gate', storybookThemeGate],
  ['layout-g12-gate', layoutG12Gate],
  ['web-components-root-frozen', componentsRootFrozen],
  ['single-epis2-theme', singleEpis2Theme],
  ['no-legacy-dependencies', noLegacy],
  ['single-command-registry', singleCommand],
  ['single-form-registry', singleForm],
  ['single-widget-registry', singleWidget],
  ['widget-registry-gates', widgetGates],
  ['command-center-home', commandHome],
  ['spanish-visible-copy', spanishCopy],
  ['explicit-permissions', explicitPerms],
  ['ai-write-boundary', aiBoundary],
  ['human-approval-required', humanApproval],
  ['fhir-export-boundary', fhirBoundary],
];

async function main() {
  console.log('EPIS2 architecture:validate\n');
  let failed = 0;

  for (const [name, fn] of VALIDATORS) {
    const result = await fn();
    const { lines, ok } = formatResult(name, result);
    for (const line of lines) console.log(line);
    if (!ok) failed += 1;
  }

  console.log('');
  if (failed > 0) {
    console.error(`architecture:validate FAILED (${failed} validador/es)`);
    process.exit(1);
  }
  console.log('architecture:validate OK — todos los gates arquitectónicos pasaron');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
