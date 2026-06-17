# MF-SH-06 — Control migraciones Chile 035–040

**Programa:** PROG-STRENGTHEN-2026 / PROG-CORE-HARDEN  
**Fecha:** 2026-06-14  
**Gate:** `npm run db:validate` · `npm run quality:sh-06-migration-gate`

## Alcance

- Manifest pinneado `scripts/db/chile-migrations-checksums.json` (SHA256 CRLF→LF)
- Validación integrada en `scripts/db-validate.mjs`
- Checksum compartido con `db:migrate` → tabla `epis2_schema_migrations`

## Migraciones controladas

| # | Archivo | schema meta |
|---|---------|-------------|
| 035 | `chile_patient_identifiers` | `epis2-chile-id-01` |
| 036 | `chile_patient_coverage` | `epis2-chile-adm-01` |
| 037 | `chile_patient_clinical_summary` | `epis2-chile-summary-01` |
| 038 | `chile_episodes_of_care` | `epis2-chile-episode-01` |
| 039 | `chile_professionals` | `epis2-chile-pro-01` |
| 040 | `chile_audit_extend` | `epis2-chile-audit-01` |

## Evidencia

| Check | Resultado |
|-------|-----------|
| `npm run db:validate` | ✓ checksums 035–040 |
| `migration-chile-control.test.mjs` | ✓ 8/8 |
| Tabla control | ✓ `epis2_schema_migrations` (db:migrate) |

## Comandos

```bash
npm run db:validate
npm run quality:sh-06-migration-gate
npm run quality:strengthen-next
```

## Próximo paso

**MF-IM-01** — embeddings pgvector 384d (PROG-IA-MODERNIZE) u **MF-IC-04** cuando IC-03 cierre.
