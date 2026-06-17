# MF-CU-04 — API `/cds/cards` interno

**Fecha cierre:** 2026-06-15 · **Programa:** PROG-STRENGTHEN · **Subprograma:** PROG-CDS-UX fase 4  
**Gate:** `quality:cds-hooks-gate` ✓

---

## Alcance

API interna unificada estilo CDS Hooks: prefetch de paciente vía PostgreSQL demo (`getDemoClinicalAlertsForPatient`), mapeo por hook (`patient-view` | `order-select`). Sin servidor FHIR CDS externo.

## Entregables

| Artefacto | Descripción |
|-----------|-------------|
| `packages/contracts/src/cdsCards.ts` | Schemas Zod request/response + tipos exportados |
| `apps/api/src/routes/cds/routes.ts` | `GET /api/cds/cards/:patientId` · `POST /api/cds/cards` |
| `cards.integration.test.ts` | Test DEMO-005 GET+POST ambos hooks |
| `validate-cds-hooks-gate.mjs` | Gate MF-CU-02 + CU-03 + CU-04 |

## Contrato API

**GET** `/api/cds/cards/:patientId?hook=patient-view|order-select&blueprintId=&fields=`

**POST** `/api/cds/cards` — body `{ patientId, hook, blueprintId?, fields?, prefetch? }`

**Response:** `{ patientId, readOnly: true, evaluatedAt, hook, cards[] }`

## Gates

```bash
npm run quality:cds-hooks-gate
npm run check
```

## Próximo paso

**PROG-CDS-UX** ✓ cerrado (MF-CU-01…04) · **MF-IC-01** interop Chile (BLOCKED).

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
