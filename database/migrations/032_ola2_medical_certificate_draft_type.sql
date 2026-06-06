-- Ola 2: certificado médico (IDC 39–40).

ALTER TABLE clinical_drafts DROP CONSTRAINT IF EXISTS clinical_drafts_draft_type_check;

ALTER TABLE clinical_drafts ADD CONSTRAINT clinical_drafts_draft_type_check CHECK (
  draft_type IN (
    'evolution_note',
    'discharge_summary',
    'prescription',
    'lab_request',
    'referral',
    'imaging_request',
    'nursing_note',
    'medication_administration',
    'pharmacy_validation',
    'admission_note',
    'allergy_entry',
    'clinical_problem_entry',
    'medication_reconciliation',
    'transfer_note',
    'outpatient_visit',
    'referral_report',
    'medical_certificate',
    'other'
  )
);

UPDATE epis2_schema_meta SET version = 'epis2-ola2-medical-certificate', applied_at = NOW() WHERE id = 1;

-- Refresca ventanas MAR demo (idempotente — evita flake en tests de enfermería).
UPDATE mar_scheduled_doses
SET
  scheduled_at = NOW() + INTERVAL '30 minutes',
  window_start = NOW() - INTERVAL '1 hour',
  window_end = NOW() + INTERVAL '2 hours',
  status = 'scheduled',
  requires_double_check = TRUE
WHERE id = 'f1000001-0000-4000-8000-000000000001';

UPDATE mar_scheduled_doses
SET
  scheduled_at = NOW() + INTERVAL '90 minutes',
  window_start = NOW() - INTERVAL '15 minutes',
  window_end = NOW() + INTERVAL '3 hours',
  status = 'scheduled'
WHERE id = 'f1000001-0000-4000-8000-000000000003';
