-- EPIS2: RLS fail-closed correction.
-- Missing session GUCs must not behave as demo/off access. Demo/off remains explicit
-- through runWithRlsContext(), which sets epis2.rls_mode = 'off' inside the transaction.

DROP POLICY IF EXISTS clinical_drafts_rls_off ON clinical_drafts;
CREATE POLICY clinical_drafts_rls_off ON clinical_drafts
  AS PERMISSIVE FOR ALL
  USING (current_setting('epis2.rls_mode', true) = 'off')
  WITH CHECK (current_setting('epis2.rls_mode', true) = 'off');

DROP POLICY IF EXISTS clinical_notes_rls_off ON clinical_notes;
CREATE POLICY clinical_notes_rls_off ON clinical_notes
  AS PERMISSIVE FOR ALL
  USING (current_setting('epis2.rls_mode', true) = 'off')
  WITH CHECK (current_setting('epis2.rls_mode', true) = 'off');

DROP POLICY IF EXISTS patients_rls_off ON patients;
CREATE POLICY patients_rls_off ON patients
  AS PERMISSIVE FOR ALL
  USING (current_setting('epis2.rls_mode', true) = 'off')
  WITH CHECK (current_setting('epis2.rls_mode', true) = 'off');

UPDATE epis2_schema_meta SET version = 'epis2-rls-fail-closed', applied_at = NOW() WHERE id = 1;
