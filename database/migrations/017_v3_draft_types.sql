-- EPIS2 V3: ampliar draft_type para enfermería, MAR y farmacia

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
    'other'
  )
);

UPDATE epis2_schema_meta SET version = 'epis2-v3-draft-types', applied_at = NOW() WHERE id = 1;
