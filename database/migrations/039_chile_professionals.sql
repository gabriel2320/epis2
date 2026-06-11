-- MF-CHILE-PRO-01: profesional de salud (RNPI stub demo)

CREATE TABLE IF NOT EXISTS professionals (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_user_id       TEXT NOT NULL UNIQUE REFERENCES app_users(id),
  run_normalizado   TEXT,
  rnpi_numero       TEXT,
  titulo            TEXT,
  especialidad      TEXT,
  subespecialidad   TEXT,
  registro_activo   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by        TEXT NOT NULL REFERENCES app_users(id)
);

CREATE INDEX IF NOT EXISTS idx_professionals_rnpi ON professionals (rnpi_numero) WHERE rnpi_numero IS NOT NULL;

INSERT INTO professionals (app_user_id, run_normalizado, rnpi_numero, titulo, especialidad, created_by)
VALUES ('usr-physician-01', NULL, 'RNPI-DEMO-001', 'Médico cirujano', 'Medicina interna', 'usr-admin-01')
ON CONFLICT (app_user_id) DO NOTHING;

INSERT INTO professionals (app_user_id, rnpi_numero, titulo, especialidad, created_by)
VALUES ('usr-nurse-01', 'RNPI-DEMO-002', 'Enfermera/o universitaria/o', 'Enfermería clínica', 'usr-admin-01')
ON CONFLICT (app_user_id) DO NOTHING;

UPDATE epis2_schema_meta SET version = 'epis2-chile-pro-01', applied_at = NOW() WHERE id = 1;
