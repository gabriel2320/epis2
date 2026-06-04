-- EPIS2 V4: staging de importaciones externas (read-only demo)

CREATE TABLE IF NOT EXISTS interop_staging_batches (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_system TEXT NOT NULL,
  batch_label   TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'staged' CHECK (status IN ('staged','validated','rejected','applied')),
  record_count  INTEGER NOT NULL DEFAULT 0,
  staged_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes         TEXT,
  created_by    TEXT NOT NULL REFERENCES app_users(id)
);

CREATE INDEX IF NOT EXISTS idx_staging_status ON interop_staging_batches (status, staged_at DESC);

UPDATE epis2_schema_meta SET version = 'epis2-v4-staging', applied_at = NOW() WHERE id = 1;
