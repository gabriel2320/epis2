import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

export const repoRoot = join(here, '../..');
export const autopilotDir = join(repoRoot, 'tools/ux-lab-autopilot');
export const reportsDir = join(repoRoot, 'reports/ux-lab-autopilot');
export const screenshotsDir = join(reportsDir, 'screenshots');
export const walkthroughJsonPath = join(reportsDir, 'walkthrough-result.json');
export const policyPath = join(autopilotDir, 'policy.json');
export const catalogPath = join(repoRoot, 'tools/gates/catalog-full.json');
