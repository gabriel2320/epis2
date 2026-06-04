-- EPIS2 V1: datos clínicos estructurados longitudinal (demo)

CREATE TABLE IF NOT EXISTS patient_allergies (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id    UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  substance     TEXT NOT NULL,
  severity      TEXT NOT NULL DEFAULT 'moderate' CHECK (severity IN ('mild','moderate','severe','unknown')),
  status        TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  recorded_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by    TEXT NOT NULL REFERENCES app_users(id),
  UNIQUE (patient_id, substance)
);

CREATE TABLE IF NOT EXISTS patient_medications (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id    UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  dose_text     TEXT,
  route         TEXT,
  status        TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','discontinued','hold')),
  started_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by    TEXT NOT NULL REFERENCES app_users(id)
);

CREATE TABLE IF NOT EXISTS clinical_documents (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id    UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  encounter_id  UUID REFERENCES encounters(id) ON DELETE SET NULL,
  title         TEXT NOT NULL,
  document_type TEXT NOT NULL DEFAULT 'other' CHECK (document_type IN ('pdf','txt','image','referral','lab_report','other')),
  mime_type     TEXT,
  storage_ref   TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'indexed' CHECK (status IN ('indexed','archived')),
  indexed_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by    TEXT NOT NULL REFERENCES app_users(id)
);

CREATE INDEX IF NOT EXISTS idx_allergies_patient ON patient_allergies (patient_id);
CREATE INDEX IF NOT EXISTS idx_medications_patient ON patient_medications (patient_id);
CREATE INDEX IF NOT EXISTS idx_documents_patient ON clinical_documents (patient_id);

UPDATE epis2_schema_meta SET version = 'epis2-v1-longitudinal', applied_at = NOW() WHERE id = 1;
