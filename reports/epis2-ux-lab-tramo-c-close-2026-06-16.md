# PROG-UX-LAB — Tramo C cierre parcial (MF-UXLAB-02)

**Fecha:** 2026-06-16 · **Programa:** PROG-UX-LAB · **Microfase:** MF-UXLAB-02  
**Plan:** [`EPIS2_UX_LAB_MODERN_PLAN.md`](../docs/quality/EPIS2_UX_LAB_MODERN_PLAN.md)  
**Depende:** Tramo B (MF-UXLAB-01) — PR #30

---

## Alcance entregado

Capa 3 — confianza visual (slice 1):

| Entregable | Archivo |
|------------|---------|
| Watermark borrador/aprobado en papel | `apps/web/src/components/chart/paper/PaperDocumentWatermark.tsx` |
| Integración plantilla | `PaperChartTemplate.tsx` — prop `documentStatus` |
| Estado desde borrador papel | `PaperChartMode.tsx` — `signed` cuando `readOnly` |
| Chip borrador en chrome paciente | `ClinicalPatientChartChrome.tsx` — `EpisDraftStatus` + API drafts |
| Copy watermark aprobado | `packages/design-system/src/copy/es.ts` — `paperWatermarkSigned` |
| Tests watermark | `PaperChartTemplate.test.tsx` |

**Pendiente Tramo C (slice 2):** consolidación chips en `PatientIdentityBand`, print/preview regresión E2E m3, `quality:m3-human-pilot`.

---

## Gates

| Gate | Resultado |
|------|-----------|
| `quality:fast` | ✓ OK |
| `format:check` | ✓ (prettier local) |
| `quality:m3-human-pilot` | defer slice 2 |
| E2E watermark en dual-chart | ✓ assertions en `dual-chart-modes.spec.ts` (b, h-alt) |
| Fix flaky g6 receta | ✓ `fillMinimalPrescriptionDraft` — gate en campo medicamento |

---

## Próximo paso

Slice 2 MF-UXLAB-02: E2E papel watermark + `EpisAiDisclosure` degradación en command bar; luego Tramo D (MF-UXLAB-03).
