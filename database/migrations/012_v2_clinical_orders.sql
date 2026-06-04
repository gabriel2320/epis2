-- EPIS2 V2: órdenes clínicas activas (demo hospitalización)

CREATE TABLE IF NOT EXISTS clinical_orders (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id    UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  encounter_id  UUID REFERENCES encounters(id) ON DELETE SET NULL,
  order_type    TEXT NOT NULL CHECK (order_type IN ('medication','lab','imaging','nursing','other')),
  title         TEXT NOT NULL,
  detail        TEXT,
  status        TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','completed','cancelled')),
  priority      TEXT NOT NULL DEFAULT 'routine' CHECK (priority IN ('routine','urgent','stat')),
  ordered_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by    TEXT NOT NULL REFERENCES app_users(id)
);

CREATE INDEX IF NOT EXISTS idx_orders_patient_status ON clinical_orders (patient_id, status);

UPDATE epis2_schema_meta SET version = 'epis2-v2-orders', applied_at = NOW() WHERE id = 1;
