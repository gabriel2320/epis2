-- MF-CHILE-ID-01: identificadores paciente Chile (RUN + tipos MINSAL, sin PK en RUT)

ALTER TABLE patient_identifiers
  ADD COLUMN IF NOT EXISTS identifier_type TEXT NOT NULL DEFAULT 'RUN',
  ADD COLUMN IF NOT EXISTS rut_numero INTEGER,
  ADD COLUMN IF NOT EXISTS rut_dv CHAR(1),
  ADD COLUMN IF NOT EXISTS value_normalized TEXT,
  ADD COLUMN IF NOT EXISTS country_code CHAR(2) NOT NULL DEFAULT 'CL',
  ADD COLUMN IF NOT EXISTS valid_from TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS valid_to TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS verified BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE patient_identifiers
  DROP CONSTRAINT IF EXISTS patient_identifiers_type_chk;

ALTER TABLE patient_identifiers
  ADD CONSTRAINT patient_identifiers_type_chk
  CHECK (
    identifier_type IN (
      'RUN',
      'RUN_PROVISIONAL',
      'RUN_MOTHER_RN',
      'PASSPORT',
      'BIRTH_FOLIO',
      'OTHER',
      'DEMO'
    )
  );

-- Backfill RUT demo existentes
UPDATE patient_identifiers pi
SET
  identifier_type = 'RUN',
  value_normalized = pi.value,
  rut_dv = upper(split_part(replace(pi.value, '.', ''), '-', 2)),
  rut_numero = NULLIF(split_part(replace(pi.value, '.', ''), '-', 1), '')::integer,
  verified = TRUE
WHERE pi.system = 'http://epis2.cl/identifier/rut'
  AND pi.rut_numero IS NULL
  AND pi.value ~ '^[0-9.]+-[0-9Kk]$';

UPDATE patient_identifiers pi
SET identifier_type = 'DEMO', value_normalized = pi.value
WHERE pi.system = 'http://epis2.demo/case-code'
  AND pi.identifier_type = 'RUN';

UPDATE patient_identifiers pi
SET value_normalized = COALESCE(pi.value_normalized, pi.value)
WHERE pi.value_normalized IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_patient_identifier_rut_run
  ON patient_identifiers (rut_numero, rut_dv)
  WHERE identifier_type = 'RUN'
    AND rut_numero IS NOT NULL
    AND system = 'http://epis2.cl/identifier/rut';

CREATE UNIQUE INDEX IF NOT EXISTS idx_patient_identifier_rut_normalized
  ON patient_identifiers (value_normalized)
  WHERE identifier_type = 'RUN'
    AND value_normalized IS NOT NULL
    AND system = 'http://epis2.cl/identifier/rut';

CREATE INDEX IF NOT EXISTS idx_patient_identifier_patient_type
  ON patient_identifiers (patient_id, identifier_type);

UPDATE epis2_schema_meta SET version = 'epis2-chile-id-01', applied_at = NOW() WHERE id = 1;
