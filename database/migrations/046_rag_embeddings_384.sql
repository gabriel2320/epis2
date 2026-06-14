-- MF-IM-01: pgvector 384d para RAG (dual-read con legacy embedding 128d)

ALTER TABLE clinical_document_chunks
  ADD COLUMN IF NOT EXISTS embedding_384 vector(384);

DROP INDEX IF EXISTS idx_doc_chunks_embedding_384_hnsw;

CREATE INDEX idx_doc_chunks_embedding_384_hnsw
  ON clinical_document_chunks USING hnsw (embedding_384 vector_cosine_ops);

UPDATE epis2_schema_meta SET version = 'epis2-rag-embeddings-384', applied_at = NOW() WHERE id = 1;
