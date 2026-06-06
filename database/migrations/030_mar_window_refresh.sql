-- Refresca ventanas MAR demo (NOW() relativo) para tests idempotentes.

UPDATE mar_scheduled_doses
SET
  scheduled_at = NOW() + INTERVAL '30 minutes',
  window_start = NOW() - INTERVAL '1 hour',
  window_end = NOW() + INTERVAL '2 hours',
  status = 'scheduled'
WHERE id = 'f1000001-0000-4000-8000-000000000001';

UPDATE mar_scheduled_doses
SET
  scheduled_at = NOW() + INTERVAL '4 hours',
  window_start = NOW() + INTERVAL '3 hours',
  window_end = NOW() + INTERVAL '5 hours',
  status = 'scheduled'
WHERE id = 'f1000001-0000-4000-8000-000000000002';

UPDATE mar_scheduled_doses
SET
  scheduled_at = NOW() + INTERVAL '90 minutes',
  window_start = NOW(),
  window_end = NOW() + INTERVAL '3 hours',
  status = 'scheduled'
WHERE id = 'f1000001-0000-4000-8000-000000000003';

UPDATE epis2_schema_meta SET version = 'epis2-mar-window-refresh', applied_at = NOW() WHERE id = 1;
