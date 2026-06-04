import { access } from 'node:fs/promises';
import { join } from 'node:path';
import { REPO_ROOT } from './lib/paths.mjs';
import { readJsonFromRepo } from './lib/scan-sources.mjs';

const REQUIRED_DOCS = [
  'docs/product/PRODUCT_INVARIANTS.md',
  'docs/legacy/EPIS_POSTMORTEM.md',
  'docs/legacy/EPIS_REJECTED_PATTERNS.md',
  'docs/legacy/EPIS_DONOR_ALLOWLIST.md',
  'docs/quality/ANTI_DRIFT_GATES.md',
  'docs/quality/GOLDEN_CLINICAL_JOURNEY.md',
  'docs/PRODUCT_CANON.md',
  'legacy-import-manifest.json',
];

const REQUIRED_PACKAGES = [
  'packages/command-registry',
  'packages/clinical-forms',
];

export async function validate() {
  const details = [];

  for (const rel of REQUIRED_DOCS) {
    try {
      await access(join(REPO_ROOT, rel));
    } catch {
      details.push(`Falta documento invariante: ${rel}`);
    }
  }

  for (const rel of REQUIRED_PACKAGES) {
    try {
      await access(join(REPO_ROOT, rel, 'package.json'));
    } catch {
      details.push(`Falta paquete canónico: ${rel}`);
    }
  }

  try {
    const manifest = await readJsonFromRepo('legacy-import-manifest.json');
    if (!manifest.version || !Array.isArray(manifest.imports)) {
      details.push('legacy-import-manifest.json → estructura inválida');
    }
  } catch (e) {
    details.push(`legacy-import-manifest.json → ${e.message}`);
  }

  return {
    ok: details.length === 0,
    message:
      details.length === 0
        ? 'Invariantes de producto y manifiesto presentes'
        : 'Faltan invariantes de gobierno',
    details,
  };
}
