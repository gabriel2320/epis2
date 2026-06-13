-- MF-CASE-01: staging de casos clínicos sintéticos (clinical-case-intel).
-- Datos scrapeados/normalizados desde fuentes públicas (Synthea, etc.).
-- Staging, NO SoT clínico: solo llega a pacientes demo tras revisión humana.

CREATE TABLE IF NOT EXISTS clinical_case_staging (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_code             TEXT NOT NULL UNIQUE,
  scenario              TEXT NOT NULL,
  review_status         TEXT NOT NULL DEFAULT 'pending'
                        CHECK (review_status IN ('pending', 'approved', 'rejected')),
  requires_human_review BOOLEAN NOT NULL DEFAULT TRUE,
  payload               JSONB NOT NULL,
  source_hash           TEXT NOT NULL,
  fetched_at            TIMESTAMPTZ NOT NULL,
  reviewed_by           TEXT REFERENCES app_users(id),
  reviewed_at           TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clinical_case_review_status
  ON clinical_case_staging (review_status, requires_human_review);
CREATE INDEX IF NOT EXISTS idx_clinical_case_scenario
  ON clinical_case_staging (scenario);

UPDATE epis2_schema_meta SET version = 'epis2-mf-case-01-clinical-case-staging', applied_at = NOW() WHERE id = 1;
