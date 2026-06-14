# MF-IC-04 — HL7 quarantine hardening + runbook

**Fecha cierre:** 2026-06-15 · **Programa:** PROG-STRENGTHEN · **Subprograma:** PROG-INTEROP-CHILE fase 4  
**Gate:** `npm run db:validate` ✓ · tests migración + integración HL7

---

## Alcance

Endurecer evidencia operativa de cuarentena HL7 (MF-180…182): tests de migración `031`, runbook ops, verificación `db:validate`. Sin cambio de flujo clínico — borrador ≠ SoT.

## Entregables

| Artefacto | Descripción |
|-----------|-------------|
| `database/tests/migration-hl7-quarantine.test.mjs` | Hardening CHECK, índice, FK, sin INSERT SoT |
| `docs/ops/HL7_INTEROP_INGESTION_RUNBOOK.md` | Runbook ingestión cuarentena |
| `database/migrations/031_hl7_quarantine.sql` | Comentario runbook MF-IC-04 |

## Gates

```bash
npm run db:validate
npx vitest run database/tests/migration-hl7-quarantine.test.mjs
npm run test -- apps/api/src/interop/hl7.integration.test.ts  # con DATABASE_URL
npm run quality:strengthen-close-gate
```

## Cierre programa

**PROG-STRENGTHEN** 23/23 → [`epis2-prog-strengthen-close-2026.md`](./epis2-prog-strengthen-close-2026.md)

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
