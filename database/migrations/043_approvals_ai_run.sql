-- MF-SH-01: trazabilidad borrador asistido → approval → ai_runs
ALTER TABLE approvals
  ADD COLUMN IF NOT EXISTS ai_run_id UUID REFERENCES ai_runs(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_approvals_ai_run ON approvals (ai_run_id)
  WHERE ai_run_id IS NOT NULL;

UPDATE epis2_schema_meta SET version = 'epis2-043-approvals-ai-run', applied_at = NOW() WHERE id = 1;
