# EPIS2 — Runbook ingestión HL7 (cuarentena)

**Microfases:** MF-180…182 · **MF-IC-04** (hardening)  
**Migración:** `031_hl7_quarantine.sql` · tabla `interop_hl7_quarantine`  
**Mapa pantallas:** [`EPIS2_SCREEN_CONNECTION_MAP.md`](../product/EPIS2_SCREEN_CONNECTION_MAP.md)

---

## Objetivo

Ingerir mensajes HL7 v2 **sin escribir SoT clínico directamente**. Todo mensaje válido entra en **cuarentena**; el writeback propone **borrador** (`clinical_drafts`) que requiere aprobación humana.

**Prohibido:** INSERT directo en `clinical_notes` desde ingestión HL7.

---

## Flujo operativo

```text
POST /api/interop/hl7/validate     → validación read-only (sin persistir)
POST /api/interop/hl7/quarantine   → stage en interop_hl7_quarantine
GET  …/quarantine/:id/mapping      → preview mapeo (status → mapped)
POST …/propose-writeback           → clinical_drafts (status draft)
POST …/revert                      → cancela borrador propuesto + status reverted
```

Permiso API: `audit.read` (rol auditor demo en entorno sintético).

---

## Estados de cuarentena

| status | Significado |
|--------|-------------|
| `quarantine` | Intake inicial |
| `mapped` | Preview generado |
| `writeback_proposed` | Borrador clínico creado (no aprobado) |
| `reverted` | Operador revirtió — sin commit SoT |
| `rejected` | Rechazado explícitamente (reservado) |

---

## Despliegue / verificación

1. Migraciones: `npm run db:migrate`
2. Validar SQL + checksums Chile:

```bash
npm run db:validate
npx vitest run database/tests/migration-hl7-quarantine.test.mjs
```

3. Smoke integración (requiere `DATABASE_URL`):

```bash
npm run stack:dev
npm run test -- apps/api/src/interop/hl7.integration.test.ts
```

4. UI demo (opcional): tab Calidad → «Cuarentena HL7» (`QualityDashboardTab`).

---

## Auditoría

Eventos esperados en trazabilidad:

- `interop.hl7.quarantined` — intake
- `interop.hl7.writeback_proposed` — borrador propuesto
- `interop.hl7.reverted` — reversión sin SoT

---

## Errores comunes

| Síntoma | Causa | Acción |
|---------|-------|--------|
| HTTP 400 en intake | HL7 malformado | Corregir mensaje; no entra a cuarentena |
| HTTP 503 | Postgres caído | `npm run stack:dev` |
| Writeback sin paciente | Demo sin pacientes seed | `npm run db:migrate` + seed MAR |
| Borrador no es nota aprobada | By design | Flujo approve humano en UI clínica |

---

## Referencias

- [`HL7_MAPPING.md`](../interop/HL7_MAPPING.md)
- [`epis2-mf-180-hl7-quarantine.md`](../../reports/epis2-mf-180-hl7-quarantine.md)
- [`epis2-mf-ic-04-hl7-quarantine-hardening.md`](../../reports/epis2-mf-ic-04-hl7-quarantine-hardening.md)
