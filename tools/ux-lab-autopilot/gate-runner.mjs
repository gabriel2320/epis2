import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { catalogPath, repoRoot } from './paths.mjs';

function runNode(relPath) {
  const r = spawnSync('node', [relPath], { cwd: repoRoot, stdio: 'pipe', encoding: 'utf8' });
  return {
    ok: r.status === 0,
    stdout: r.stdout ?? '',
    stderr: r.stderr ?? '',
    code: r.status ?? 1,
  };
}

function checkUxLabCloseCatalog() {
  const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));
  const entry = catalog.gates?.['quality:ux-lab-close'];
  if (!entry) {
    return { ok: false, detail: 'quality:ux-lab-close missing from catalog-full.json' };
  }
  return { ok: true, detail: entry.type === 'command' ? entry.command : entry.path };
}

/** Tier light: script surface + catálogo ux-lab-close (sin quality:required). */
export function runGates(policy, { tier = 'light' } = {}) {
  const gateNames = tier === 'full' ? policy.fullGates ?? policy.lightGates : policy.lightGates;
  const results = [];

  for (const name of gateNames) {
    if (name === 'quality:ux-lab-close-catalog') {
      const check = checkUxLabCloseCatalog();
      results.push({
        name: 'quality:ux-lab-close-catalog',
        ok: check.ok,
        detail: check.detail,
      });
      continue;
    }

    if (name === 'quality:root-script-surface-gate') {
      const run = runNode('scripts/quality/validate-root-script-surface-gate.mjs');
      results.push({
        name,
        ok: run.ok,
        detail: run.ok ? run.stdout.trim().split('\n').pop() : run.stderr.trim() || run.stdout.trim(),
      });
      continue;
    }

    const r = spawnSync('npm', ['run', 'quality:gate', '--', name], {
      cwd: repoRoot,
      shell: true,
      encoding: 'utf8',
    });
    results.push({
      name,
      ok: r.status === 0,
      detail: (r.stdout ?? r.stderr ?? '').trim().split('\n').pop(),
    });
  }

  const errors = results.filter((g) => !g.ok).map((g) => `${g.name}: ${g.detail}`);
  return { ok: errors.length === 0, tier, results, errors };
}
