-- MF-CHILE transversal: auditoría clínica extendida

ALTER TABLE audit_events
  ADD COLUMN IF NOT EXISTS patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS action TEXT,
  ADD COLUMN IF NOT EXISTS table_name TEXT,
  ADD COLUMN IF NOT EXISTS record_id TEXT,
  ADD COLUMN IF NOT EXISTS ip_address TEXT,
  ADD COLUMN IF NOT EXISTS reason TEXT;

CREATE INDEX IF NOT EXISTS idx_audit_patient_at ON audit_events (patient_id, at DESC)
  WHERE patient_id IS NOT NULL;

UPDATE epis2_schema_meta SET version = 'epis2-chile-audit-01', applied_at = NOW() WHERE id = 1;
