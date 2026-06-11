#!/usr/bin/env node
/**
 * Invoca Cursor SDK para tramo Tier X (opcional — requiere CURSOR_API_KEY).
 *
 *   node scripts/dev-agent/cursor-sdk-tramo.mjs --tramo 2
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const tramoIdx = args.includes('--tramo') ? Number(args[args.indexOf('--tramo') + 1]) : NaN;
const dryRun = args.includes('--dry-run');

const promptPath = join(root, `reports/auto-dev-cursor-prompt-tramo-${tramoIdx}.md`);
if (!existsSync(promptPath)) {
  spawnSync(
    process.execPath,
    ['scripts/dev-agent/generate-auto-dev-cursor-prompt.mjs', '--tramo', String(tramoIdx)],
    {
      cwd: root,
      stdio: 'inherit',
      shell: true,
    },
  );
}

const apiKey = process.env.CURSOR_API_KEY?.trim();
if (!apiKey) {
  console.log(`cursor-sdk-tramo: sin CURSOR_API_KEY — usar Cursor IDE con ${promptPath}`);
  process.exit(0);
}

if (process.env.EPIS2_AUTO_DEV_CURSOR_SDK === '0') {
  console.log('cursor-sdk-tramo: EPIS2_AUTO_DEV_CURSOR_SDK=0 — omitido');
  process.exit(0);
}

const prompt = readFileSync(promptPath, 'utf8');
if (dryRun) {
  console.log(`cursor-sdk-tramo dry-run — prompt ${prompt.length} chars`);
  process.exit(0);
}

async function runSdk() {
  try {
    const { Agent } = await import('@cursor/sdk');
    console.log(`cursor-sdk-tramo: Agent.prompt tramo ${tramoIdx}…`);
    const result = await Agent.prompt(prompt, {
      apiKey,
      model: { id: process.env.EPIS2_CURSOR_SDK_MODEL ?? 'composer-2.5' },
      local: { cwd: root },
    });
    console.log(`cursor-sdk-tramo: status=${result.status}`);
    if (result.status !== 'completed') process.exit(1);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('Cannot find module') || msg.includes('@cursor/sdk')) {
      console.log(
        'cursor-sdk-tramo: @cursor/sdk no instalado — npm install @cursor/sdk -D o usar cola IDE',
      );
      console.log(`  Prompt: ${promptPath}`);
      process.exit(0);
    }
    console.error(`cursor-sdk-tramo FAILED: ${msg}`);
    process.exit(1);
  }
}

void runSdk();
