# EPIS2 — Higiene tramos A–E

**Fecha:** 2026-06-07 · **Gate:** `npm run quality:tramos-hygiene-gate`

---

## Alcance

Sanear fases A–E ya cerradas técnicamente: documentación simétrica, gates registrados, auditorías obsoletas marcadas, plan maestro como índice único.

---

## Checklist por tramo

| Tramo | Cierre | Gate closure | Inventario / plan |
|-------|--------|--------------|-------------------|
| **A** | `EPIS2_TRAMO_A_CLOSURE.md` | `quality:tramo-a-closure-gate` | Olas 2–3 + 6A |
| **B** | `EPIS2_TRAMO_B_CLOSURE.md` | `quality:tramo-b-closure-gate` | `EPIS2_TRAMO_B_RECEPTION_INVENTORY.md` |
| **C** | `EPIS2_TRAMO_C_CLOSURE.md` | `quality:tramo-c-closure-gate` | `EPIS2_TRAMO_C_PLAN.md` |
| **D** | `EPIS2_TRAMO_D_CLOSURE.md` | `quality:tramo-d-closure-gate` | `EPIS2_TRAMO_D_PLAN.md` · inventario UCI |
| **E** | `EPIS2_TRAMO_E_CLOSURE.md` | `quality:tramo-e-closure-gate` | `EPIS2_TRAMO_E_PLAN.md` · inventario OR |

**Plan maestro:** [`EPIS2_TRAMOS_EXECUTION_MASTER.md`](./EPIS2_TRAMOS_EXECUTION_MASTER.md)

---

## Gates de verificación

```bash
npm run quality:tramos-hygiene-gate
npm run quality:tramo-a-closure-gate
npm run quality:tramo-b-closure-gate
npm run quality:tramo-c-closure-gate
npm run quality:tramo-d-closure-gate
npm run quality:tramo-e-closure-gate
npm run quality:golden-journey
```

---

## Documentos superseded (histórico)

| Documento | Motivo |
|-----------|--------|
| `reports/epis2-audit-2026-06-07.md` | Métricas pre-cierre A–E |
| `reports/epis2-audit-reconcile-2026-06-07.md` | Conciliación pre-Tramo E |
| `reports/epis2-tramos-abcd-execution-2026-06-07.md` | Solo A–D; ver reporte A–E |

**Fuente de verdad actual:** plan maestro + cierres por tramo + matriz IDC regenerada.

---

## Reglas de higiene (agentes)

1. No marcar tramo `Done` clínico sin signoff institucional — usar **Cerrado técnicamente**.
2. Home = `/comando` — prohibido dashboard/recepción como home en docs nuevos.
3. Actualizar matriz IDC vía `generate-idc-matrix.mjs`, no editar JSON a mano.
4. Al cerrar tramo: closure doc + closure gate + entrada en plan maestro + reporte `reports/`.

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
