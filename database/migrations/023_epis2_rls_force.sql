-- MF-155: el owner de tabla (epis2) no debe omitir RLS en staging enforce.

ALTER TABLE clinical_drafts FORCE ROW LEVEL SECURITY;
ALTER TABLE clinical_notes FORCE ROW LEVEL SECURITY;
ALTER TABLE patients FORCE ROW LEVEL SECURITY;

UPDATE epis2_schema_meta SET version = 'epis2-rls-force', applied_at = NOW() WHERE id = 1;
