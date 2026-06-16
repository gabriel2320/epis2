import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { applyModeAEnv } from './env-guard.mjs';
import { repoRoot, walkthroughJsonPath } from './paths.mjs';

export function runPlaywrightWalkthrough() {
  const env = applyModeAEnv();
  const r = spawnSync(
    'npx',
    [
      'playwright',
      'test',
      '--config',
      'playwright.config.ts',
      'e2e/ux-lab-autopilot-mode-a.spec.ts',
    ],
    {
      cwd: repoRoot,
      shell: true,
      stdio: 'inherit',
      env,
    },
  );

  let walkthrough = null;
  if (existsSync(walkthroughJsonPath)) {
    walkthrough = JSON.parse(readFileSync(walkthroughJsonPath, 'utf8'));
  }

  return {
    ok: r.status === 0 && walkthrough?.ok === true,
    exitCode: r.status ?? 1,
    walkthrough,
    missingArtifact: !existsSync(walkthroughJsonPath),
  };
}
