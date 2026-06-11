-- MF-SUMMARY-VIEW-01: read model resumen clínico (vista SQL)

CREATE OR REPLACE VIEW patient_clinical_summary AS
SELECT
  p.id AS patient_id,
  p.display_name,
  p.birth_date,
  p.sex,
  EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.birth_date))::integer AS edad_anios,
  cov.prevision_resumen,
  (
    SELECT string_agg(a.substance, ' · ' ORDER BY a.severity DESC, a.substance)
    FROM patient_allergies a
    WHERE a.patient_id = p.id AND a.status = 'active' AND a.severity IN ('severe', 'moderate')
    LIMIT 5
  ) AS alergias_criticas,
  (
    SELECT string_agg(pr.description, ' · ' ORDER BY pr.created_at DESC)
    FROM problems pr
    WHERE pr.patient_id = p.id AND pr.status = 'active'
    LIMIT 5
  ) AS problemas_activos,
  (
    SELECT string_agg(m.name || COALESCE(' ' || m.dose_text, ''), ' · ' ORDER BY m.started_at DESC NULLS LAST)
    FROM patient_medications m
    WHERE m.patient_id = p.id AND m.status = 'active'
    LIMIT 8
  ) AS medicamentos_activos,
  (
    SELECT MAX(e.started_at)
    FROM encounters e
    WHERE e.patient_id = p.id
  ) AS ultimo_encuentro_at,
  EXISTS (
    SELECT 1 FROM inpatient_admissions ia
    WHERE ia.patient_id = p.id AND ia.status = 'active'
  ) AS hospitalizado,
  NOW() AS refreshed_at
FROM patients p
LEFT JOIN LATERAL (
  SELECT
    CASE
      WHEN c.tipo_prevision = 'FONASA' AND c.fonasa_tramo IS NOT NULL
        THEN 'FONASA tramo ' || c.fonasa_tramo
      WHEN c.tipo_prevision = 'ISAPRE' AND c.isapre_nombre IS NOT NULL
        THEN 'ISAPRE ' || c.isapre_nombre
      ELSE c.tipo_prevision
    END AS prevision_resumen
  FROM patient_coverage c
  WHERE c.patient_id = p.id AND c.vigente_hasta IS NULL
  ORDER BY c.vigente_desde DESC
  LIMIT 1
) cov ON TRUE;

UPDATE epis2_schema_meta SET version = 'epis2-chile-summary-01', applied_at = NOW() WHERE id = 1;
