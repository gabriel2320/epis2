-- EPIS2 V1 Plan C: contenido indexable + chunks pgvector demo

UPDATE clinical_documents SET
  text_content = 'Informe laboratorio control HTA creatinina hemoglobina resultado estable demo',
  intake_status = 'indexed'
WHERE id = 'e0000001-0000-4000-8000-000000000001';

UPDATE clinical_documents SET
  text_content = 'Hemoglobina glicosilada HbA1c diabetes control metabólico resultado demo',
  intake_status = 'indexed'
WHERE id = 'e0000001-0000-4000-8000-000000000002';

UPDATE clinical_documents SET
  text_content = 'Nota alergia penicilina reacción cutánea documentada antecedente demo',
  intake_status = 'indexed'
WHERE id = 'e0000001-0000-4000-8000-000000000005';

INSERT INTO clinical_document_chunks (document_id, patient_id, chunk_index, chunk_text, embedding)
VALUES
  (
    'e0000001-0000-4000-8000-000000000001',
    'a0000001-0000-4000-8000-000000000001',
    0,
    'Informe laboratorio control HTA creatinina hemoglobina resultado estable demo',
    '[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.333333,0,0,0,0,0,0,0,0,0.333333,0,0,0,0,0,0,0.333333,0,0.333333,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.333333,0,0,0,0,0,0,0,0.333333,0,0,0.333333,0,0,0.333333,0,0,0,0,0,0,0,0,0,0,0,0.333333,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]'::vector
  ),
  (
    'e0000001-0000-4000-8000-000000000002',
    'a0000001-0000-4000-8000-000000000002',
    0,
    'Hemoglobina glicosilada HbA1c diabetes control metabólico resultado demo',
    '[0,0,0,0.353553,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.353553,0,0,0,0,0,0,0,0,0,0,0,0,0.353553,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.353553,0,0.353553,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.353553,0,0,0,0,0,0.353553,0,0,0,0,0,0,0,0,0,0,0,0.353553,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]'::vector
  ),
  (
    'e0000001-0000-4000-8000-000000000005',
    'a0000001-0000-4000-8000-000000000005',
    0,
    'Nota alergia penicilina reacción cutánea documentada antecedente demo',
    '[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.353553,0,0,0,0.353553,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.353553,0,0,0,0,0.353553,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.353553,0,0,0,0,0,0,0,0,0.353553,0,0,0,0,0,0,0,0,0,0,0.353553,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.353553,0]'::vector
  )
ON CONFLICT (document_id, chunk_index) DO NOTHING;
