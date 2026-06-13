import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { ClinicalCaseRecord } from '@epis2/contracts';
import type { DemoClinicalCase } from '@epis2/test-fixtures';
import { stableSimCaseUuids } from '@epis2/test-fixtures';

const CREATED_BY = 'usr-physician-01';

export type ExportFixturesBundle = {
  exportedAt: string;
  cases: DemoClinicalCase[];
  records: ClinicalCaseRecord[];
};

function sqlEscape(value: string): string {
  return value.replace(/'/g, "''");
}

export function recordToSimClinicalCase(record: ClinicalCaseRecord): DemoClinicalCase {
  const { patientId, encounterId } = stableSimCaseUuids(record.caseCode);
  return {
    patientId,
    demoCaseCode: record.caseCode,
    displayName: record.patient.displayName,
    birthDate: record.patient.birthDate,
    sex: record.patient.sex,
    scenario: record.clinical.scenario,
    encounterId,
    summaryFields: record.epis2Mapping.summaryFields,
  };
}

export function buildExportBundle(records: ClinicalCaseRecord[]): ExportFixturesBundle {
  const cases = records.map(recordToSimClinicalCase);
  return {
    exportedAt: new Date().toISOString(),
    cases,
    records: records.map((record) => {
      const ids = stableSimCaseUuids(record.caseCode);
      return {
        ...record,
        epis2Mapping: {
          ...record.epis2Mapping,
          patientId: ids.patientId,
          encounterId: ids.encounterId,
        },
      };
    }),
  };
}

function renderSummaryFields(fields: Record<string, string>): string {
  const lines = Object.entries(fields).map(
    ([key, value]) => `      ${key}: ${JSON.stringify(value)},`,
  );
  return `{\n${lines.join('\n')}\n    }`;
}

export function renderSimCasesTs(cases: DemoClinicalCase[]): string {
  const caseBlocks = cases
    .map((c) => {
      const summary = renderSummaryFields(c.summaryFields);
      return `  {
    patientId: '${c.patientId}',
    demoCaseCode: '${c.demoCaseCode}',
    displayName: ${JSON.stringify(c.displayName)},
    birthDate: '${c.birthDate}',
    sex: '${c.sex}',
    scenario: ${JSON.stringify(c.scenario)},
    encounterId: '${c.encounterId}',
    summaryFields: ${summary},
  }`;
    })
    .join(',\n');

  return `/**
 * Casos SIM promovidos desde clinical-case-intel (MF-CASE-04/06).
 * IDs estables vía \`stableSimCaseUuids\` — alineados con \`042_sim_clinical_cases_seed.sql\`.
 * Regenerar: \`npm run case-intel:export-fixtures -- --apply\`
 */

import type { DemoClinicalCase } from './demoCases.js';
import { stableSimCaseUuids } from './simCaseIds.js';

export const SIM_CLINICAL_CASES: DemoClinicalCase[] = [
${caseBlocks}
];

const FORBIDDEN_REAL_ID = /\\b\\d{7,8}[-\\s]?\\d{1,2}\\b/;

export function getSimCaseByCode(code: string): DemoClinicalCase | undefined {
  return SIM_CLINICAL_CASES.find((c) => c.demoCaseCode === code);
}

export function getSimCaseByPatientId(patientId: string): DemoClinicalCase | undefined {
  return SIM_CLINICAL_CASES.find((c) => c.patientId === patientId);
}

export function assertSimCasesInvariants(): string[] {
  const errors: string[] = [];
  const codes = new Set<string>();
  const ids = new Set<string>();
  for (const c of SIM_CLINICAL_CASES) {
    if (!c.demoCaseCode.startsWith('SIM-')) {
      errors.push(\`Código SIM inválido: \${c.demoCaseCode}\`);
    }
    const expected = stableSimCaseUuids(c.demoCaseCode);
    if (c.patientId !== expected.patientId) {
      errors.push(\`patientId no alineado con stableSimCaseUuids: \${c.demoCaseCode}\`);
    }
    if (c.encounterId !== expected.encounterId) {
      errors.push(\`encounterId no alineado con stableSimCaseUuids: \${c.demoCaseCode}\`);
    }
    if (codes.has(c.demoCaseCode)) errors.push(\`Código duplicado: \${c.demoCaseCode}\`);
    if (ids.has(c.patientId)) errors.push(\`UUID duplicado: \${c.patientId}\`);
    codes.add(c.demoCaseCode);
    ids.add(c.patientId);
    if (FORBIDDEN_REAL_ID.test(c.displayName)) {
      errors.push(\`Posible identificador real en nombre: \${c.displayName}\`);
    }
    if (!c.displayName.includes('Sim') && !c.displayName.includes('Demo')) {
      errors.push(\`Nombre sin marca ficticia: \${c.displayName}\`);
    }
  }
  return errors;
}
`;
}

export function renderSimSeedSql(records: ClinicalCaseRecord[]): string {
  const patientRows: string[] = [];
  const identifierRows: string[] = [];
  const encounterRows: string[] = [];
  const problemRows: string[] = [];
  const observationRows: string[] = [];
  const medicationRows: string[] = [];
  const allergyRows: string[] = [];

  for (const record of records) {
    const { patientId, encounterId } = stableSimCaseUuids(record.caseCode);
    patientRows.push(
      `  ('${patientId}', TRUE, '${sqlEscape(record.patient.displayName)}', '${record.patient.birthDate}', '${record.patient.sex}', '${CREATED_BY}')`,
    );
    identifierRows.push(
      `  ('${patientId}', '${sqlEscape(record.epis2Mapping.identifierSystem)}', '${sqlEscape(record.caseCode)}', '${CREATED_BY}')`,
    );
    encounterRows.push(
      `  ('${encounterId}', '${patientId}', '${record.epis2Mapping.encounterStatus}', '${CREATED_BY}')`,
    );
    for (const problem of record.clinical.problems) {
      problemRows.push(
        `  ('${patientId}', '${encounterId}', '${sqlEscape(problem)}', '${CREATED_BY}')`,
      );
    }
    for (const obs of record.clinical.observations) {
      observationRows.push(
        `  ('${patientId}', '${encounterId}', '${sqlEscape(obs.label)}', '${sqlEscape(obs.valueText)}', '${CREATED_BY}')`,
      );
    }
    if (record.clinical.medications) {
      for (const med of record.clinical.medications) {
        const dose = med.doseText ? `'${sqlEscape(med.doseText)}'` : 'NULL';
        const route = med.route ? `'${sqlEscape(med.route)}'` : 'NULL';
        medicationRows.push(
          `  ('${patientId}', '${sqlEscape(med.name)}', ${dose}, ${route}, '${med.status}', '${CREATED_BY}')`,
        );
      }
    }
    if (record.clinical.allergies) {
      for (const allergy of record.clinical.allergies) {
        allergyRows.push(
          `  ('${patientId}', '${sqlEscape(allergy.substance)}', '${allergy.severity ?? 'moderate'}', '${CREATED_BY}')`,
        );
      }
    }
  }

  const sections: string[] = [
    '-- MF-CASE-04/06: casos SIM desde clinical-case-intel (sin PHI real)',
    '-- Regenerar: npm run case-intel:export-fixtures -- --apply',
    '',
    'INSERT INTO patients (id, is_synthetic, display_name, birth_date, sex, created_by)',
    'VALUES',
    patientRows.join(',\n'),
    'ON CONFLICT (id) DO NOTHING;',
    '',
    'INSERT INTO patient_identifiers (patient_id, system, value, created_by)',
    'VALUES',
    identifierRows.join(',\n'),
    'ON CONFLICT (system, value) DO NOTHING;',
    '',
    'INSERT INTO encounters (id, patient_id, status, created_by)',
    'VALUES',
    encounterRows.join(',\n'),
    'ON CONFLICT (id) DO NOTHING;',
  ];

  if (problemRows.length > 0) {
    sections.push(
      '',
      'INSERT INTO problems (patient_id, encounter_id, description, created_by)',
      'VALUES',
      problemRows.join(',\n'),
      ';',
    );
  }

  if (observationRows.length > 0) {
    sections.push(
      '',
      'INSERT INTO observations (patient_id, encounter_id, label, value_text, created_by)',
      'VALUES',
      observationRows.join(',\n'),
      ';',
    );
  }

  if (medicationRows.length > 0) {
    sections.push(
      '',
      'INSERT INTO patient_medications (patient_id, name, dose_text, route, status, created_by)',
      'VALUES',
      medicationRows.join(',\n'),
      ';',
    );
  }

  if (allergyRows.length > 0) {
    sections.push(
      '',
      'INSERT INTO patient_allergies (patient_id, substance, severity, created_by)',
      'VALUES',
      allergyRows.join(',\n'),
      'ON CONFLICT (patient_id, substance) DO NOTHING;',
    );
  }

  sections.push(
    '',
    "UPDATE epis2_schema_meta SET version = 'epis2-mf-case-04-sim-seed', applied_at = NOW() WHERE id = 1;",
    '',
  );

  return sections.join('\n');
}

export async function writeExportArtifacts(
  repoRoot: string,
  bundle: ExportFixturesBundle,
  apply: boolean,
): Promise<{ previewPath: string; simCasesPath?: string; migrationPath?: string }> {
  const dataDir = join(repoRoot, 'data', 'clinical-cases');
  await mkdir(dataDir, { recursive: true });
  const previewPath = join(dataDir, 'export-fixtures-preview.json');
  await writeFile(previewPath, JSON.stringify(bundle, null, 2), 'utf8');

  if (!apply) {
    return { previewPath };
  }

  const simCasesPath = join(repoRoot, 'packages', 'test-fixtures', 'src', 'simCases.ts');
  const migrationPath = join(
    repoRoot,
    'database',
    'migrations',
    '042_sim_clinical_cases_seed.sql',
  );
  await writeFile(simCasesPath, renderSimCasesTs(bundle.cases), 'utf8');
  await writeFile(migrationPath, renderSimSeedSql(bundle.records), 'utf8');
  return { previewPath, simCasesPath, migrationPath };
}
