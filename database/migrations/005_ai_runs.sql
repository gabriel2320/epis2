-- EPIS2-07: trazabilidad de asistencia IA (no es SoT clínico)

CREATE TABLE IF NOT EXISTS ai_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id TEXT REFERENCES app_users(id),
  blueprint_id TEXT NOT NULL,
  patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
  prompt_hash TEXT NOT NULL,
  model TEXT NOT NULL,
  latency_ms INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'rejected', 'unavailable')),
  input_payload JSONB,
  output_payload JSONB,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_runs_actor_created ON ai_runs (actor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_runs_blueprint ON ai_runs (blueprint_id, created_at DESC);
