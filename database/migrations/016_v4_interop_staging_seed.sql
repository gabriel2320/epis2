-- EPIS2 V4: lote demo staging HL7/FHIR (sin aplicar a SoT)

INSERT INTO interop_staging_batches (id, source_system, batch_label, status, record_count, notes, created_by)
VALUES
  (
    'f1000001-0000-4000-8000-000000000001',
    'HL7v2-ADT',
    'ADT^A01 demo — ingreso sintético (no aplicado)',
    'validated',
    2,
    'Solo lectura; no escribe patients/encounters.',
    'usr-physician-01'
  ),
  (
    'f1000001-0000-4000-8000-000000000002',
    'FHIR-Bundle',
    'Bundle externo demo — 5 recursos (no aplicado)',
    'staged',
    5,
    'Importación diferida; export EPIS2 sigue siendo SoT.',
    'usr-physician-01'
  )
ON CONFLICT (id) DO NOTHING;
