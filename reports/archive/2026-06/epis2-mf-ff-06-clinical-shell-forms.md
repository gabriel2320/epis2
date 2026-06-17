# MF-FF-06 — ClinicalShell en formularios `/espacio/*`

**Programa:** PROG-FICHA-FIRST-2026  
**Fecha:** 2026-06-14  
**Gate:** `npm run quality:ficha-first-gate`

## Alcance

| Entrega | Detalle |
|---------|---------|
| Shell unificado | Todos los formularios bajo `clinicalLayoutRoute` → `ClinicalShellLayout` |
| Barra transversal | `ChartEspacioCommandDock` en censo y formularios con paciente activo |
| Modos alineados | `episModes` / `resolveModeRoute` → `EPIS2_CLINICAL_HOME` |
| E2E | `ux-g02`, `three-modes-journey`, helper `getTransversalCommandBar` |
| Canon | `PRODUCT_CANON.md` + `PRODUCT_INVARIANTS.md` censo-first |
| Legacy | `CommandCenterPage` marcada `@deprecated` (router redirect only) |

## Evidencia

| Check | Resultado |
|-------|-----------|
| `quality:ficha-first-gate` | ✓ MF-FF-01…06 |
| `episModes.test.ts` | ✓ censo = modo command |
| E2E helpers | ✓ barra census / espacio / ficha flotante |

## Nota classic

Modo classic MD3 usa shell mínimo (`epis2-clinical-shell-classic`) por diseño; barra transversal vive en ficha dual y formularios MD3 workspace.

## Comandos

```bash
npm run quality:ficha-first-gate
npm run dev:rapid -- --skip-audit
```

## Próximo programa

**MF-FF-00** — Conciliar canon censo-first (Ola 2). Ver [`EPIS2_FICHA_FIRST_DEV_PLAN.md`](../docs/product/EPIS2_FICHA_FIRST_DEV_PLAN.md).

```bash
npm run quality:ficha-first-next
npm run quality:ficha-first-gate
```
