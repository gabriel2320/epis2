# EPIS2 — Cierre Tramo J (2026-06-07)

## Alcance

**MF-TRAMO-J-CLOSURE** — scaffold farmacia clínica IDC 161–170 cerrado técnicamente (`tab=pharmacy`).

---

## Entregables

| Item | Evidencia |
|------|-----------|
| Tab + API | `/epis2/dashboard?tab=pharmacy` · `/api/dashboard/pharmacy` |
| UI | `PharmacyDashboardTab` — Y-Site, TDM, RAM, conciliación, stock |
| Matriz IDC | 161–170 Active (165 Done core + panel J-006) |
| E2E | `e2e/tramo-j-pharmacy.spec.ts` |

---

## Gates sesión

```bash
node scripts/product/generate-idc-matrix.mjs
npm run quality:tramo-j-closure-gate
npm run quality:tramos-hygiene-gate
npm run check && npm run test && npm run db:validate
npm run quality:golden-journey
```

---

## Riesgos

| Riesgo | Mitigación |
|--------|------------|
| Datos demo, no integración ERP farmacia | Signoff clínico antes de piloto |
| IDC 165 Done vs panel J | Panel scaffold; core conciliación intacto |

---

## Estado global

| Tramo | Estado |
|-------|--------|
| A–J | ✅ Cerrados técnicamente |
| Signoff clínico | Pendiente institucional |

---

## Próximo paso

Signoff A–J · calidad/auditoría 171–180 · piloto institucional

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
