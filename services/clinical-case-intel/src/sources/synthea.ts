import type { ClinicalCaseRecord } from '@epis2/contracts';
import {
  buildCaseCode,
  buildSummaryFields,
  fictionalDisplayName,
  finalizeRecord,
} from '../normalize.js';

/** Traducciones demo de condiciones frecuentes en bundles Synthea (inglés → es-CL). */
const CONDITION_ES: Record<string, string> = {
  hypertension: 'Hipertensión arterial esencial (sintético)',
  'essential hypertension': 'Hipertensión arterial esencial (sintético)',
  diabetes: 'Diabetes mellitus tipo 2 (sintético)',
  'type 2 diabetes': 'Diabetes mellitus tipo 2 (sintético)',
  asthma: 'Asma bronquial persistente leve (sintético)',
  pneumonia: 'Neumonía adquirida en la comunidad (sintético)',
  'atrial fibrillation': 'Fibrilación auricular (sintético)',
  obesity: 'Obesidad (sintético)',
  hyperlipidemia: 'Dislipidemia mixta (sintético)',
  'chronic obstructive pulmonary disease': 'EPOC moderada (sintético)',
  copd: 'EPOC moderada (sintético)',
  'heart failure': 'Insuficiencia cardíaca congestiva (sintético)',
  'community acquired pneumonia': 'Neumonía adquirida en la comunidad (sintético)',
  depression: 'Trastorno depresivo mayor (sintético)',
  'major depressive disorder': 'Trastorno depresivo mayor (sintético)',
  'chronic kidney disease': 'Enfermedad renal crónica estadio 3 (sintético)',
  'chronic kidney disease stage 3': 'Enfermedad renal crónica estadio 3 (sintético)',
  ckd: 'Enfermedad renal crónica estadio 3 (sintético)',
};

const CAPABILITY_BY_PROBLEM: Record<string, string[]> = {
  hypertension: ['evolution_note', 'prescription', 'lab_request'],
  diabetes: ['evolution_note', 'prescription', 'lab_request', 'pharmacy_validation'],
  asthma: ['evolution_note', 'prescription', 'nursing_note'],
  pneumonia: ['evolution_note', 'discharge_summary', 'lab_request'],
  'atrial fibrillation': ['evolution_note', 'prescription', 'medication_reconciliation'],
  copd: ['evolution_note', 'prescription', 'nursing_note'],
  'heart failure': ['evolution_note', 'discharge_summary', 'lab_request'],
  hyperlipidemia: ['evolution_note', 'prescription', 'lab_request'],
  obesity: ['evolution_note', 'lab_request'],
  depression: ['evolution_note', 'prescription'],
  'major depressive disorder': ['evolution_note', 'prescription'],
  'chronic kidney disease': ['evolution_note', 'lab_request', 'prescription'],
  'chronic kidney disease stage 3': ['evolution_note', 'lab_request', 'prescription'],
  ckd: ['evolution_note', 'lab_request', 'prescription'],
};

type FhirResource = {
  resourceType?: string;
  id?: string;
  gender?: string;
  birthDate?: string;
  code?: {
    text?: string;
    coding?: { display?: string; code?: string }[];
  };
  valueQuantity?: { value?: number; unit?: string };
  valueString?: string;
  medicationCodeableConcept?: { text?: string; coding?: { display?: string }[] };
  dosage?: { text?: string }[];
  substance?: { text?: string; coding?: { display?: string }[] };
  reaction?: { manifestation?: { text?: string }[] }[];
  subject?: { reference?: string };
};

export type SyntheaParsedPatient = {
  externalPatientId: string;
  birthDate: string;
  sex: 'F' | 'M';
  problems: string[];
  observations: { label: string; valueText: string }[];
  medications: { name: string; doseText?: string; route?: string; status: 'active' | 'stopped' }[];
  allergies: { substance: string; severity?: 'low' | 'moderate' | 'high' }[];
  primaryProblemSlug: string;
};

function readText(code?: FhirResource['code']): string {
  if (!code) return '';
  if (code.text?.trim()) return code.text.trim();
  const coding = code.coding?.find((c) => c.display?.trim());
  return coding?.display?.trim() ?? '';
}

function mapConditionToSpanish(text: string): string {
  const key = text.toLowerCase().trim();
  for (const [needle, translated] of Object.entries(CONDITION_ES)) {
    if (key.includes(needle)) return translated;
  }
  return `Condición clínica (sintético): ${text}`;
}

function slugFromProblem(text: string): string {
  const key = text.toLowerCase();
  for (const needle of Object.keys(CONDITION_ES)) {
    if (key.includes(needle)) return needle.replace(/\s+/g, '-');
  }
  return key.replace(/[^a-z0-9]+/g, '-').slice(0, 20) || 'general';
}

function mapGender(gender?: string): 'F' | 'M' {
  if (gender === 'female') return 'F';
  if (gender === 'male') return 'M';
  return 'M';
}

function patientRefId(reference?: string): string | undefined {
  if (!reference) return undefined;
  const match = reference.match(/Patient\/(.+)$/);
  return match?.[1];
}

export function parseFhirBundle(bundle: unknown): SyntheaParsedPatient[] {
  const b = bundle as {
    resourceType?: string;
    entry?: { resource?: FhirResource }[];
  };
  if (b.resourceType !== 'Bundle' || !Array.isArray(b.entry)) {
    throw new Error('Entrada no es un FHIR Bundle con entry[]');
  }

  const patients = new Map<string, SyntheaParsedPatient>();

  for (const entry of b.entry) {
    const resource = entry.resource;
    if (!resource?.resourceType) continue;

    if (resource.resourceType === 'Patient' && resource.id) {
      patients.set(resource.id, {
        externalPatientId: resource.id,
        birthDate: resource.birthDate ?? '1980-01-01',
        sex: mapGender(resource.gender),
        problems: [],
        observations: [],
        medications: [],
        allergies: [],
        primaryProblemSlug: 'general',
      });
    }
  }

  if (patients.size === 0) {
    throw new Error('Bundle sin recurso Patient');
  }

  for (const entry of b.entry) {
    const resource = entry.resource;
    if (!resource?.resourceType) continue;
    const subjectId = patientRefId(resource.subject?.reference);
    if (!subjectId || !patients.has(subjectId)) continue;
    const patient = patients.get(subjectId)!;

    if (resource.resourceType === 'Condition') {
      const text = readText(resource.code);
      if (text) patient.problems.push(mapConditionToSpanish(text));
    }

    if (resource.resourceType === 'Observation') {
      const label = readText(resource.code) || 'Observación';
      let valueText = resource.valueString?.trim() ?? '';
      if (!valueText && resource.valueQuantity?.value !== undefined) {
        valueText = `${resource.valueQuantity.value} ${resource.valueQuantity.unit ?? ''}`.trim();
      }
      if (valueText) {
        patient.observations.push({ label, valueText: `${valueText} (sintético)` });
      }
    }

    if (resource.resourceType === 'MedicationStatement') {
      const name =
        resource.medicationCodeableConcept?.text?.trim() ??
        resource.medicationCodeableConcept?.coding?.[0]?.display?.trim();
      if (name) {
        patient.medications.push({
          name: `${name} (demo)`,
          ...(resource.dosage?.[0]?.text ? { doseText: resource.dosage[0].text } : {}),
          status: 'active',
        });
      }
    }

    if (resource.resourceType === 'AllergyIntolerance') {
      const substance =
        resource.substance?.text?.trim() ?? resource.substance?.coding?.[0]?.display?.trim();
      if (substance) {
        patient.allergies.push({ substance, severity: 'moderate' });
      }
    }
  }

  const results: SyntheaParsedPatient[] = [];
  for (const patient of patients.values()) {
    if (patient.problems.length === 0) {
      patient.problems.push('Consulta clínica general (sintético)');
    }
    const primary = patient.problems[0] ?? 'general';
    patient.primaryProblemSlug = slugFromProblem(primary);
    results.push(patient);
  }

  return results;
}

export function inferEvolabHints(primaryProblemSlug: string): ClinicalCaseRecord['evolabHints'] {
  const key = primaryProblemSlug.replace(/-/g, ' ');
  const capabilities = Object.entries(CAPABILITY_BY_PROBLEM).find(([needle]) =>
    key.includes(needle),
  )?.[1] ?? ['evolution_note', 'lab_request'];
  return {
    capabilities,
    suggestedGoals: ['create_evolution_note', 'review_clinical_context'],
    risk: primaryProblemSlug.includes('pneumonia') ? 'medium' : 'low',
  };
}

export type SyntheaBuildOptions = {
  sourceUrl?: string;
  scrapedAt: string;
  license?: string;
};

export function buildRecordsFromBundle(
  bundle: unknown,
  options: SyntheaBuildOptions,
): ClinicalCaseRecord[] {
  const parsed = parseFhirBundle(bundle);
  return parsed.map((patient) => {
    const scenario = patient.problems[0] ?? 'Consulta clínica general (sintético)';
    const clinical = {
      scenario,
      problems: patient.problems,
      observations: patient.observations,
      ...(patient.medications.length > 0 ? { medications: patient.medications } : {}),
      ...(patient.allergies.length > 0 ? { allergies: patient.allergies } : {}),
    };
    const epis2Mapping = {
      encounterStatus: 'open' as const,
      summaryFields: buildSummaryFields(clinical),
      identifierSystem: 'EPIS2-SIM' as const,
    };
    return finalizeRecord({
      caseCode: buildCaseCode(patient.primaryProblemSlug, patient.externalPatientId),
      tier: 'L0_synthetic',
      provenance: {
        sourceType: 'scraped',
        sourceName: 'synthea',
        ...(options.sourceUrl ? { sourceUrl: options.sourceUrl } : {}),
        license: options.license ?? 'CC0-1.0 (Synthea synthetic data)',
        scrapedAt: options.scrapedAt,
        externalPatientId: patient.externalPatientId,
      },
      patient: {
        displayName: fictionalDisplayName(patient.sex, patient.externalPatientId),
        birthDate: patient.birthDate,
        sex: patient.sex,
        isSynthetic: true,
      },
      clinical,
      epis2Mapping,
      evolabHints: inferEvolabHints(patient.primaryProblemSlug),
    });
  });
}
