-- EPIS2 V3 Plan E: MAR programado con ventanas horarias demo

CREATE TABLE IF NOT EXISTS mar_scheduled_doses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id      UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  medication      TEXT NOT NULL,
  dose_text       TEXT NOT NULL,
  route           TEXT NOT NULL,
  scheduled_at    TIMESTAMPTZ NOT NULL,
  window_start    TIMESTAMPTZ NOT NULL,
  window_end      TIMESTAMPTZ NOT NULL,
  status          TEXT NOT NULL DEFAULT 'scheduled'
    CHECK (status IN ('scheduled','administered','missed','held')),
  requires_double_check BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by      TEXT NOT NULL REFERENCES app_users(id)
);

CREATE INDEX IF NOT EXISTS idx_mar_schedule_patient ON mar_scheduled_doses (patient_id, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_mar_schedule_window ON mar_scheduled_doses (window_start, window_end)
  WHERE status = 'scheduled';

INSERT INTO mar_scheduled_doses (
  id, patient_id, medication, dose_text, route,
  scheduled_at, window_start, window_end, status, requires_double_check, created_by
)
VALUES
  (
    'f1000001-0000-4000-8000-000000000001',
    'a0000001-0000-4000-8000-000000000005',
    'Warfarina',
    '5 mg',
    'VO',
    NOW() + INTERVAL '30 minutes',
    NOW() - INTERVAL '1 hour',
    NOW() + INTERVAL '2 hours',
    'scheduled',
    TRUE,
    'usr-physician-01'
  ),
  (
    'f1000001-0000-4000-8000-000000000002',
    'a0000001-0000-4000-8000-000000000005',
    'Ceftriaxona',
    '1 g',
    'IV',
    NOW() + INTERVAL '4 hours',
    NOW() + INTERVAL '3 hours',
    NOW() + INTERVAL '5 hours',
    'scheduled',
    FALSE,
    'usr-physician-01'
  ),
  (
    'f1000001-0000-4000-8000-000000000003',
    'a0000001-0000-4000-8000-000000000004',
    'Paracetamol',
    '1 g',
    'VO',
    NOW() + INTERVAL '90 minutes',
    NOW(),
    NOW() + INTERVAL '3 hours',
    'scheduled',
    FALSE,
    'usr-physician-01'
  )
ON CONFLICT (id) DO NOTHING;

UPDATE epis2_schema_meta SET version = 'epis2-v3-mar-schedule', applied_at = NOW() WHERE id = 1;
