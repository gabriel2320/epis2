#!/usr/bin/env node
/** PROG-DEMO-SAFETY DS-06 — banner global + killswitch auth + anti-PHI fixtures + print watermark. */
import { collectDemoSafetyErrors } from './demo-safety-scan.mjs';

const errors = collectDemoSafetyErrors();

if (errors.length) {
  console.error('demo-safety-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log(
  'demo-safety-gate OK — banner demo · auth killswitch · fixtures sin PHI · watermark print',
);
