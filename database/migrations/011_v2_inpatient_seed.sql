-- EPIS2 V2: seed censo demo Cirugía general (DEMO-004, DEMO-005)

INSERT INTO clinical_units (id, code, name)
VALUES ('f0000001-0000-4000-8000-000000000001', 'CIRUGIA-DEMO', 'Cirugía general (demo)')
ON CONFLICT (code) DO NOTHING;

INSERT INTO beds (id, unit_id, bed_label, status)
VALUES
  ('f0000002-0000-4000-8000-000000000001', 'f0000001-0000-4000-8000-000000000001', '101A', 'occupied'),
  ('f0000002-0000-4000-8000-000000000002', 'f0000001-0000-4000-8000-000000000001', '101B', 'occupied'),
  ('f0000002-0000-4000-8000-000000000003', 'f0000001-0000-4000-8000-000000000001', '102A', 'available')
ON CONFLICT (unit_id, bed_label) DO NOTHING;

INSERT INTO inpatient_admissions (id, patient_id, encounter_id, unit_id, bed_id, status, expected_discharge_at, created_by)
VALUES
  (
    'f0000003-0000-4000-8000-000000000001',
    'a0000001-0000-4000-8000-000000000004',
    'b0000001-0000-4000-8000-000000000004',
    'f0000001-0000-4000-8000-000000000001',
    'f0000002-0000-4000-8000-000000000001',
    'active',
    NOW() + INTERVAL '2 days',
    'usr-physician-01'
  ),
  (
    'f0000003-0000-4000-8000-000000000002',
    'a0000001-0000-4000-8000-000000000005',
    'b0000001-0000-4000-8000-000000000005',
    'f0000001-0000-4000-8000-000000000001',
    'f0000002-0000-4000-8000-000000000002',
    'active',
    NULL,
    'usr-physician-01'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO clinical_critical_results (id, patient_id, encounter_id, label, value_text, severity, observed_at, created_by)
VALUES
  (
    'f0000004-0000-4000-8000-000000000001',
    'a0000001-0000-4000-8000-000000000005',
    'b0000001-0000-4000-8000-000000000005',
    'INR',
    '3.8 — fuera de rango terapéutico (demo)',
    'critical',
    NOW() - INTERVAL '3 hours',
    'usr-physician-01'
  ),
  (
    'f0000004-0000-4000-8000-000000000002',
    'a0000001-0000-4000-8000-000000000004',
    'b0000001-0000-4000-8000-000000000004',
    'PCR',
    '18 mg/L — tendencia al alza (demo)',
    'high',
    NOW() - INTERVAL '6 hours',
    'usr-physician-01'
  )
ON CONFLICT (id) DO NOTHING;
