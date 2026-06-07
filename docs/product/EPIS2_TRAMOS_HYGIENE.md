# EPIS2 — Higiene tramos A–J

**Fecha:** 2026-06-07 · **Gate:** `npm run quality:tramos-hygiene-gate`

---

## Checklist por tramo

| Tramo | Cierre | Gate closure |
|-------|--------|--------------|
| **A–I** | ver plan maestro | `quality:tramo-*-closure-gate` |
| **J** | `EPIS2_TRAMO_J_CLOSURE.md` | `quality:tramo-j-closure-gate` |

**Plan maestro:** [`EPIS2_TRAMOS_EXECUTION_MASTER.md`](./EPIS2_TRAMOS_EXECUTION_MASTER.md)

---

## Gates de verificación

```bash
npm run quality:tramos-hygiene-gate
npm run quality:tramo-j-closure-gate
npm run quality:golden-journey
```

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
