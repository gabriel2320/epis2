-- MF-DI-02 — memoria operacional por usuario (prefs + estado ficha por paciente).

CREATE TABLE IF NOT EXISTS user_operational_memory (
  user_id TEXT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  scope TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, scope)
);

CREATE INDEX IF NOT EXISTS user_operational_memory_scope_idx
  ON user_operational_memory (scope);

ALTER TABLE user_operational_memory ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS user_operational_memory_rls_off ON user_operational_memory;
CREATE POLICY user_operational_memory_rls_off ON user_operational_memory
  AS PERMISSIVE FOR ALL
  USING (COALESCE(current_setting('epis2.rls_mode', true), 'off') = 'off');

DROP POLICY IF EXISTS user_operational_memory_rls_enforce ON user_operational_memory;
CREATE POLICY user_operational_memory_rls_enforce ON user_operational_memory
  AS PERMISSIVE FOR ALL
  USING (
    current_setting('epis2.rls_mode', true) = 'enforce'
    AND user_id = current_setting('epis2.actor_id', true)
  );

UPDATE epis2_schema_meta SET version = 'user-operational-memory', applied_at = NOW() WHERE id = 1;
