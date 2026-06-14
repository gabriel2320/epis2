/**
 * Helpers para quality:fast | clinical | full (MF-RAPID-01).
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PHI_HINT_PATTERNS, SECRET_PATTERNS } from '../legacy-audit/paths.mjs';
import { getGitSummary } from '../dev-agent/context.mjs';

const CODE_EXT = /\.(tsx?|jsx?|mjs|cjs)$/i;
const LINT_EXT = /\.(tsx?|jsx?|mjs|cjs)$/i;

/** @param {string} root */
export function getChangedPaths(root) {
  const paths = new Set();
  try {
    const tracked = spawnSync('git', ['diff', '--name-only', 'HEAD'], {
      cwd: root,
      encoding: 'utf8',
    });
    if (tracked.status === 0) {
      for (const line of tracked.stdout.split('\n')) {
        const p = line.trim();
        if (p) paths.add(p.replace(/\\/g, '/'));
      }
    }
    const staged = spawnSync('git', ['diff', '--name-only', '--cached'], {
      cwd: root,
      encoding: 'utf8',
    });
    if (staged.status === 0) {
      for (const line of staged.stdout.split('\n')) {
        const p = line.trim();
        if (p) paths.add(p.replace(/\\/g, '/'));
      }
    }
    const summary = getGitSummary(root, 500);
    for (const file of summary.files) {
      paths.add(file.replace(/\\/g, '/'));
    }
  } catch {
    /* ignore */
  }
  return [...paths];
}

/** @param {string[]} changedPaths */
export function classifyChangeScope(changedPaths) {
  const codePaths = changedPaths.filter((p) => CODE_EXT.test(p));
  const docOnly =
    changedPaths.length > 0 &&
    codePaths.length === 0 &&
    changedPaths.every((p) => /^(docs|reports|\.cursor)\//.test(p) || p.endsWith('.md'));
  return { codePaths, docOnly, changedPaths };
}

/** @param {string[]} changedPaths */
export function inferWorkspaces(changedPaths) {
  /** @type {Set<string>} */
  const workspaces = new Set();
  for (const p of changedPaths) {
    const m = p.match(/^(apps|packages|services)\/([^/]+)\//);
    if (!m) continue;
    const pkgPath = join(m[1], m[2], 'package.json');
    workspaces.add(pkgPath);
  }
  return [...workspaces].sort();
}

/** @param {string} root @param {string} pkgRel e.g. packages/command-registry/package.json */
export function readWorkspaceName(root, pkgRel) {
  try {
    const pkg = JSON.parse(readFileSync(join(root, pkgRel), 'utf8'));
    return typeof pkg.name === 'string' ? pkg.name : null;
  } catch {
    return null;
  }
}

/** @param {string} root @param {string} sourcePath */
function siblingTestPaths(root, sourcePath) {
  const match = sourcePath.match(/^(.+)\.([^.]+)$/);
  if (!match) return [];
  const base = match[1];
  const ext = match[2];
  /** @type {string[]} */
  const candidates = [
    `${base}.test.${ext}`,
    `${base}.test.ts`,
    `${base}.test.tsx`,
    `${base}.spec.ts`,
  ];
  return candidates.filter((c, i, arr) => arr.indexOf(c) === i && existsSync(join(root, c)));
}

/** @param {string} root @param {string[]} changedPaths */
export function inferVitestTargets(root, changedPaths) {
  /** @type {Set<string>} */
  const files = new Set();
  /** @type {Set<string>} */
  const dirs = new Set();

  for (const p of changedPaths) {
    if (!CODE_EXT.test(p)) continue;
    if (/\.(test|spec)\.(tsx?|jsx?|mjs)$/i.test(p)) {
      files.add(p);
      continue;
    }
    for (const testPath of siblingTestPaths(root, p)) {
      files.add(testPath);
    }
    const parts = p.split('/');
    if (parts[0] === 'apps' || parts[0] === 'packages' || parts[0] === 'services') {
      dirs.add(`${parts[0]}/${parts[1]}`);
    } else if (p.startsWith('scripts/')) {
      dirs.add('scripts');
    }
  }

  if (files.size > 0) return [...files].sort();
  return [...dirs].sort();
}

/** @param {string} root @param {string[]} paths */
export function scanChangedForSensitive(root, paths) {
  const findings = [];
  const patterns = [...SECRET_PATTERNS, ...PHI_HINT_PATTERNS];
  for (const rel of paths) {
    if (!existsSync(join(root, rel))) continue;
    if (rel.includes('node_modules') || rel.endsWith('.min.js')) continue;
    let content;
    try {
      content = readFileSync(join(root, rel), 'utf8');
    } catch {
      continue;
    }
    if (content.length > 500_000) continue;
    for (const pat of patterns) {
      if (pat.re.test(content)) {
        findings.push({
          file: rel,
          id: pat.id,
          label: pat.label ?? pat.id,
          severity: pat.severity,
        });
      }
    }
  }
  return findings;
}

/** @param {string} root @param {string} label @param {string} npmScript */
export function runNpm(root, label, npmScript) {
  process.stdout.write(`▶ ${label} … `);
  const r = spawnSync('npm', ['run', npmScript], {
    cwd: root,
    shell: true,
    stdio: 'pipe',
    encoding: 'utf8',
  });
  const ok = r.status === 0;
  console.log(ok ? 'OK' : 'FAIL');
  if (!ok) {
    if (r.stdout) process.stdout.write(r.stdout);
    if (r.stderr) process.stderr.write(r.stderr);
  }
  return ok;
}

/** @param {string} root @param {string} label @param {string} cmd @param {string[]} args */
export function runCmd(root, label, cmd, args) {
  process.stdout.write(`▶ ${label} … `);
  const r = spawnSync(cmd, args, {
    cwd: root,
    shell: true,
    stdio: 'pipe',
    encoding: 'utf8',
  });
  const ok = r.status === 0;
  console.log(ok ? 'OK' : 'FAIL');
  if (!ok) {
    if (r.stdout) process.stdout.write(r.stdout);
    if (r.stderr) process.stderr.write(r.stderr);
  }
  return ok;
}

/** @param {string} root @param {string[]} lintPaths */
export function eslintChanged(root, lintPaths) {
  const files = lintPaths.filter((p) => LINT_EXT.test(p) && existsSync(join(root, p)));
  if (files.length === 0) {
    console.log('▶ eslint (changed) … skip (sin archivos lintables)');
    return true;
  }
  return runCmd(root, `eslint (${files.length} archivos)`, 'npx', ['eslint', ...files]);
}

/** @param {string} root @param {string[]} workspacePkgPaths */
export function typecheckWorkspaces(root, workspacePkgPaths) {
  if (workspacePkgPaths.length === 0) {
    console.log('▶ typecheck (touched) … skip (sin workspaces)');
    return true;
  }

  const names = workspacePkgPaths.map((p) => readWorkspaceName(root, p)).filter((n) => n != null);

  if (names.includes('@epis2/contracts') === false && names.some((n) => n.startsWith('@epis2/'))) {
    if (
      !runCmd(root, 'build @epis2/contracts', 'npm', ['run', 'build', '-w', '@epis2/contracts'])
    ) {
      return false;
    }
  }

  let ok = true;
  for (const name of names) {
    ok = runCmd(root, `typecheck ${name}`, 'npm', ['run', 'typecheck', '-w', name]) && ok;
  }
  return ok;
}

/** @param {string} root @param {string[]} vitestTargets */
export function vitestTouched(root, vitestTargets) {
  if (vitestTargets.length === 0) {
    console.log('▶ vitest (touched) … skip');
    return true;
  }

  const fileTargets = vitestTargets.filter((t) => /\.(test|spec)\.(tsx?|jsx?|mjs)$/i.test(t));
  if (fileTargets.length === vitestTargets.length) {
    return runCmd(root, `vitest (${fileTargets.length} archivos)`, 'npx', [
      'vitest',
      'run',
      ...fileTargets,
    ]);
  }

  let ok = true;
  for (const dir of vitestTargets) {
    ok = runCmd(root, `vitest ${dir}`, 'npx', ['vitest', 'run', dir]) && ok;
  }
  return ok;
}

/** @param {string} root */
export function printGitSummary(root) {
  const summary = getGitSummary(root);
  console.log(`git: ${summary.branch} · ${summary.dirtyCount} cambio(s)`);
  for (const line of summary.lines.slice(0, 12)) {
    console.log(`  ${line}`);
  }
  if (summary.truncated) console.log('  … (truncado)');
}
