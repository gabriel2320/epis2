-- MF-EPISODE-01: episodio de cuidado (capa sobre encounters)

CREATE TABLE IF NOT EXISTS episodes_of_care (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id      UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  tipo_episodio   TEXT NOT NULL DEFAULT 'ambulatory' CHECK (
    tipo_episodio IN ('ambulatory', 'inpatient', 'emergency', 'chronic', 'other')
  ),
  estado          TEXT NOT NULL DEFAULT 'active' CHECK (estado IN ('planned', 'active', 'finished', 'cancelled')),
  fecha_inicio    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fecha_fin       TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by      TEXT NOT NULL REFERENCES app_users(id)
);

ALTER TABLE encounters
  ADD COLUMN IF NOT EXISTS episode_id UUID REFERENCES episodes_of_care(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_episodes_patient ON episodes_of_care (patient_id, fecha_inicio DESC);
CREATE INDEX IF NOT EXISTS idx_encounters_episode ON encounters (episode_id) WHERE episode_id IS NOT NULL;

INSERT INTO episodes_of_care (patient_id, tipo_episodio, estado, created_by)
SELECT DISTINCT
  e.patient_id,
  CASE WHEN EXISTS (
    SELECT 1 FROM inpatient_admissions ia
    WHERE ia.patient_id = e.patient_id AND ia.status = 'active'
  ) THEN 'inpatient' ELSE 'ambulatory' END,
  'active',
  e.created_by
FROM encounters e
WHERE e.status = 'open'
  AND NOT EXISTS (
    SELECT 1 FROM episodes_of_care ep
    WHERE ep.patient_id = e.patient_id AND ep.estado = 'active'
  );

UPDATE encounters e
SET episode_id = sub.episode_id
FROM (
  SELECT e2.id AS encounter_id, ep.id AS episode_id
  FROM encounters e2
  JOIN episodes_of_care ep ON ep.patient_id = e2.patient_id AND ep.estado = 'active'
  WHERE e2.episode_id IS NULL
) sub
WHERE e.id = sub.encounter_id;

UPDATE epis2_schema_meta SET version = 'epis2-chile-episode-01', applied_at = NOW() WHERE id = 1;
