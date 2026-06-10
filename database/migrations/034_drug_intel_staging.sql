-- MF-183: staging de inteligencia de fármacos Chile (drug-intel).
-- Datos scrapeados de fuentes públicas + correlación internacional.
-- Staging, NO SoT clínico: solo llega al catálogo tras revisión humana.

CREATE TABLE IF NOT EXISTS drug_intel_staging (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_key            TEXT NOT NULL UNIQUE,
  product_name          TEXT NOT NULL,
  active_ingredient     TEXT,
  atc_code              TEXT,
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

CREATE INDEX IF NOT EXISTS idx_drug_intel_review_status
  ON drug_intel_staging (review_status, requires_human_review);
CREATE INDEX IF NOT EXISTS idx_drug_intel_atc ON drug_intel_staging (atc_code);

UPDATE epis2_schema_meta SET version = 'epis2-mf-183-drug-intel-staging', applied_at = NOW() WHERE id = 1;
