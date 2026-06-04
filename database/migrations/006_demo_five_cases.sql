-- EPIS2-09: cinco casos clínicos DEMO completos (sin PHI real)

INSERT INTO patients (id, is_synthetic, display_name, birth_date, sex, created_by)
VALUES
  ('a0000001-0000-4000-8000-000000000004', TRUE, 'Paciente Demo — Roberto N. Vega', '1960-01-30', 'M', 'usr-physician-01'),
  ('a0000001-0000-4000-8000-000000000005', TRUE, 'Paciente Demo — Elena M. Fuentes', '1948-09-14', 'F', 'usr-physician-01')
ON CONFLICT (id) DO NOTHING;

INSERT INTO patient_identifiers (patient_id, system, value, created_by)
VALUES
  ('a0000001-0000-4000-8000-000000000004', 'EPIS2-DEMO', 'DEMO-004', 'usr-physician-01'),
  ('a0000001-0000-4000-8000-000000000005', 'EPIS2-DEMO', 'DEMO-005', 'usr-physician-01')
ON CONFLICT (system, value) DO NOTHING;

INSERT INTO encounters (id, patient_id, status, created_by)
VALUES
  ('b0000001-0000-4000-8000-000000000003', 'a0000001-0000-4000-8000-000000000003', 'open', 'usr-physician-01'),
  ('b0000001-0000-4000-8000-000000000004', 'a0000001-0000-4000-8000-000000000004', 'open', 'usr-physician-01'),
  ('b0000001-0000-4000-8000-000000000005', 'a0000001-0000-4000-8000-000000000005', 'open', 'usr-physician-01')
ON CONFLICT (id) DO NOTHING;

INSERT INTO problems (patient_id, encounter_id, description, created_by)
VALUES
  ('a0000001-0000-4000-8000-000000000001', 'b0000001-0000-4000-8000-000000000001', 'Hipertensión arterial esencial (sintético)', 'usr-physician-01'),
  ('a0000001-0000-4000-8000-000000000002', 'b0000001-0000-4000-8000-000000000002', 'Diabetes mellitus tipo 2 (sintético)', 'usr-physician-01'),
  ('a0000001-0000-4000-8000-000000000002', 'b0000001-0000-4000-8000-000000000002', 'Dislipidemia mixta (sintético)', 'usr-physician-01'),
  ('a0000001-0000-4000-8000-000000000003', 'b0000001-0000-4000-8000-000000000003', 'Asma bronquial persistente leve (sintético)', 'usr-physician-01'),
  ('a0000001-0000-4000-8000-000000000004', 'b0000001-0000-4000-8000-000000000004', 'Postoperatorio apendicectomía día 2 (sintético)', 'usr-physician-01'),
  ('a0000001-0000-4000-8000-000000000005', 'b0000001-0000-4000-8000-000000000005', 'Fibrilación auricular (sintético)', 'usr-physician-01'),
  ('a0000001-0000-4000-8000-000000000005', 'b0000001-0000-4000-8000-000000000005', 'Polifarmacia en revisión (demo)', 'usr-physician-01');

INSERT INTO observations (patient_id, encounter_id, label, value_text, created_by)
VALUES
  ('a0000001-0000-4000-8000-000000000001', 'b0000001-0000-4000-8000-000000000001', 'Presión arterial', '128/82 mmHg (sintético)', 'usr-physician-01'),
  ('a0000001-0000-4000-8000-000000000001', 'b0000001-0000-4000-8000-000000000001', 'Creatinina', '0.9 mg/dL (demo)', 'usr-physician-01'),
  ('a0000001-0000-4000-8000-000000000002', 'b0000001-0000-4000-8000-000000000002', 'Glicemia capilar', '142 mg/dL (sintético)', 'usr-physician-01'),
  ('a0000001-0000-4000-8000-000000000002', 'b0000001-0000-4000-8000-000000000002', 'HbA1c', '7.4 % (demo)', 'usr-physician-01'),
  ('a0000001-0000-4000-8000-000000000003', 'b0000001-0000-4000-8000-000000000003', 'Saturación O2', '98 % (sintético)', 'usr-physician-01'),
  ('a0000001-0000-4000-8000-000000000003', 'b0000001-0000-4000-8000-000000000003', 'Peso', '22 kg (demo)', 'usr-physician-01'),
  ('a0000001-0000-4000-8000-000000000004', 'b0000001-0000-4000-8000-000000000004', 'Leucocitos', '9.2 ×10³/µL (sintético)', 'usr-physician-01'),
  ('a0000001-0000-4000-8000-000000000004', 'b0000001-0000-4000-8000-000000000004', 'PCR', '12 mg/L (demo)', 'usr-physician-01'),
  ('a0000001-0000-4000-8000-000000000005', 'b0000001-0000-4000-8000-000000000005', 'INR', '2.4 (sintético)', 'usr-physician-01'),
  ('a0000001-0000-4000-8000-000000000005', 'b0000001-0000-4000-8000-000000000005', 'Creatinina', '1.1 mg/dL (demo)', 'usr-physician-01');

-- Nota aprobada de referencia (caso 1)
INSERT INTO clinical_notes (id, patient_id, encounter_id, note_type, title, body, created_by, updated_by)
VALUES (
  'n0000001-0000-4000-8000-000000000001',
  'a0000001-0000-4000-8000-000000000001',
  'b0000001-0000-4000-8000-000000000001',
  'evolution_note',
  'Evolución previa aprobada (demo)',
  '{"subjective":"Sin cefalea (sintético)","objective":"PA 128/82","assessment":"HTA controlada (demo)","plan":"Continuar losartán"}',
  'usr-physician-01',
  'usr-physician-01'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO clinical_note_versions (note_id, version_no, title, body, created_by)
VALUES (
  'n0000001-0000-4000-8000-000000000001',
  1,
  'Evolución previa aprobada (demo)',
  '{"subjective":"Sin cefalea (sintético)","objective":"PA 128/82","assessment":"HTA controlada (demo)","plan":"Continuar losartán"}',
  'usr-physician-01'
)
ON CONFLICT (note_id, version_no) DO NOTHING;

-- Borrador listo para revisión (caso 2)
INSERT INTO clinical_drafts (id, patient_id, encounter_id, draft_type, status, title, body, created_by, updated_by)
VALUES (
  'd0000001-0000-4000-8000-000000000001',
  'a0000001-0000-4000-8000-000000000002',
  'b0000001-0000-4000-8000-000000000002',
  'evolution_note',
  'ready_for_review',
  'Evolución diabetes — pendiente revisión (demo)',
  '{"subjective":"Refiere polidipsia leve (sintético)","objective":"Glicemia 142 mg/dL","assessment":"DM2 — control subóptimo (demo)","plan":"Reforzar adherencia"}',
  'usr-physician-01',
  'usr-physician-01'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO draft_versions (draft_id, version_no, status, title, body, created_by)
VALUES (
  'd0000001-0000-4000-8000-000000000001',
  1,
  'ready_for_review',
  'Evolución diabetes — pendiente revisión (demo)',
  '{"subjective":"Refiere polidipsia leve (sintético)","objective":"Glicemia 142 mg/dL","assessment":"DM2 — control subóptimo (demo)","plan":"Reforzar adherencia"}',
  'usr-physician-01'
)
ON CONFLICT (draft_id, version_no) DO NOTHING;

UPDATE epis2_schema_meta SET version = 'epis2-09-demo', applied_at = NOW() WHERE id = 1;
