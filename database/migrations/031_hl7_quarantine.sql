-- MF-180…182: cuarentena HL7 inbound (sin writeback directo a SoT).

CREATE TABLE IF NOT EXISTS interop_hl7_quarantine (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_type      TEXT,
  raw_message       TEXT NOT NULL,
  status            TEXT NOT NULL DEFAULT 'quarantine'
    CHECK (status IN ('quarantine', 'mapped', 'writeback_proposed', 'reverted', 'rejected')),
  mapped_preview    JSONB,
  proposed_draft_id UUID REFERENCES clinical_drafts(id) ON DELETE SET NULL,
  staged_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by        TEXT NOT NULL REFERENCES app_users(id),
  reverted_at       TIMESTAMPTZ,
  reverted_by       TEXT REFERENCES app_users(id)
);

CREATE INDEX IF NOT EXISTS idx_hl7_quarantine_status ON interop_hl7_quarantine (status, staged_at DESC);

UPDATE epis2_schema_meta SET version = 'epis2-hl7-quarantine', applied_at = NOW() WHERE id = 1;
