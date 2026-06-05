-- EPIS2 V1 Plan C: pgvector + chunks documentales (sin sidecar SoT)

CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE clinical_documents
  ADD COLUMN IF NOT EXISTS text_content TEXT,
  ADD COLUMN IF NOT EXISTS intake_status TEXT NOT NULL DEFAULT 'indexed'
    CHECK (intake_status IN ('staged', 'ocr_pending', 'indexed', 'failed'));

CREATE TABLE IF NOT EXISTS clinical_document_chunks (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id   UUID NOT NULL REFERENCES clinical_documents(id) ON DELETE CASCADE,
  patient_id    UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  chunk_index   INTEGER NOT NULL DEFAULT 0,
  chunk_text    TEXT NOT NULL,
  embedding     vector(128),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (document_id, chunk_index)
);

CREATE INDEX IF NOT EXISTS idx_doc_chunks_patient ON clinical_document_chunks (patient_id);
CREATE INDEX IF NOT EXISTS idx_doc_chunks_embedding_hnsw
  ON clinical_document_chunks USING hnsw (embedding vector_cosine_ops);

UPDATE epis2_schema_meta SET version = 'epis2-v1-pgvector', applied_at = NOW() WHERE id = 1;
