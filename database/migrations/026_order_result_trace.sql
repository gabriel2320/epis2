-- MF-163: trazabilidad orden → resultado (demo)

ALTER TABLE observations
  ADD COLUMN IF NOT EXISTS clinical_order_id UUID REFERENCES clinical_orders(id) ON DELETE SET NULL;

ALTER TABLE clinical_critical_results
  ADD COLUMN IF NOT EXISTS clinical_order_id UUID REFERENCES clinical_orders(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_observations_clinical_order
  ON observations (clinical_order_id) WHERE clinical_order_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_critical_clinical_order
  ON clinical_critical_results (clinical_order_id) WHERE clinical_order_id IS NOT NULL;

-- DEMO-004: resultados de laboratorio vinculados a hemograma
UPDATE observations
SET clinical_order_id = 'f0000005-0000-4000-8000-000000000002'
WHERE patient_id = 'a0000001-0000-4000-8000-000000000004'
  AND label IN ('Leucocitos', 'PCR');

UPDATE clinical_critical_results
SET clinical_order_id = 'f0000005-0000-4000-8000-000000000002'
WHERE id = 'f0000004-0000-4000-8000-000000000002';

-- DEMO-005: INR crítico vinculado a orden de ajuste (valoración INR)
UPDATE clinical_critical_results
SET clinical_order_id = 'f0000005-0000-4000-8000-000000000003'
WHERE id = 'f0000004-0000-4000-8000-000000000001';

UPDATE observations
SET clinical_order_id = 'f0000005-0000-4000-8000-000000000003'
WHERE patient_id = 'a0000001-0000-4000-8000-000000000005'
  AND label = 'INR';

UPDATE epis2_schema_meta SET version = 'epis2-order-result-trace', applied_at = NOW() WHERE id = 1;
