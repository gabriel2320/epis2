# PROG-CORE-LABS-FW — Cierre (PR-CL)

**Fecha:** 2026-06-16 · **Programa:** PROG-CORE-LABS-FW · **Congelamiento:** vigente

---

## Entregables

| ID | Entrega | Estado |
|----|---------|--------|
| CL-01 | Gate `quality:core-no-labs-imports-gate` | ✓ |
| CL-02 | `scripts/architecture/core-labs-boundary.mjs` + `monorepo-governance` | ✓ |
| CL-03 | `apps/api/package.json` sin workspace deps labs | ✓ (ya limpio) |
| CL-04 | Documentación frontera en `MONOREPO_GOVERNANCE.md` | ✓ |
| CL-05 | Brújula: deuda staging documentada | ✓ |

---

## Alcance del gate

**Falla si** `apps/web`, `apps/api` o `packages/*`:

- declaran `@epis2/clinical-case-intel` o `@epis2/drug-intel` en deps
- importan esos paquetes o rutas `services/clinical-case-intel|drug-intel`

**Permitido (documentado):** tablas staging en `apps/api` schema · rutas `/api/admin/drug-intel` · tipos en `@epis2/contracts`.

---

## Verificación

```bash
npm run quality:core-no-labs-imports-gate
npm run architecture:validate
npm run quality:fast
```

---

## Siguiente

**PROG-DEMO-SAFETY** (PR-DS) — banner global + gate anti-PHI unificado.
