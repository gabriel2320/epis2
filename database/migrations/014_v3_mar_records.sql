-- EPIS2 V3: registro MAR aprobado (demo, sin auto-dispensación)

CREATE TABLE IF NOT EXISTS mar_administration_records (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id    UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  draft_id      UUID REFERENCES clinical_drafts(id) ON DELETE SET NULL,
  medication    TEXT NOT NULL,
  dose_text     TEXT NOT NULL,
  route         TEXT NOT NULL,
  double_check  BOOLEAN NOT NULL DEFAULT FALSE,
  administered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by    TEXT NOT NULL REFERENCES app_users(id)
);

CREATE INDEX IF NOT EXISTS idx_mar_patient ON mar_administration_records (patient_id);

UPDATE epis2_schema_meta SET version = 'epis2-v3-mar', applied_at = NOW() WHERE id = 1;
