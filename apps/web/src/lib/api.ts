"use client";

import { getStoredAuthToken, setStoredAuthToken } from "./session";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8100";
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export type Patient = {
  id: string;
  first_name: string;
  last_name: string;
  preferred_name?: string | null;
  birth_date: string;
  sex_at_birth: "female" | "male" | "intersex" | "unknown";
  clinical_status: "draft" | "active" | "closed" | "archived";
  current_care_context: "ambulatory" | "hospitalized" | "unknown";
  clinical_identifier?: string | null;
  contact_phone?: string | null;
  email?: string | null;
  emergency_contact: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type ClinicalEntry = {
  id: string;
  patient_id: string;
  kind: string;
  status: string;
  occurred_at: string;
  title: string;
  subjective?: string | null;
  objective?: string | null;
  assessment?: string | null;
  plan?: string | null;
  tags: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type PatientRecord = {
  patient: Patient;
  latest_vitals?: {
    measured_at: string;
    heart_rate_bpm?: number | null;
    oxygen_saturation_pct?: string | null;
    systolic_bp?: number | null;
    diastolic_bp?: number | null;
  } | null;
  active_allergies: Array<{ id: string; substance: string; severity: string }>;
  active_medications: Array<{ id: string; name: string; dose?: string | null; frequency?: string | null }>;
  active_problems: Array<{ id: string; title: string; notes?: string | null }>;
  recent_entries: ClinicalEntry[];
};

export type AuditEvent = {
  id: string;
  action: string;
  entity_type: string;
  entity_id?: string | null;
  actor_id: string;
  correlation_id?: string | null;
  request_path?: string | null;
  extra_data: Record<string, unknown>;
  created_at: string;
};

export type NewPatient = {
  first_name: string;
  last_name: string;
  preferred_name?: string;
  birth_date: string;
  sex_at_birth: Patient["sex_at_birth"];
  clinical_identifier?: string;
  contact_phone?: string;
  email?: string;
};

export type NewSoapEntry = {
  title: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
};

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function login(email: string, password: string) {
  if (DEMO_MODE) {
    setStoredAuthToken("demo-token");
    return {
      user: { email, name: "Medico Demo", roles: ["medico"], actor_id: email },
      access_token: "demo-token",
    };
  }
  const response = await apiFetch<{ access_token: string; user: unknown }>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setStoredAuthToken(response.access_token);
  return response;
}

export async function listPatients() {
  if (DEMO_MODE) {
    return demoState().patients;
  }
  return apiFetch<Patient[]>("/api/v1/patients?limit=50");
}

export async function createPatient(payload: NewPatient) {
  if (DEMO_MODE) {
    const patient = makeDemoPatient(payload);
    const state = demoState();
    state.patients = [patient, ...state.patients];
    state.audit[patient.id] = [
      makeAudit("patient.created", "patient", patient.id, "medico@epis2.local"),
    ];
    saveDemoState(state);
    return patient;
  }
  return apiFetch<Patient>("/api/v1/patients", {
    method: "POST",
    body: JSON.stringify({
      ...payload,
      preferred_name: payload.preferred_name || null,
      clinical_identifier: payload.clinical_identifier || null,
      contact_phone: payload.contact_phone || null,
      email: payload.email || null,
      current_care_context: "ambulatory",
      clinical_status: "active",
      emergency_contact: {},
    }),
  });
}

export async function getPatientRecord(patientId: string) {
  if (DEMO_MODE) {
    return makeDemoRecord(patientId);
  }
  return apiFetch<PatientRecord>(`/api/v1/patients/${patientId}/record`);
}

export async function createSoapEntry(patientId: string, payload: NewSoapEntry) {
  const entryPayload = {
    kind: "progress",
    status: "draft",
    occurred_at: new Date().toISOString(),
    title: payload.title,
    subjective: payload.subjective,
    objective: payload.objective,
    assessment: payload.assessment,
    plan: payload.plan,
    tags: ["soap", "cockpit"],
    extra_data: { source: "clinical-cockpit" },
  };
  if (DEMO_MODE) {
    const state = demoState();
    const entry: ClinicalEntry = {
      ...entryPayload,
      id: crypto.randomUUID(),
      patient_id: patientId,
      created_by: "medico@epis2.local",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    state.entries[patientId] = [entry, ...(state.entries[patientId] ?? [])];
    state.audit[patientId] = [
      makeAudit("clinical_entry.created", "clinical_entry", entry.id, "medico@epis2.local"),
      ...(state.audit[patientId] ?? []),
    ];
    saveDemoState(state);
    return entry;
  }
  return apiFetch<ClinicalEntry>(`/api/v1/patients/${patientId}/clinical-entries`, {
    method: "POST",
    body: JSON.stringify(entryPayload),
  });
}

export async function listAuditEvents(patientId: string) {
  if (DEMO_MODE) {
    return demoState().audit[patientId] ?? [];
  }
  return apiFetch<AuditEvent[]>(`/api/v1/patients/${patientId}/audit-events`);
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const token = getStoredAuthToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  if (!response.ok) {
    throw new ApiError(await readError(response), response.status);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}

async function readError(response: Response) {
  try {
    const data = (await response.json()) as { detail?: unknown };
    if (typeof data.detail === "string") {
      return data.detail;
    }
  } catch {
    return `${response.status} ${response.statusText}`;
  }
  return `${response.status} ${response.statusText}`;
}

type DemoStore = {
  patients: Patient[];
  entries: Record<string, ClinicalEntry[]>;
  audit: Record<string, AuditEvent[]>;
};

function demoState(): DemoStore {
  if (typeof window === "undefined") {
    return seedDemoState();
  }
  const raw = window.localStorage.getItem("epis2.demo.store");
  if (!raw) {
    const seeded = seedDemoState();
    saveDemoState(seeded);
    return seeded;
  }
  return JSON.parse(raw) as DemoStore;
}

function saveDemoState(state: DemoStore) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("epis2.demo.store", JSON.stringify(state));
  }
}

function seedDemoState(): DemoStore {
  const patient = makeDemoPatient({
    first_name: "Isidora",
    last_name: "Rojas",
    preferred_name: "Isi",
    birth_date: "1988-04-13",
    sex_at_birth: "female",
    clinical_identifier: "DEMO-001",
  });
  const entry: ClinicalEntry = {
    id: "demo-entry-1",
    patient_id: patient.id,
    kind: "progress",
    status: "draft",
    occurred_at: new Date().toISOString(),
    title: "Evolucion SOAP inicial",
    subjective: "Refiere mejoria parcial y dolor controlado.",
    objective: "Hemodinamicamente estable. Sin signos de alarma.",
    assessment: "Evolucion favorable con plan de control cercano.",
    plan: "Mantener indicaciones, reevaluar dolor y educar signos de alarma.",
    tags: ["demo", "soap"],
    created_by: "medico@epis2.local",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  return {
    patients: [patient],
    entries: { [patient.id]: [entry] },
    audit: {
      [patient.id]: [
        makeAudit("clinical_entry.created", "clinical_entry", entry.id, "medico@epis2.local"),
        makeAudit("patient.created", "patient", patient.id, "medico@epis2.local"),
      ],
    },
  };
}

function makeDemoPatient(payload: NewPatient): Patient {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    first_name: payload.first_name,
    last_name: payload.last_name,
    preferred_name: payload.preferred_name || null,
    birth_date: payload.birth_date,
    sex_at_birth: payload.sex_at_birth,
    clinical_status: "active",
    current_care_context: "ambulatory",
    clinical_identifier: payload.clinical_identifier || `DEMO-${Math.floor(Math.random() * 9000) + 1000}`,
    contact_phone: payload.contact_phone || null,
    email: payload.email || null,
    emergency_contact: {},
    created_at: now,
    updated_at: now,
  };
}

function makeDemoRecord(patientId: string): PatientRecord {
  const state = demoState();
  const patient = state.patients.find((item) => item.id === patientId) ?? state.patients[0];
  return {
    patient,
    latest_vitals: {
      measured_at: new Date().toISOString(),
      heart_rate_bpm: 78,
      oxygen_saturation_pct: "97",
      systolic_bp: 118,
      diastolic_bp: 72,
    },
    active_allergies: [{ id: "a1", substance: "Penicilina", severity: "moderate" }],
    active_medications: [{ id: "m1", name: "Paracetamol", dose: "1 g", frequency: "cada 8 h" }],
    active_problems: [{ id: "p1", title: "Dolor agudo controlado", notes: "Seguimiento clinico" }],
    recent_entries: state.entries[patient.id] ?? [],
  };
}

function makeAudit(action: string, entityType: string, entityId: string, actorId: string): AuditEvent {
  return {
    id: crypto.randomUUID(),
    action,
    entity_type: entityType,
    entity_id: entityId,
    actor_id: actorId,
    correlation_id: `epis2-demo-${Math.floor(Math.random() * 100000)}`,
    request_path: "/demo",
    extra_data: {},
    created_at: new Date().toISOString(),
  };
}
