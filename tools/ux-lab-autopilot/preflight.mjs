import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { catalogPath, policyPath, repoRoot } from './paths.mjs';

function git(args) {
  const r = spawnSync('git', args, { cwd: repoRoot, encoding: 'utf8' });
  return (r.stdout ?? '').trim();
}

export async function runPreflight(mode) {
  const policy = JSON.parse(await readFile(policyPath, 'utf8'));
  const warnings = [];
  const blockers = [];

  const head = git(['rev-parse', '--short', 'HEAD']);
  const branch = git(['rev-parse', '--abbrev-ref', 'HEAD']);
  const porcelain = git(['status', '--porcelain']);
  const dirtyLines = porcelain ? porcelain.split('\n').filter(Boolean) : [];

  const allowedDirtyPrefixes = ['reports/ux-lab-autopilot/', 'reports/epis2-ux-lab-autopilot-'];
  const dirtyOutsideReports = dirtyLines.filter((line) => {
    const path = line.slice(3).trim();
    return !allowedDirtyPrefixes.some((prefix) => path.startsWith(prefix));
  });

  if (dirtyOutsideReports.length > 0 && mode === 'pr-candidate') {
    blockers.push(`working tree dirty (${dirtyOutsideReports.length} file(s) outside reports/ux-lab-autopilot)`);
  } else if (dirtyOutsideReports.length > 0) {
    warnings.push(`working tree has ${dirtyOutsideReports.length} uncommitted change(s) outside bot reports`);
  }

  let originMaster = '';
  try {
    originMaster = git(['rev-parse', '--short', 'origin/master']);
    const headFull = git(['rev-parse', 'HEAD']);
    const originFull = git(['rev-parse', 'origin/master']);
    if (headFull !== originFull && mode === 'pr-candidate') {
      blockers.push(`HEAD ${head} != origin/master ${originMaster}`);
    } else if (headFull !== originFull) {
      warnings.push(`HEAD ${head} != origin/master ${originMaster} (audit-only permite non-master)`);
    }
  } catch {
    warnings.push('origin/master no resolvible — omitiendo sync remoto');
  }

  const pkg = JSON.parse(readFileSync(join(repoRoot, 'package.json'), 'utf8'));
  const scriptCount = Object.keys(pkg.scripts ?? {}).length;
  if (scriptCount > policy.maxRootScripts) {
    blockers.push(`root package.json tiene ${scriptCount} scripts (máx ${policy.maxRootScripts})`);
  }

  if (pkg.scripts?.['quality:ux-lab-close']) {
    blockers.push('quality:ux-lab-close no debe estar en root package.json (usar catálogo)');
  }

  let catalogHasUxLabClose = false;
  try {
    const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));
    catalogHasUxLabClose = Boolean(catalog.gates?.['quality:ux-lab-close']);
  } catch {
    blockers.push('no se pudo leer tools/gates/catalog-full.json');
  }
  if (!catalogHasUxLabClose) {
    blockers.push('quality:ux-lab-close ausente del catálogo');
  }

  const { checkStackHealth } = await import('./env-guard.mjs');
  const health = await checkStackHealth();
  if (!health.ok) {
    warnings.push(
      `API health no OK (${health.url}) — ejecutar npm run stack:dev antes del walkthrough`,
    );
  }

  return {
    ok: blockers.length === 0,
    mode,
    head,
    branch,
    originMaster,
    scriptCount,
    warnings,
    blockers,
    policy,
  };
}
