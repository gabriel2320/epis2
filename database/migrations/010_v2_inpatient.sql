-- EPIS2 V2: hospitalización operativa demo (censo, camas, críticos)

CREATE TABLE IF NOT EXISTS clinical_units (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code          TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS beds (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id       UUID NOT NULL REFERENCES clinical_units(id) ON DELETE CASCADE,
  bed_label     TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available','occupied','blocked')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (unit_id, bed_label)
);

CREATE TABLE IF NOT EXISTS inpatient_admissions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id    UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  encounter_id  UUID NOT NULL REFERENCES encounters(id) ON DELETE CASCADE,
  unit_id       UUID NOT NULL REFERENCES clinical_units(id),
  bed_id        UUID NOT NULL REFERENCES beds(id),
  status        TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','discharged','transferred')),
  admitted_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expected_discharge_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by    TEXT NOT NULL REFERENCES app_users(id)
);

CREATE TABLE IF NOT EXISTS clinical_critical_results (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id      UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  encounter_id    UUID REFERENCES encounters(id) ON DELETE SET NULL,
  label           TEXT NOT NULL,
  value_text      TEXT NOT NULL,
  severity        TEXT NOT NULL DEFAULT 'critical' CHECK (severity IN ('high','critical')),
  observed_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  acknowledged_at TIMESTAMPTZ,
  acknowledged_by TEXT REFERENCES app_users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by      TEXT NOT NULL REFERENCES app_users(id)
);

CREATE INDEX IF NOT EXISTS idx_admissions_unit ON inpatient_admissions (unit_id, status);
CREATE INDEX IF NOT EXISTS idx_critical_unacked ON clinical_critical_results (patient_id) WHERE acknowledged_at IS NULL;

UPDATE epis2_schema_meta SET version = 'epis2-v2-inpatient', applied_at = NOW() WHERE id = 1;
