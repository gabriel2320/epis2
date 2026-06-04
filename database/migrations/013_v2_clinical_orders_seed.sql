-- EPIS2 V2: órdenes demo para pacientes hospitalizados

INSERT INTO clinical_orders (id, patient_id, encounter_id, order_type, title, detail, status, priority, created_by)
VALUES
  (
    'f0000005-0000-4000-8000-000000000001',
    'a0000001-0000-4000-8000-000000000004',
    'b0000001-0000-4000-8000-000000000004',
    'nursing',
    'Control signos vitales c/4 h',
    'Postoperatorio apendicectomía (demo)',
    'active',
    'routine',
    'usr-physician-01'
  ),
  (
    'f0000005-0000-4000-8000-000000000002',
    'a0000001-0000-4000-8000-000000000004',
    'b0000001-0000-4000-8000-000000000004',
    'lab',
    'Hemograma control mañana',
    NULL,
    'active',
    'routine',
    'usr-physician-01'
  ),
  (
    'f0000005-0000-4000-8000-000000000003',
    'a0000001-0000-4000-8000-000000000005',
    'b0000001-0000-4000-8000-000000000005',
    'medication',
    'Ajuste warfarina — valorar INR',
    'Crítico INR pendiente de acuse (demo)',
    'active',
    'urgent',
    'usr-physician-01'
  )
ON CONFLICT (id) DO NOTHING;
