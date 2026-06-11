-- MF-CHILE-ADM-01: previsión Chile (FONASA / ISAPRE / particular)

CREATE TABLE IF NOT EXISTS patient_coverage (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id      UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  tipo_prevision  TEXT NOT NULL CHECK (
    tipo_prevision IN ('FONASA', 'ISAPRE', 'PARTICULAR', 'CAPREDENA', 'DIPRECA', 'CONVENIO', 'OTRO')
  ),
  fonasa_tramo    TEXT CHECK (fonasa_tramo IN ('A', 'B', 'C', 'D') OR fonasa_tramo IS NULL),
  isapre_nombre   TEXT,
  plan_nombre     TEXT,
  vigente_desde   DATE NOT NULL DEFAULT CURRENT_DATE,
  vigente_hasta   DATE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by      TEXT NOT NULL REFERENCES app_users(id)
);

CREATE INDEX IF NOT EXISTS idx_patient_coverage_patient
  ON patient_coverage (patient_id, vigente_desde DESC);

CREATE UNIQUE INDEX IF NOT EXISTS idx_patient_coverage_active
  ON patient_coverage (patient_id)
  WHERE vigente_hasta IS NULL;

-- Demo sintético
INSERT INTO patient_coverage (patient_id, tipo_prevision, fonasa_tramo, plan_nombre, created_by)
SELECT p.id, 'FONASA', 'C', 'FONASA tramo C (demo)', 'usr-physician-01'
FROM patients p
WHERE p.is_synthetic = TRUE
  AND NOT EXISTS (
    SELECT 1 FROM patient_coverage c WHERE c.patient_id = p.id AND c.vigente_hasta IS NULL
  );

UPDATE epis2_schema_meta SET version = 'epis2-chile-adm-01', applied_at = NOW() WHERE id = 1;
