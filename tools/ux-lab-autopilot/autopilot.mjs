#!/usr/bin/env node
/**
 * EPIS2 UX-LAB Autopilot — MF-UXLAB-04 fase A (audit-only).
 * Uso: node tools/ux-lab-autopilot/autopilot.mjs [--mode audit-only]
 * Gate: npm run quality:gate -- quality:ux-lab-autopilot
 */
import { runPreflight } from './preflight.mjs';
import { runGates } from './gate-runner.mjs';
import { runPlaywrightWalkthrough } from './playwright-runner.mjs';
import { auditScreenshots } from './visual-auditor.mjs';
import { applySafeHeal } from './self-heal.mjs';
import { classifyVerdict, writeReport } from './report-writer.mjs';
import { maybeOpenPrCandidate } from './pr-writer.mjs';

function parseMode(argv) {
  const idx = argv.indexOf('--mode');
  if (idx >= 0 && argv[idx + 1]) return argv[idx + 1];
  return 'audit-only';
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

async function main() {
  const mode = parseMode(process.argv.slice(2));
  const allowed = ['audit-only', 'self-heal-safe', 'pr-candidate'];

  if (!allowed.includes(mode)) {
    console.error(`ux-lab-autopilot: modo inválido "${mode}" — usar audit-only`);
    process.exit(1);
  }

  if (mode !== 'audit-only') {
    console.error(`ux-lab-autopilot: fase A solo soporta audit-only (solicitado: ${mode})`);
    process.exit(1);
  }

  console.log('EPIS2 UX-LAB Autopilot — audit-only (MF-UXLAB-04)\n');

  const preflight = await runPreflight(mode);
  if (!preflight.ok) {
    console.error('Preflight NO-GO:\n' + preflight.blockers.map((b) => `  - ${b}`).join('\n'));
  } else {
    console.log(`Preflight OK — ${preflight.branch} @ ${preflight.head}`);
  }

  await applySafeHeal(mode, preflight);

  const gates = runGates(preflight.policy, { tier: 'light' });
  if (!gates.ok) {
    console.error('Gates NO-GO:\n' + gates.errors.map((e) => `  - ${e}`).join('\n'));
  } else {
    console.log('Gates OK (light tier)');
  }

  console.log('\n▶ Playwright Modo A walkthrough…');
  const pw = runPlaywrightWalkthrough();
  if (!pw.ok) {
    console.error('Walkthrough FAIL');
  } else {
    console.log('Walkthrough OK');
  }

  const visual = auditScreenshots(pw.walkthrough);
  const classified = classifyVerdict({
    preflight,
    gates,
    walkthrough: pw.walkthrough,
    visual,
  });

  const reportPath = writeReport({
    ctx: preflight,
    mode,
    gates,
    walkthrough: pw.walkthrough,
    classified,
    date: todayIso(),
  });

  await maybeOpenPrCandidate(mode, classified);

  console.log(`\nBOT VERDICT: ${classified.verdict}`);
  console.log(`UX-BLOCKER: ${classified.blockers.length}`);
  console.log(`Report: ${reportPath}`);
  console.log('Human signoff still required for rc4.');

  if (classified.verdict !== 'GO-CANDIDATE') {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
