import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { screenshotsDir } from './paths.mjs';

const EXPECTED_SHOTS = [
  '01-census.png',
  '02-ficha-dual.png',
  '03-form-draft.png',
  '04-paper-watermark.png',
  '05-census-return.png',
];

export function auditScreenshots(walkthrough) {
  const shots = walkthrough?.screenshots ?? EXPECTED_SHOTS;
  const findings = [];

  for (const name of shots) {
    const path = join(screenshotsDir, name);
    if (!existsSync(path)) {
      findings.push({ severity: 'UX-MAJOR', id: `SHOT-MISSING-${name}`, message: `screenshot missing: ${name}` });
      continue;
    }
    const size = statSync(path).size;
    if (size < 1024) {
      findings.push({
        severity: 'UX-MINOR',
        id: `SHOT-SMALL-${name}`,
        message: `screenshot suspiciously small (${size} bytes): ${name}`,
      });
    }
  }

  return { ok: findings.every((f) => f.severity !== 'UX-BLOCKER'), findings };
}
