-- MF-CASE-04/06: casos SIM desde clinical-case-intel (sin PHI real)
-- Regenerar: npm run case-intel:export-fixtures -- --apply

INSERT INTO patients (id, is_synthetic, display_name, birth_date, sex, created_by)
VALUES
  ('a0000002-0000-4000-8000-7e3ca20d97a4', TRUE, 'Paciente Sim — Camila R.', '1978-04-15', 'F', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-15db40954d33', TRUE, 'Paciente Sim — Diego L.', '1965-11-08', 'M', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-e60ce57defe7', TRUE, 'Paciente Sim — Valentina M.', '1992-02-20', 'F', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-f6391983bee4', TRUE, 'Paciente Sim — Matías R.', '1955-09-03', 'M', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-ec9ac0c0edc7', TRUE, 'Paciente Sim — Valentina M.', '1948-12-18', 'F', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-706b253c066f', TRUE, 'Paciente Sim — Andrés P.', '1988-06-25', 'M', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-a6195830689a', TRUE, 'Paciente Sim — Valentina M.', '1970-01-30', 'F', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-f093668ff9e7', TRUE, 'Paciente Sim — Andrés P.', '1952-04-11', 'M', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-c20352778c56', TRUE, 'Paciente Sim — Daniela V.', '1943-08-07', 'F', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-ee68a3bec8e4', TRUE, 'Paciente Sim — Matías R.', '1998-07-14', 'M', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-f4fce778c742', TRUE, 'Paciente Sim — Valentina M.', '1985-03-22', 'F', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-bbc56d13c875', TRUE, 'Paciente Sim — Andrés P.', '1968-10-05', 'M', 'usr-physician-01')
ON CONFLICT (id) DO NOTHING;

INSERT INTO patient_identifiers (patient_id, system, value, created_by)
VALUES
  ('a0000002-0000-4000-8000-7e3ca20d97a4', 'EPIS2-SIM', 'SIM-HIPERTENSI-N-ac1e', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-15db40954d33', 'EPIS2-SIM', 'SIM-DIABETES-81dd', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-e60ce57defe7', 'EPIS2-SIM', 'SIM-ASMA-BRONQUI-d583', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-f6391983bee4', 'EPIS2-SIM', 'SIM-NEUMON-A-ADQ-e60b', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-ec9ac0c0edc7', 'EPIS2-SIM', 'SIM-FIBRILACI-N--80e0', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-706b253c066f', 'EPIS2-SIM', 'SIM-OBESIDAD-SIN-a015', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-a6195830689a', 'EPIS2-SIM', 'SIM-DISLIPIDEMIA-cd13', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-f093668ff9e7', 'EPIS2-SIM', 'SIM-EPOC-MODERAD-2b2f', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-c20352778c56', 'EPIS2-SIM', 'SIM-INSUFICIENCI-cd9f', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-ee68a3bec8e4', 'EPIS2-SIM', 'SIM-ASTHMA-c6be', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-f4fce778c742', 'EPIS2-SIM', 'SIM-TRASTORNO-DE-9437', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-bbc56d13c875', 'EPIS2-SIM', 'SIM-ENFERMEDAD-R-40f8', 'usr-physician-01')
ON CONFLICT (system, value) DO NOTHING;

INSERT INTO encounters (id, patient_id, status, created_by)
VALUES
  ('b0000002-0000-4000-8000-039d1a575718', 'a0000002-0000-4000-8000-7e3ca20d97a4', 'open', 'usr-physician-01'),
  ('b0000002-0000-4000-8000-8fbbef759bcc', 'a0000002-0000-4000-8000-15db40954d33', 'open', 'usr-physician-01'),
  ('b0000002-0000-4000-8000-fa002b535232', 'a0000002-0000-4000-8000-e60ce57defe7', 'open', 'usr-physician-01'),
  ('b0000002-0000-4000-8000-d1c991b33795', 'a0000002-0000-4000-8000-f6391983bee4', 'open', 'usr-physician-01'),
  ('b0000002-0000-4000-8000-cdd30a2ab1ce', 'a0000002-0000-4000-8000-ec9ac0c0edc7', 'open', 'usr-physician-01'),
  ('b0000002-0000-4000-8000-0a9f9b80298d', 'a0000002-0000-4000-8000-706b253c066f', 'open', 'usr-physician-01'),
  ('b0000002-0000-4000-8000-be93863498d2', 'a0000002-0000-4000-8000-a6195830689a', 'open', 'usr-physician-01'),
  ('b0000002-0000-4000-8000-d577ab3340e5', 'a0000002-0000-4000-8000-f093668ff9e7', 'open', 'usr-physician-01'),
  ('b0000002-0000-4000-8000-9b799e9301b6', 'a0000002-0000-4000-8000-c20352778c56', 'open', 'usr-physician-01'),
  ('b0000002-0000-4000-8000-24a2012ffa8d', 'a0000002-0000-4000-8000-ee68a3bec8e4', 'open', 'usr-physician-01'),
  ('b0000002-0000-4000-8000-e07343ee457b', 'a0000002-0000-4000-8000-f4fce778c742', 'open', 'usr-physician-01'),
  ('b0000002-0000-4000-8000-0e1165b65328', 'a0000002-0000-4000-8000-bbc56d13c875', 'open', 'usr-physician-01')
ON CONFLICT (id) DO NOTHING;

INSERT INTO problems (patient_id, encounter_id, description, created_by)
VALUES
  ('a0000002-0000-4000-8000-7e3ca20d97a4', 'b0000002-0000-4000-8000-039d1a575718', 'Hipertensión arterial esencial (sintético)', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-15db40954d33', 'b0000002-0000-4000-8000-8fbbef759bcc', 'Diabetes mellitus tipo 2 (sintético)', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-e60ce57defe7', 'b0000002-0000-4000-8000-fa002b535232', 'Asma bronquial persistente leve (sintético)', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-f6391983bee4', 'b0000002-0000-4000-8000-d1c991b33795', 'Neumonía adquirida en la comunidad (sintético)', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-ec9ac0c0edc7', 'b0000002-0000-4000-8000-cdd30a2ab1ce', 'Fibrilación auricular (sintético)', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-706b253c066f', 'b0000002-0000-4000-8000-0a9f9b80298d', 'Obesidad (sintético)', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-a6195830689a', 'b0000002-0000-4000-8000-be93863498d2', 'Dislipidemia mixta (sintético)', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-f093668ff9e7', 'b0000002-0000-4000-8000-d577ab3340e5', 'EPOC moderada (sintético)', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-c20352778c56', 'b0000002-0000-4000-8000-9b799e9301b6', 'Insuficiencia cardíaca congestiva (sintético)', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-ee68a3bec8e4', 'b0000002-0000-4000-8000-24a2012ffa8d', 'Asma bronquial persistente leve (sintético)', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-f4fce778c742', 'b0000002-0000-4000-8000-e07343ee457b', 'Trastorno depresivo mayor (sintético)', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-bbc56d13c875', 'b0000002-0000-4000-8000-0e1165b65328', 'Enfermedad renal crónica estadio 3 (sintético)', 'usr-physician-01')
;

INSERT INTO observations (patient_id, encounter_id, label, value_text, created_by)
VALUES
  ('a0000002-0000-4000-8000-7e3ca20d97a4', 'b0000002-0000-4000-8000-039d1a575718', 'Blood pressure', '142/88 mmHg (sintético)', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-15db40954d33', 'b0000002-0000-4000-8000-8fbbef759bcc', 'HbA1c', '7.8 % (sintético)', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-e60ce57defe7', 'b0000002-0000-4000-8000-fa002b535232', 'Peak flow', '310 L/min (sintético)', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-f6391983bee4', 'b0000002-0000-4000-8000-d1c991b33795', 'Temperature', '38.4 Cel (sintético)', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-ec9ac0c0edc7', 'b0000002-0000-4000-8000-cdd30a2ab1ce', 'Heart rate', '92 /min (sintético)', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-706b253c066f', 'b0000002-0000-4000-8000-0a9f9b80298d', 'Body mass index', '32.4 kg/m2 (sintético)', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-a6195830689a', 'b0000002-0000-4000-8000-be93863498d2', 'LDL cholesterol', '168 mg/dL (sintético)', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-f093668ff9e7', 'b0000002-0000-4000-8000-d577ab3340e5', 'FEV1', '58 % predicted (sintético)', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-c20352778c56', 'b0000002-0000-4000-8000-9b799e9301b6', 'BNP', '420 pg/mL (sintético)', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-ee68a3bec8e4', 'b0000002-0000-4000-8000-24a2012ffa8d', 'Peak expiratory flow', '320 L/min (sintético)', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-ee68a3bec8e4', 'b0000002-0000-4000-8000-24a2012ffa8d', 'SpO2', '97% en aire ambiente (sintético)', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-f4fce778c742', 'b0000002-0000-4000-8000-e07343ee457b', 'PHQ-9 score', '14 score (sintético)', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-bbc56d13c875', 'b0000002-0000-4000-8000-0e1165b65328', 'Creatinine', '1.8 mg/dL (sintético)', 'usr-physician-01')
;

INSERT INTO patient_medications (patient_id, name, dose_text, route, status, created_by)
VALUES
  ('a0000002-0000-4000-8000-7e3ca20d97a4', 'Losartan (demo)', '50 mg daily', NULL, 'active', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-15db40954d33', 'Metformin (demo)', '850 mg BID', NULL, 'active', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-e60ce57defe7', 'Fluticasone/Salmeterol (demo)', '1 inhalación BID', NULL, 'active', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-f6391983bee4', 'Amoxicillin (demo)', '500 mg TID', NULL, 'active', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-ec9ac0c0edc7', 'Apixaban (demo)', '5 mg BID', NULL, 'active', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-a6195830689a', 'Atorvastatin (demo)', '20 mg nightly', NULL, 'active', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-f093668ff9e7', 'Tiotropium (demo)', '18 mcg daily', NULL, 'active', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-c20352778c56', 'Furosemide (demo)', '40 mg daily', NULL, 'active', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-ee68a3bec8e4', 'Salbutamol (demo)', '2 inhalaciones PRN', NULL, 'active', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-ee68a3bec8e4', 'Budesonida (demo)', '200 mcg BID', NULL, 'active', 'usr-physician-01'),
  ('a0000002-0000-4000-8000-bbc56d13c875', 'Lisinopril (demo)', '10 mg daily', NULL, 'active', 'usr-physician-01')
;

INSERT INTO patient_allergies (patient_id, substance, severity, created_by)
VALUES
  ('a0000002-0000-4000-8000-ee68a3bec8e4', 'Polen estacional (demo)', 'moderate', 'usr-physician-01')
ON CONFLICT (patient_id, substance) DO NOTHING;

UPDATE epis2_schema_meta SET version = 'epis2-mf-case-04-sim-seed', applied_at = NOW() WHERE id = 1;
