-- EPIS2-04: datos sintéticos DEMO (sin PHI real)

INSERT INTO app_users (id, username, display_name, role, is_synthetic)
VALUES
  ('usr-physician-01', 'medico.demo', 'Dra. Ana Demo', 'physician', TRUE),
  ('usr-nurse-01', 'enfermeria.demo', 'Enf. Luis Demo', 'nurse', TRUE),
  ('usr-pharmacist-01', 'farmacia.demo', 'Q.F. Rosa Demo', 'pharmacist', TRUE),
  ('usr-admin-01', 'admin.demo', 'Admin Demo', 'admin', TRUE),
  ('usr-auditor-01', 'auditor.demo', 'Auditor Demo', 'auditor', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO patients (id, is_synthetic, display_name, birth_date, sex, created_by)
VALUES
  ('a0000001-0000-4000-8000-000000000001', TRUE, 'Paciente Demo — Carmen Soto', '1985-03-12', 'F', 'usr-physician-01'),
  ('a0000001-0000-4000-8000-000000000002', TRUE, 'Paciente Demo — Jorge Pérez', '1972-11-08', 'M', 'usr-physician-01'),
  ('a0000001-0000-4000-8000-000000000003', TRUE, 'Paciente Demo — niña Inés R.', '2018-06-21', 'F', 'usr-physician-01')
ON CONFLICT (id) DO NOTHING;

INSERT INTO patient_identifiers (patient_id, system, value, created_by)
VALUES
  ('a0000001-0000-4000-8000-000000000001', 'EPIS2-DEMO', 'DEMO-001', 'usr-physician-01'),
  ('a0000001-0000-4000-8000-000000000002', 'EPIS2-DEMO', 'DEMO-002', 'usr-physician-01'),
  ('a0000001-0000-4000-8000-000000000003', 'EPIS2-DEMO', 'DEMO-003', 'usr-physician-01')
ON CONFLICT (system, value) DO NOTHING;

INSERT INTO encounters (id, patient_id, status, created_by)
VALUES
  ('b0000001-0000-4000-8000-000000000001', 'a0000001-0000-4000-8000-000000000001', 'open', 'usr-physician-01'),
  ('b0000001-0000-4000-8000-000000000002', 'a0000001-0000-4000-8000-000000000002', 'open', 'usr-physician-01')
ON CONFLICT (id) DO NOTHING;

INSERT INTO problems (patient_id, encounter_id, description, created_by)
VALUES
  ('a0000001-0000-4000-8000-000000000001', 'b0000001-0000-4000-8000-000000000001', 'Hipertensión arterial (sintético)', 'usr-physician-01'),
  ('a0000001-0000-4000-8000-000000000002', 'b0000001-0000-4000-8000-000000000002', 'Diabetes tipo 2 (sintético)', 'usr-physician-01');

INSERT INTO observations (patient_id, encounter_id, label, value_text, created_by)
VALUES
  ('a0000001-0000-4000-8000-000000000001', 'b0000001-0000-4000-8000-000000000001', 'Presión arterial', '128/82 mmHg (sintético)', 'usr-physician-01');
