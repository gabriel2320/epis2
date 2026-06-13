import type { ClinicalCaseRecord } from '@epis2/contracts';
import { assertTeachingCaseSafe } from '../sanitize.js';
import {
  buildCaseCode,
  buildSummaryFields,
  fictionalDisplayName,
  finalizeRecord,
} from '../normalize.js';
import { inferEvolabHints } from './synthea.js';

/** Caso docente estructurado (rewrite sintético; sin PHI de publicaciones reales). */
export type TeachingCasePayload = {
  resourceType: 'TeachingCase';
  id: string;
  title: string;
  license: string;
  sourceUrl?: string;
  patient: {
    birthDate: string;
    sex: 'F' | 'M';
  };
  presentation: string;
  diagnoses: string[];
  findings?: { label: string; value: string }[];
  medications?: { name: string; dose?: string }[];
  allergies?: { substance: string; severity?: 'low' | 'moderate' | 'high' }[];
};

const DIAGNOSIS_ES: Record<string, string> = {
  asthma: 'Asma bronquial persistente leve (sintético)',
  'type 2 diabetes': 'Diabetes mellitus tipo 2 (sintético)',
  hypertension: 'Hipertensión arterial esencial (sintético)',
  pneumonia: 'Neumonía adquirida en la comunidad (sintético)',
};

function mapDiagnosis(text: string): string {
  const key = text.toLowerCase().trim();
  for (const [needle, translated] of Object.entries(DIAGNOSIS_ES)) {
    if (key.includes(needle)) return translated;
  }
  return `Condición clínica docente (sintético): ${text}`;
}

function slugFromDiagnoses(diagnoses: string[]): string {
  const first = diagnoses[0]?.toLowerCase() ?? 'teaching';
  for (const needle of Object.keys(DIAGNOSIS_ES)) {
    if (first.includes(needle)) return needle.replace(/\s+/g, '-');
  }
  return first.replace(/[^a-z0-9]+/g, '-').slice(0, 20) || 'teaching';
}

export function parseTeachingCase(payload: unknown): TeachingCasePayload {
  const p = payload as TeachingCasePayload;
  if (p.resourceType !== 'TeachingCase' || !p.id || !p.title) {
    throw new Error('Payload no es TeachingCase válido');
  }
  if (!Array.isArray(p.diagnoses) || p.diagnoses.length === 0) {
    throw new Error('TeachingCase sin diagnoses[]');
  }
  if (!p.patient?.birthDate || !p.patient?.sex) {
    throw new Error('TeachingCase sin patient.birthDate/sex');
  }
  return p;
}

export type MedEdBuildOptions = {
  sourceUrl?: string;
  scrapedAt: string;
};

export function buildRecordsFromTeachingCase(
  payload: unknown,
  options: MedEdBuildOptions,
): ClinicalCaseRecord[] {
  const teaching = parseTeachingCase(payload);
  assertTeachingCaseSafe(teaching);
  const problems = teaching.diagnoses.map(mapDiagnosis);
  const primarySlug = slugFromDiagnoses(teaching.diagnoses);
  const observations =
    teaching.findings?.map((f) => ({
      label: f.label,
      valueText: `${f.value} (sintético)`,
    })) ?? [];
  const medications =
    teaching.medications?.map((m) => ({
      name: `${m.name} (demo)`,
      ...(m.dose ? { doseText: m.dose } : {}),
      status: 'active' as const,
    })) ?? [];
  const allergies = teaching.allergies ?? [];

  const scenario = `${teaching.title} (sintético)`;
  const clinical = {
    scenario,
    problems,
    observations,
    ...(medications.length > 0 ? { medications } : {}),
    ...(allergies.length > 0 ? { allergies } : {}),
  };

  return [
    finalizeRecord({
      caseCode: buildCaseCode(primarySlug, teaching.id),
      tier: 'L0_synthetic',
      provenance: {
        sourceType: 'scraped',
        sourceName: 'meded-portal',
        ...(options.sourceUrl ? { sourceUrl: options.sourceUrl } : {}),
        ...(teaching.sourceUrl ? { sourceUrl: teaching.sourceUrl } : {}),
        license: teaching.license,
        scrapedAt: options.scrapedAt,
        externalPatientId: teaching.id,
      },
      patient: {
        displayName: fictionalDisplayName(teaching.patient.sex, teaching.id),
        birthDate: teaching.patient.birthDate,
        sex: teaching.patient.sex,
        isSynthetic: true,
      },
      clinical,
      epis2Mapping: {
        encounterStatus: 'open',
        summaryFields: {
          ...buildSummaryFields(clinical),
          recentEvents: `${teaching.presentation.slice(0, 200)} (sintético)`,
        },
        identifierSystem: 'EPIS2-SIM',
      },
      evolabHints: inferEvolabHints(primarySlug),
    }),
  ];
}
