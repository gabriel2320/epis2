-- EPIS2-04: núcleo clínico PostgreSQL (fuente de verdad)

CREATE TABLE IF NOT EXISTS app_users (
  id            TEXT PRIMARY KEY,
  username      TEXT NOT NULL UNIQUE,
  display_name  TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('physician','nurse','pharmacist','admin','auditor')),
  is_synthetic  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS patients (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  is_synthetic  BOOLEAN NOT NULL DEFAULT TRUE,
  display_name  TEXT NOT NULL,
  birth_date    DATE,
  sex           TEXT CHECK (sex IN ('F','M','O','U')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by    TEXT NOT NULL REFERENCES app_users(id)
);

CREATE TABLE IF NOT EXISTS patient_identifiers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id    UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  system        TEXT NOT NULL,
  value         TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by    TEXT NOT NULL REFERENCES app_users(id),
  UNIQUE (system, value)
);

CREATE TABLE IF NOT EXISTS encounters (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id    UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  status        TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','closed')),
  started_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at      TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by    TEXT NOT NULL REFERENCES app_users(id)
);

CREATE TABLE IF NOT EXISTS problems (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id    UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  encounter_id  UUID REFERENCES encounters(id) ON DELETE SET NULL,
  description   TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'active',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by    TEXT NOT NULL REFERENCES app_users(id)
);

CREATE TABLE IF NOT EXISTS observations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id    UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  encounter_id  UUID REFERENCES encounters(id) ON DELETE SET NULL,
  code          TEXT,
  label         TEXT NOT NULL,
  value_text    TEXT NOT NULL,
  observed_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by    TEXT NOT NULL REFERENCES app_users(id)
);

-- Borradores (≠ notas finales)
CREATE TABLE IF NOT EXISTS clinical_drafts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id    UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  encounter_id  UUID REFERENCES encounters(id) ON DELETE SET NULL,
  draft_type    TEXT NOT NULL CHECK (draft_type IN ('evolution_note','discharge_summary','prescription','lab_request','other')),
  status        TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','editing','ready_for_review','approved','rejected','cancelled')),
  title         TEXT NOT NULL,
  body          JSONB NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by    TEXT NOT NULL REFERENCES app_users(id),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by    TEXT NOT NULL REFERENCES app_users(id)
);

CREATE TABLE IF NOT EXISTS draft_versions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id      UUID NOT NULL REFERENCES clinical_drafts(id) ON DELETE CASCADE,
  version_no    INT NOT NULL,
  status        TEXT NOT NULL,
  title         TEXT NOT NULL,
  body          JSONB NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by    TEXT NOT NULL REFERENCES app_users(id),
  UNIQUE (draft_id, version_no)
);

-- Notas clínicas aprobadas (SoT visible post-aprobación)
CREATE TABLE IF NOT EXISTS clinical_notes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id    UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  encounter_id  UUID REFERENCES encounters(id) ON DELETE SET NULL,
  note_type     TEXT NOT NULL,
  title         TEXT NOT NULL,
  body          JSONB NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by    TEXT NOT NULL REFERENCES app_users(id),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by    TEXT NOT NULL REFERENCES app_users(id)
);

CREATE TABLE IF NOT EXISTS clinical_note_versions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id       UUID NOT NULL REFERENCES clinical_notes(id) ON DELETE CASCADE,
  version_no    INT NOT NULL,
  title         TEXT NOT NULL,
  body          JSONB NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by    TEXT NOT NULL REFERENCES app_users(id),
  UNIQUE (note_id, version_no)
);

CREATE TABLE IF NOT EXISTS approvals (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id      UUID NOT NULL UNIQUE REFERENCES clinical_drafts(id),
  note_id       UUID NOT NULL REFERENCES clinical_notes(id),
  approved_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_by   TEXT NOT NULL REFERENCES app_users(id)
);

CREATE TABLE IF NOT EXISTS audit_events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type    TEXT NOT NULL,
  at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actor_id      TEXT REFERENCES app_users(id),
  username      TEXT,
  entity_type   TEXT,
  entity_id     TEXT,
  message       TEXT,
  payload       JSONB
);

CREATE INDEX IF NOT EXISTS idx_patients_synthetic ON patients (is_synthetic);
CREATE INDEX IF NOT EXISTS idx_drafts_patient ON clinical_drafts (patient_id);
CREATE INDEX IF NOT EXISTS idx_notes_patient ON clinical_notes (patient_id);
CREATE INDEX IF NOT EXISTS idx_audit_at ON audit_events (at DESC);

UPDATE epis2_schema_meta SET version = 'epis2-04-core', applied_at = NOW() WHERE id = 1;
