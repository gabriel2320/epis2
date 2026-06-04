-- EPIS2 V1: seed alergias, medicamentos y documentos demo (5 casos)

INSERT INTO patient_allergies (patient_id, substance, severity, created_by)
VALUES
  ('a0000001-0000-4000-8000-000000000005', 'Penicilina', 'moderate', 'usr-physician-01')
ON CONFLICT (patient_id, substance) DO NOTHING;

INSERT INTO patient_medications (patient_id, name, dose_text, route, status, created_by)
VALUES
  ('a0000001-0000-4000-8000-000000000001', 'Losartán', '50 mg/día', 'oral', 'active', 'usr-physician-01'),
  ('a0000001-0000-4000-8000-000000000002', 'Metformina', '850 mg c/12 h', 'oral', 'active', 'usr-physician-01'),
  ('a0000001-0000-4000-8000-000000000002', 'Atorvastatina', '20 mg/noche', 'oral', 'active', 'usr-physician-01'),
  ('a0000001-0000-4000-8000-000000000003', 'Budesonida/formoterol', 'inhalador', 'inhalation', 'active', 'usr-physician-01'),
  ('a0000001-0000-4000-8000-000000000004', 'Paracetamol', '1 g c/8 h PRN', 'oral', 'active', 'usr-physician-01'),
  ('a0000001-0000-4000-8000-000000000005', 'Warfarina', '5 mg/día', 'oral', 'active', 'usr-physician-01'),
  ('a0000001-0000-4000-8000-000000000005', 'Ceftriaxona', '1 g IV', 'IV', 'active', 'usr-physician-01');

INSERT INTO clinical_documents (id, patient_id, encounter_id, title, document_type, mime_type, storage_ref, created_by)
VALUES
  (
    'e0000001-0000-4000-8000-000000000001',
    'a0000001-0000-4000-8000-000000000001',
    'b0000001-0000-4000-8000-000000000001',
    'Informe laboratorio control HTA (demo)',
    'lab_report',
    'application/pdf',
    'demo://documents/demo-001-lab.pdf',
    'usr-physician-01'
  ),
  (
    'e0000001-0000-4000-8000-000000000002',
    'a0000001-0000-4000-8000-000000000002',
    'b0000001-0000-4000-8000-000000000002',
    'Hemoglobina glicosilada — resultado (demo)',
    'lab_report',
    'application/pdf',
    'demo://documents/demo-002-hba1c.pdf',
    'usr-physician-01'
  ),
  (
    'e0000001-0000-4000-8000-000000000005',
    'a0000001-0000-4000-8000-000000000005',
    'b0000001-0000-4000-8000-000000000005',
    'Nota alergia penicilina — archivo demo',
    'txt',
    'text/plain',
    'demo://documents/demo-005-allergy.txt',
    'usr-physician-01'
  )
ON CONFLICT (id) DO NOTHING;
