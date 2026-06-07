# EPIS2 — Higiene tramos A–K

**Fecha:** 2026-06-07 · **Gate:** `npm run quality:tramos-hygiene-gate`

---

## Checklist por tramo

| Tramo | Cierre | Gate closure |
|-------|--------|--------------|
| **A–K** | ver plan maestro | `quality:tramo-*-closure-gate` |

**Plan maestro:** [`EPIS2_TRAMOS_EXECUTION_MASTER.md`](./EPIS2_TRAMOS_EXECUTION_MASTER.md)

---

## Gates de verificación

```bash
npm run quality:tramos-hygiene-gate
npm run quality:tramos-run-ak-closure-gates
npm run quality:tramos-signoff-prep-gate
npm run quality:golden-journey
```

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
