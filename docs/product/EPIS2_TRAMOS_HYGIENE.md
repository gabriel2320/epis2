# EPIS2 — Higiene tramos A–I

**Fecha:** 2026-06-07 · **Gate:** `npm run quality:tramos-hygiene-gate`

---

## Checklist por tramo

| Tramo | Cierre | Gate closure |
|-------|--------|--------------|
| **A–H** | ver plan maestro | `quality:tramo-*-closure-gate` |
| **I** | `EPIS2_TRAMO_I_CLOSURE.md` | `quality:tramo-i-closure-gate` |

**Plan maestro:** [`EPIS2_TRAMOS_EXECUTION_MASTER.md`](./EPIS2_TRAMOS_EXECUTION_MASTER.md)

---

## Gates de verificación

```bash
npm run quality:tramos-hygiene-gate
npm run quality:tramo-i-closure-gate
npm run quality:golden-journey
```

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
