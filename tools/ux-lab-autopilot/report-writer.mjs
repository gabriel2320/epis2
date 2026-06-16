import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { reportsDir } from './paths.mjs';

export function classifyVerdict({ preflight, gates, walkthrough, visual }) {
  const blockers = [];
  const major = [];
  const minor = [];
  const observations = [...(preflight.warnings ?? [])];

  if (!preflight.ok) {
    for (const b of preflight.blockers) {
      blockers.push({ id: 'PREFLIGHT', message: b });
    }
  }

  if (!gates.ok) {
    for (const e of gates.errors) {
      blockers.push({ id: 'GATE', message: e });
    }
  }

  if (!walkthrough?.ok) {
    blockers.push({
      id: 'WALKTHROUGH',
      message: walkthrough?.error ?? 'Playwright walkthrough failed or missing artifact',
    });
  }

  for (const signal of walkthrough?.signals ?? []) {
    if (!signal.ok) {
      blockers.push({
        id: `SIGNAL-${signal.id}`,
        message: `missing signal ${signal.testId ?? signal.id} on ${signal.surface}`,
      });
    }
  }

  const criticalConsole = walkthrough?.criticalConsoleErrors ?? [];
  for (const err of criticalConsole) {
    blockers.push({ id: 'CONSOLE', message: err });
  }

  for (const f of visual?.findings ?? []) {
    if (f.severity === 'UX-BLOCKER') blockers.push({ id: f.id, message: f.message });
    else if (f.severity === 'UX-MAJOR') major.push({ id: f.id, message: f.message });
    else minor.push({ id: f.id, message: f.message });
  }

  const verdict = blockers.length === 0 ? 'GO-CANDIDATE' : 'NO-GO';
  return { verdict, blockers, major, minor, observations };
}

export function writeReport({ ctx, mode, gates, walkthrough, classified, date }) {
  mkdirSync(reportsDir, { recursive: true });
  const reportPath = join(reportsDir, `run-${date}.md`);

  const gateLines = gates.results
    .map((g) => `- ${g.name}: ${g.ok ? 'PASS' : 'FAIL'} — ${g.detail}`)
    .join('\n');

  const signalLines = (walkthrough?.signals ?? [])
    .map((s) => `- ${s.id}: ${s.ok ? 'PASS' : 'FAIL'} (${s.surface})`)
    .join('\n');

  const walkLines = Object.entries(walkthrough?.steps ?? {})
    .map(([k, v]) => `- ${k}: ${v}`)
    .join('\n');

  const shotLines = (walkthrough?.screenshots ?? [])
    .map((s) => `- screenshots/${s}`)
    .join('\n');

  const blockerLines = classified.blockers.map((b) => `- ${b.id}: ${b.message}`).join('\n') || '- none';
  const majorLines = classified.major.map((m) => `- ${m.id}: ${m.message}`).join('\n') || '- none';
  const minorLines = classified.minor.map((m) => `- ${m.id}: ${m.message}`).join('\n') || '- none';

  const body = `# EPIS2 UX-LAB Autopilot Run

Fecha: ${date}
HEAD: ${ctx.head}
Branch: ${ctx.branch}
Modo bot: ${mode}
Modo clínico: A — Ollama off
Stack: local demo (Playwright webServer)

## Verdict

**BOT VERDICT: ${classified.verdict}**

Este reporte no autoriza rc4.
Requiere signoff humano explícito.

## Preflight

${ctx.warnings?.length ? `Warnings:\n${ctx.warnings.map((w) => `- ${w}`).join('\n')}\n` : ''}
${ctx.blockers?.length ? `Blockers:\n${ctx.blockers.map((b) => `- ${b}`).join('\n')}\n` : 'Preflight: OK'}

## Gates (tier: ${gates.tier})

${gateLines}

## Walkthrough

${walkLines || '- no steps recorded'}

## Safety signals

${signalLines || '- none'}

## Console

- Total errors: ${walkthrough?.consoleErrors?.length ?? 0}
- Critical errors: ${classified.blockers.filter((b) => b.id === 'CONSOLE').length}

## Findings

UX-BLOCKER: ${classified.blockers.length}
UX-MAJOR: ${classified.major.length}
UX-MINOR: ${classified.minor.length}
OBSERVATIONS: ${classified.observations.length}

### UX-BLOCKER

${blockerLines}

### UX-MAJOR

${majorLines}

### UX-MINOR

${minorLines}

## Screenshots

${shotLines || '- none'}

## Recommendation

${classified.verdict === 'GO-CANDIDATE' ? 'GO-CANDIDATE for human review.' : 'NO-GO — fix blockers before human walkthrough.'}
Do not tag rc4 until human signoff.

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
`;

  writeFileSync(reportPath, body, 'utf8');
  return reportPath;
}
