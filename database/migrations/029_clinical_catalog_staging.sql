-- MF-172: catálogos clínicos staging (no SoT productivo).

CREATE TABLE IF NOT EXISTS clinical_catalog_staging (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  catalog_code  TEXT NOT NULL,
  entry_code    TEXT NOT NULL,
  label         TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by    TEXT NOT NULL REFERENCES app_users(id),
  UNIQUE (catalog_code, entry_code)
);

CREATE INDEX IF NOT EXISTS idx_catalog_staging_code ON clinical_catalog_staging (catalog_code, status);

INSERT INTO clinical_catalog_staging (catalog_code, entry_code, label, created_by)
VALUES
  ('problem_type', 'HTA', 'Hipertensión arterial', 'usr-physician-01'),
  ('problem_type', 'DM2', 'Diabetes mellitus tipo 2', 'usr-physician-01'),
  ('allergy_severity', 'mild', 'Leve', 'usr-physician-01'),
  ('allergy_severity', 'moderate', 'Moderada', 'usr-physician-01')
ON CONFLICT (catalog_code, entry_code) DO NOTHING;

UPDATE epis2_schema_meta SET version = 'epis2-wave4-catalog-staging', applied_at = NOW() WHERE id = 1;
