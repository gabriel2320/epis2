# EPIS2 — Fase B Lote 4 (procedimiento + cierre encuentro + farmacia)

**Fecha:** 2026-06-04  
**Ola:** 2 — Atención médica · **Tramo:** B productividad  
**Gates:** `check` · `test` · `db:validate` · `layers-integration-gate`

---

## Lote 4a — Blueprint procedimiento (IDC 57)

| Entregable | Detalle |
|------------|---------|
| Blueprint | `procedure_request` → `/espacio/procedimiento` |
| Comando | `request_procedure` — «solicitar endoscopia», «pedir biopsia», etc. |
| Migración | `033_procedure_request_draft_type.sql` |
| IA assist | `assistSchemas` + `draftPromptCatalog` |
| RAD | `clinical-form-procedure` → `done` |

---

## Lote 4b — Cierre encuentro operativo

| Capa | Cambio |
|------|--------|
| Formulario | `outpatient_visit.closeEncounter` (existente) |
| API | `approveDraft` cierra `encounters.status=closed` + auditoría |
| UI | `DraftReviewPage` banner `epis2-draft-encounter-closure` |

---

## Lote 4c — Farmacia RAD done

| Pantalla | Antes | Después |
|----------|-------|---------|
| `dashboard-pharmacy` | partial | **done** |
| Y-Site gate | fallaba `epis2-pharmacy-ysite-rows` | wrapper testid añadido |

---

## Gates

| Gate | Estado |
|------|--------|
| `npm run check` | OK |
| Tests blueprint + registry | OK |
| `quality:tramo-j-pharmacy-gate` | OK |
| `quality:layers-integration-gate` | OK |
| `npm run db:validate` | OK (33 migraciones) |

---

## Próximo lote (Fase B-05 / Ola 3)

1. CTAs vacíos ficha → alergia/problema (Fase C)
2. Nota procedimiento clínico (IDC 58+ — distinto de solicitud)
3. Commit acumulado RHF + árbol + B-04 bajo solicitud

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
