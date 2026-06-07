# EPIS2 — MF-TRAMO-E-001/002 (pabellón scaffold)

**Fecha:** 2026-06-07

## MF-TRAMO-E-001 — Inventario

- `docs/product/EPIS2_TRAMO_E_OR_INVENTORY.md` — IDC 151–160
- `docs/product/EPIS2_TRAMO_E_PLAN.md`
- Gate `quality:tramo-e-inventory-gate`

## MF-TRAMO-E-002 — Workspace + tabla quirúrgica (IDC 151)

- Workspace **`or`** en Navigation Rail (8º espacio)
- Tab `/epis2/dashboard?tab=or` + API `/api/dashboard/or`
- `OrDashboardTab` — agenda quirúrgica demo
- Gate `quality:tramo-e-or-gate`
- E2E: `e2e/tramo-e-or.spec.ts`

## Próximo paso

MF-TRAMO-E-003 checklist OMS (IDC 152) · signoff clínico A–E

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
