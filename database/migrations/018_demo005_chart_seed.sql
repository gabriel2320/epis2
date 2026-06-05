-- EPIS2 MUI-07: serie temporal demo INR y signos vitales (DEMO-005)
INSERT INTO observations (patient_id, encounter_id, label, value_text, observed_at, created_by)
VALUES
  (
    'a0000001-0000-4000-8000-000000000005',
    'b0000001-0000-4000-8000-000000000005',
    'INR',
    '1.9 (sintético)',
    NOW() - INTERVAL '96 hours',
    'usr-physician-01'
  ),
  (
    'a0000001-0000-4000-8000-000000000005',
    'b0000001-0000-4000-8000-000000000005',
    'INR',
    '2.1 (sintético)',
    NOW() - INTERVAL '72 hours',
    'usr-physician-01'
  ),
  (
    'a0000001-0000-4000-8000-000000000005',
    'b0000001-0000-4000-8000-000000000005',
    'INR',
    '2.3 (sintético)',
    NOW() - INTERVAL '48 hours',
    'usr-physician-01'
  ),
  (
    'a0000001-0000-4000-8000-000000000005',
    'b0000001-0000-4000-8000-000000000005',
    'Frecuencia cardiaca',
    '84 lpm (sintético)',
    NOW() - INTERVAL '72 hours',
    'usr-physician-01'
  ),
  (
    'a0000001-0000-4000-8000-000000000005',
    'b0000001-0000-4000-8000-000000000005',
    'Frecuencia cardiaca',
    '90 lpm (sintético)',
    NOW() - INTERVAL '48 hours',
    'usr-physician-01'
  ),
  (
    'a0000001-0000-4000-8000-000000000005',
    'b0000001-0000-4000-8000-000000000005',
    'Frecuencia cardiaca',
    '88 lpm (sintético)',
    NOW() - INTERVAL '24 hours',
    'usr-physician-01'
  );
