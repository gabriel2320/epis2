#!/usr/bin/env node
/** PROG-CORE-LABS-FW CL-01 — core no importa labs in-repo (package.json + imports). */
import { collectCoreLabsBoundaryErrors } from '../architecture/core-labs-boundary.mjs';

const errors = await collectCoreLabsBoundaryErrors();

if (errors.length) {
  console.error('core-no-labs-imports-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('core-no-labs-imports-gate OK — apps/web, apps/api y packages/* sin deps/imports labs');
