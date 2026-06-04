-- Tabla meta para validar migraciones en bootstrap
CREATE TABLE IF NOT EXISTS epis2_schema_meta (
  id          SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  version     TEXT NOT NULL,
  applied_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO epis2_schema_meta (version)
VALUES ('epis2-01-bootstrap')
ON CONFLICT (id) DO NOTHING;
