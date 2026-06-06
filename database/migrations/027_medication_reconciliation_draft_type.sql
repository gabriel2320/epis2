-- MF-166: borrador conciliación medicamentosa.

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
    'other'
  )
);

UPDATE epis2_schema_meta SET version = 'epis2-medication-reconciliation-draft', applied_at = NOW() WHERE id = 1;
