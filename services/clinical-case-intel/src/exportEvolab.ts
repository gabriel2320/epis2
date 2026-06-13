import { existsSync } from 'node:fs';
import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import type { ClinicalCaseRecord } from '@epis2/contracts';

export type EvolabScenarioExport = {
  id: string;
  caseCode: string;
  yaml: string;
  filename: string;
};

export type EvolabExportBundle = {
  exportedAt: string;
  evolabRoot: string;
  scenarios: EvolabScenarioExport[];
};

export function resolveEvolabRoot(repoRoot: string): string {
  if (process.env.EPIS2_EVOLAB_ROOT?.trim()) {
    return resolve(process.env.EPIS2_EVOLAB_ROOT.trim());
  }
  return resolve(repoRoot, '..', 'epis2-evolab');
}

export function isEvolabPresent(evolabRoot: string): boolean {
  return existsSync(join(evolabRoot, 'package.json'));
}

export function evolabScenarioId(caseCode: string): string {
  const slug = caseCode
    .toLowerCase()
    .replace(/^sim-/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 36);
  return `sim-${slug}-evolution-001`;
}

function yamlQuote(value: string): string {
  if (/[:#\n"'{}[\],&*!|>`@]/.test(value) || value.startsWith(' ')) {
    return JSON.stringify(value);
  }
  return value;
}

function clip(text: string, max = 120): string {
  const trimmed = text.replace(/\s+/g, ' ').trim();
  return trimmed.length <= max ? trimmed : `${trimmed.slice(0, max - 3)}...`;
}

export function buildEvolabScenario(record: ClinicalCaseRecord): EvolabScenarioExport {
  const id = evolabScenarioId(record.caseCode);
  const risk = record.evolabHints?.risk ?? 'low';
  const capabilities = record.evolabHints?.capabilities ?? ['evolution_note'];
  const problem = record.clinical.problems[0] ?? 'Consulta clínica (sintético)';
  const observation = record.clinical.observations[0];
  const objective = observation
    ? `${observation.label}: ${observation.valueText}`
    : 'Sin hallazgos agudos (sintético)';

  const yaml = [
    `id: ${id}`,
    'version: 1',
    `name: SIM — ${yamlQuote(clip(record.clinical.scenario, 80))}`,
    'description: Escenario generado por clinical-case-intel (MF-CASE-05)',
    `risk: ${risk}`,
    '',
    'target:',
    '  capabilities:',
    ...capabilities.map((cap) => `    - ${cap}`),
    '',
    'persona:',
    '  role: physician',
    '  experience: routine',
    '',
    'fixture:',
    '  type: synthetic-sim-case',
    `  demoCaseCode: ${record.caseCode}`,
    '',
    'goal:',
    '  action: create_evolution_note',
    '',
    'steps:',
    '  - login_physician',
    '  - create_evolution_draft',
    '  - read_evolution_draft',
    '',
    'flow:',
    '  - login:',
    '      label: login_physician',
    '  - api:',
    '      label: evolution_draft_create',
    '      evidenceLabel: sim-evolution-draft-create',
    '      method: POST',
    '      path: /api/drafts',
    '      body:',
    `        patientId: '{patientId}'`,
    `        encounterId: '{encounterId}'`,
    '        draftType: evolution_note',
    `        title: ${yamlQuote(`Evolución — ${record.caseCode} (sintético)`)}`,
    '        body:',
    `          subjective: ${yamlQuote(clip(record.clinical.scenario))}`,
    `          objective: ${yamlQuote(clip(objective))}`,
    `          assessment: ${yamlQuote(clip(problem))}`,
    `          plan: ${yamlQuote(clip(record.epis2Mapping.summaryFields.pendingItems ?? 'Seguimiento ambulatorio (sintético)'))}`,
    '      capture:',
    '        draftId: draft.id',
    '      failOnMissingCapture: No se pudo crear borrador de evolución (HTTP {status})',
    '  - api:',
    '      label: evolution_draft_read',
    '      evidenceLabel: sim-evolution-draft-read',
    '      method: GET',
    "      path: '/api/drafts/{draftId}'",
    '      observe:',
    '        payload: [status, ok, draftId]',
    '',
    'expected:',
    '  draftCreated: true',
    '',
    'evaluators:',
    '  - functional',
    '',
    'actionObservation: evolution_draft_create',
    'timeoutMs: 90000',
    'maxAttempts: 2',
    'tags:',
    '  - sim-case',
    '  - clinical-case-intel',
    '  - smoke',
    '',
  ].join('\n');

  return {
    id,
    caseCode: record.caseCode,
    yaml,
    filename: `${id}.yaml`,
  };
}

export function buildEvolabExportBundle(
  records: ClinicalCaseRecord[],
  evolabRoot: string,
): EvolabExportBundle {
  return {
    exportedAt: new Date().toISOString(),
    evolabRoot,
    scenarios: records.map(buildEvolabScenario),
  };
}

export async function writeEvolabArtifacts(
  repoRoot: string,
  bundle: EvolabExportBundle,
  apply: boolean,
): Promise<{ previewPath: string; scenariosWritten?: string[]; fixturesSynced?: boolean }> {
  const dataDir = join(repoRoot, 'data', 'clinical-cases');
  await mkdir(dataDir, { recursive: true });
  const previewPath = join(dataDir, 'evolab-export-preview.json');
  await writeFile(previewPath, JSON.stringify(bundle, null, 2), 'utf8');

  if (!apply) {
    return { previewPath };
  }

  if (!isEvolabPresent(bundle.evolabRoot)) {
    throw new Error(
      `Evolab no encontrado en ${bundle.evolabRoot} — clone epis2-evolab o define EPIS2_EVOLAB_ROOT`,
    );
  }

  const scenariosDir = join(bundle.evolabRoot, 'apps', 'evolution-lab', 'scenarios');
  await mkdir(scenariosDir, { recursive: true });
  const scenariosWritten: string[] = [];
  for (const scenario of bundle.scenarios) {
    const path = join(scenariosDir, scenario.filename);
    await writeFile(path, scenario.yaml, 'utf8');
    scenariosWritten.push(path);
  }

  const epis2Fixtures = join(repoRoot, 'packages', 'test-fixtures', 'src');
  const evolabFixtures = join(bundle.evolabRoot, 'packages', 'demo-fixtures', 'src');
  await mkdir(evolabFixtures, { recursive: true });
  await copyFile(join(epis2Fixtures, 'simCaseIds.ts'), join(evolabFixtures, 'simCaseIds.ts'));
  await copyFile(join(epis2Fixtures, 'simCases.ts'), join(evolabFixtures, 'simCases.ts'));

  const manifestPath = join(repoRoot, 'reports', 'clinical-case-evolab-sync.json');
  await mkdir(dirname(manifestPath), { recursive: true });
  await writeFile(
    manifestPath,
    JSON.stringify(
      {
        syncedAt: bundle.exportedAt,
        evolabRoot: bundle.evolabRoot,
        scenarioIds: bundle.scenarios.map((s) => s.id),
        fixtures: ['simCaseIds.ts', 'simCases.ts'],
      },
      null,
      2,
    ),
    'utf8',
  );

  return { previewPath, scenariosWritten, fixturesSynced: true };
}
