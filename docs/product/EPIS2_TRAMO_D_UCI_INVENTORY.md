# EPIS2 — Inventario UCI Tramo D (IDC 41–50, 131–140)

**MF-TRAMO-D-001** · **Fecha:** 2026-06-07  
**Workspace:** `icu` · **Ola:** 13

---

## Tensión semántica IDC 41

| IDC 41 | Significado | Estado |
|--------|-------------|--------|
| Dashboard monitorización UCI | Pantalla UCI (Tramo D) | **Defer** Future |
| Ingreso clínico | Blueprint `admission_note` | **Complete** — ver glosario árbol |

---

## IDC 41–50 — UCI dashboard (Defer Tramo D)

| IDC | Nombre | Decisión | Nota |
|-----|--------|----------|------|
| 41 | Dashboard monitorización UCI | Defer | Duplica 131–140 |
| 42 | Sábana clínica | Defer | Blueprint `transfer_note` ≠ IDC 42 |
| 50 | Epicrisis traslado UCI | Defer | Ola 13 |
| 131 | Prueba ventilación espontánea | Defer | UCI especializada |
| 140 | Protocolo decúbito prono | Defer | UCI especializada |

---

## IDC 131–140 — UCI especializada (Defer)

Nutrición · terapias renales · hemodinámica · muerte encefálica · procuramiento · humanización · delirium · prono — **Defer Future**.

---

## Workspace EPIS2 hoy

- Rail `icu` **habilitado** — MF-TRAMO-D-002 (`/epis2/dashboard?tab=icu`).
- Tablero `IcuDashboardTab` — IDC 41 Active, sábana IDC 42, hemodinámica IDC 135.
- Entrega turno → `/espacio/enfermeria` (≠ dashboard UCI IDC 41 ingreso clínico).

---

## Gate

`npm run quality:tramo-d-inventory-gate`

---

## Plan

Ver [`EPIS2_TRAMO_D_PLAN.md`](./EPIS2_TRAMO_D_PLAN.md).
