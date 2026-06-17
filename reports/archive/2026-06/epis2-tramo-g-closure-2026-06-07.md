# EPIS2 — Cierre Tramo G (2026-06-07)

## Alcance

**MF-TRAMO-G-CLOSURE** — scaffold UCI especializada IDC 131–140 cerrado técnicamente en tablero UCI existente (`tab=icu`).

---

## Entregables

| Item | Evidencia |
|------|-----------|
| Doc cierre | `EPIS2_TRAMO_G_CLOSURE.md` |
| Inventario | `EPIS2_TRAMO_G_UCI_SPECIALIZED_INVENTORY.md` |
| Gates G | `quality:tramo-g-*-gate` (inventory · specialized · scaffold · audit · closure) |
| E2E | `e2e/tramo-g-icu.spec.ts` |
| Matriz IDC | overrides 131–140 Active (MF-TRAMO-G-002 … G-010) |
| Navigation | `dashboard-icu` idcRefs 131–140 |

---

## Gates sesión

```bash
node scripts/product/generate-idc-matrix.mjs
npm run quality:tramo-g-inventory-gate
npm run quality:tramo-g-specialized-gate
npm run quality:tramo-g-scaffold-gate
npm run quality:tramo-g-audit-gate
npm run quality:tramo-g-closure-gate
npm run quality:tramos-hygiene-gate
npm run check && npm run test && npm run db:validate
npm run quality:golden-journey
```

---

## Estado global

| Tramo | Estado |
|-------|--------|
| A–G | ✅ Cerrados técnicamente |
| Signoff clínico | Pendiente institucional |

**Matriz IDC:** 131–140 UCI especializada Active (demo scaffold)

---

## Riesgos

| Riesgo | Mitigación |
|--------|------------|
| Paneles 136/137 sin casos demo | Empty state intencional; signoff clínico define flujo legal |
| IDC 135 en bloque specialized | Coherente con Tramo D hemodinámica; chip único en UI |

---

## Próximo paso

Signoff A–G · IAAS 141–150 · especialidades gráficas

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
