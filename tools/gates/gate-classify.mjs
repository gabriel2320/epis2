/**
 * Clasificación gates activos vs archived (PROG-CONSOLIDATE prune phase 1).
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const gatesDir = dirname(fileURLToPath(import.meta.url));
const root = join(gatesDir, '../..');

const MANIFEST_NAMES = ['required', 'release', 'nightly', 'experimental'];

/** Gates referenciados en manifiestos, CI o scripts raíz — no composición gate→gate. */
export function loadManifestWired() {
  const wired = new Set();

  for (const name of MANIFEST_NAMES) {
    const manifest = JSON.parse(readFileSync(join(gatesDir, `${name}.json`), 'utf8'));
    for (const step of manifest.steps ?? []) {
      const viaGate = step.match(/quality:gate\s+--\s+(quality:[\w-]+)/);
      if (viaGate) wired.add(viaGate[1]);
      const direct = step.match(/^npm run (quality:[\w-]+)/);
      if (direct) wired.add(direct[1]);
    }
  }

  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  for (const [key, val] of Object.entries(pkg.scripts ?? {})) {
    if (key.startsWith('quality:')) wired.add(key);
    const viaGate = String(val).match(/quality:gate\s+--\s+(quality:[\w-]+)/);
    if (viaGate) wired.add(viaGate[1]);
  }

  const workflowsDir = join(root, '.github/workflows');
  if (existsSync(workflowsDir)) {
    for (const file of readdirSync(workflowsDir).filter((f) => /\.ya?ml$/i.test(f))) {
      const text = readFileSync(join(workflowsDir, file), 'utf8');
      for (const m of text.matchAll(/quality:gate\s+--\s+(quality:[\w-]+)/g)) {
        wired.add(m[1]);
      }
    }
  }

  return wired;
}

/** Gates en disco ya comprometidos en git — promover a catálogo activo. */
export const PROMOTE_TO_ACTIVE = [
  'quality:e2e-transversal-bar-gate',
  'quality:gates-inventory-gate',
  'quality:gates-prune-phase1-gate',
  'quality:gates-prune-phase2-gate',
];

const ARCHIVE_PROGRAMS = [
  { id: 'PROG-STRENGTHEN', re: /^quality:sh-(02|05|06)-/ },
  {
    id: 'PROG-FICHA-FIRST-norm',
    re: /^quality:(ficha-norm-(benchmark|density|mirror-b1|mirror-b2|motion|theme|typography)-gate|login-command-home-gate)$/,
  },
  {
    id: 'PROG-THREE-MODES',
    re: /^quality:(classic-md3-ai-mode|classic-md3-mode|dashboard-md3-mode|mode-guards|mode-safety|mode-switcher|mode-transitions|three-modes-design-agents)-gate$/,
  },
  { id: 'Olas-TE-PA', re: /^quality:(cm-\d+-|ola|te-|m3-scaffold)/ },
  { id: 'paper-planner', re: /^quality:paper-planner-/ },
  { id: 'dual-chart-next', re: /^quality:dual-chart-next$/ },
  {
    id: 'Tramos-scaffold',
    re: /^quality:tramo-[a-k]-(?!closure-gate)(?!e2e-registry)(?!scaffold-canon)/,
  },
];

/** Nunca archivar — post-rc3 / gobernanza / wired-adjacent activa. */
export const KEEP_ACTIVE = new Set([
  ...PROMOTE_TO_ACTIVE,
  'quality:ficha-first-gate',
  'quality:ficha-first-next',
  'quality:ficha-norm-signoff-gate',
  'quality:three-modes-gate',
  'quality:sh-03-degrade-gate',
  'quality:strengthen-close-gate',
  'quality:strengthen-next',
  'quality:rapid-gate',
  'quality:core-no-labs-imports-gate',
  'quality:demo-safety-gate',
  'quality:root-script-surface-gate',
  'quality:deps-hygiene-gate',
  'quality:legal-disclaimer-gate',
  'quality:security-promote-gate',
  'quality:agent-truth-gate',
  'quality:ux-lab-autopilot-gate',
  'quality:ux-lab-close',
  'quality:ux-pilot-gate',
  'quality:dual-chart-gate',
  'quality:dual-chart-traditional-layout-gate',
  'quality:dual-chart-paper-layout-gate',
  'quality:registry-gate',
  'quality:tramos-hygiene-gate',
  'quality:ux-g02',
]);

export function gateArchiveProgram(gate, wired) {
  if (wired.has(gate) || KEEP_ACTIVE.has(gate)) return null;
  for (const { id, re } of ARCHIVE_PROGRAMS) {
    if (re.test(gate)) return id;
  }
  return null;
}

/** Phase 2 — catalog-only no wired → archived (scripts en disco intactos). */
export function gateArchivePhase2(gate, wired) {
  if (wired.has(gate) || KEEP_ACTIVE.has(gate)) return null;
  return 'catalog-only-phase2';
}

export function gateToFileEntry(gate) {
  const slug = gate.replace(/^quality:/, '').replace(/-gate$/, '');
  return {
    type: 'file',
    path: `scripts/quality/validate-${slug}-gate.mjs`,
  };
}
