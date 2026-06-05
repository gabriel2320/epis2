-- EPIS2 Plan F: RLS piloto (ADR-005) — RBAC API sigue siendo primario.
-- Modo por sesión: epis2.rls_mode = off | enforce (default off = compatible demo).

ALTER TABLE clinical_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS clinical_drafts_rls_off ON clinical_drafts;
CREATE POLICY clinical_drafts_rls_off ON clinical_drafts
  AS PERMISSIVE FOR ALL
  USING (COALESCE(current_setting('epis2.rls_mode', true), 'off') = 'off');

DROP POLICY IF EXISTS clinical_drafts_rls_enforce ON clinical_drafts;
CREATE POLICY clinical_drafts_rls_enforce ON clinical_drafts
  AS PERMISSIVE FOR ALL
  USING (
    current_setting('epis2.rls_mode', true) = 'enforce'
    AND (
      created_by = current_setting('epis2.actor_id', true)
      OR current_setting('epis2.actor_role', true) IN ('admin', 'auditor', 'physician')
    )
  );

DROP POLICY IF EXISTS clinical_notes_rls_off ON clinical_notes;
CREATE POLICY clinical_notes_rls_off ON clinical_notes
  AS PERMISSIVE FOR ALL
  USING (COALESCE(current_setting('epis2.rls_mode', true), 'off') = 'off');

DROP POLICY IF EXISTS clinical_notes_rls_enforce ON clinical_notes;
CREATE POLICY clinical_notes_rls_enforce ON clinical_notes
  AS PERMISSIVE FOR ALL
  USING (
    current_setting('epis2.rls_mode', true) = 'enforce'
    AND (
      created_by = current_setting('epis2.actor_id', true)
      OR current_setting('epis2.actor_role', true) IN ('admin', 'auditor', 'physician')
    )
  );

DROP POLICY IF EXISTS patients_rls_off ON patients;
CREATE POLICY patients_rls_off ON patients
  AS PERMISSIVE FOR ALL
  USING (COALESCE(current_setting('epis2.rls_mode', true), 'off') = 'off');

DROP POLICY IF EXISTS patients_rls_enforce ON patients;
CREATE POLICY patients_rls_enforce ON patients
  AS PERMISSIVE FOR ALL
  USING (
    current_setting('epis2.rls_mode', true) = 'enforce'
    AND current_setting('epis2.actor_role', true) IN (
      'physician', 'nurse', 'pharmacist', 'admin', 'auditor'
    )
  );

UPDATE epis2_schema_meta SET version = 'epis2-rls-pilot', applied_at = NOW() WHERE id = 1;
