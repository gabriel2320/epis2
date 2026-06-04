-- Identificadores RUT sintéticos para búsqueda demo (EPIS2 legacy P2).
-- Valores ficticios válidos módulo 11; no corresponden a personas reales.

INSERT INTO patient_identifiers (patient_id, system, value, created_by)
VALUES
  ('a0000001-0000-4000-8000-000000000001', 'http://epis2.cl/identifier/rut', '12.345.678-5', 'usr-physician-01'),
  ('a0000001-0000-4000-8000-000000000002', 'http://epis2.cl/identifier/rut', '13.456.789-9', 'usr-physician-01'),
  ('a0000001-0000-4000-8000-000000000003', 'http://epis2.cl/identifier/rut', '22.222.222-2', 'usr-physician-01'),
  ('a0000001-0000-4000-8000-000000000004', 'http://epis2.cl/identifier/rut', '16.789.012-1', 'usr-physician-01'),
  ('a0000001-0000-4000-8000-000000000005', 'http://epis2.cl/identifier/rut', '9.876.543-3', 'usr-physician-01')
ON CONFLICT DO NOTHING;
