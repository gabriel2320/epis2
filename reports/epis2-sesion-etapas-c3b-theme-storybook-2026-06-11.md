# EPIS2 — Sesión etapas C-3b · theme clinical · Storybook

**Fecha:** 2026-06-11 · **Hilo:** C (Ola 3) · **Alcance:** 3 etapas secuenciales sin conflicto

## Etapa 1 — Entrega C-3b (MF-CLINICAL-SUMMARY-B)

| Ítem | Estado |
|------|--------|
| `clinicalSummaryData.ts` — zonas meds, labs, alergias | ✓ |
| `ClinicalSummaryStickyBanner` — chips críticos + alergias | ✓ |
| `PatientClinicalSummaryGrid` — integración zonas + labs highlight | ✓ |
| `EpisClinicalSummaryCard` — `highlightValue` / `highlightMeta` | ✓ |
| Copy ES (`medsActiveZone`, `labsHighlight`, …) | ✓ |
| Tests unitarios + grid | ✓ |

**Archivos:** `apps/web/src/components/clinical-summary/*`

## Etapa 2 — Deuda theme: hex → `theme/clinical/`

| Ítem | Estado |
|------|--------|
| `chart-modes-colors.ts` (allowlist) | ✓ |
| `chart-modes-tokens.ts` sin hex directo | ✓ |
| `ClinicalInstitutionalHeader` → `onInstitutional` | ✓ |
| `PatientIdentityBand` → `onInstitutional` | ✓ |
| `ChartModesPreview.stories` sin hex | ✓ |
| `npm run theme:validate` | verificar en cierre |

## Etapa 3 — Storybook + signoff scaffold (C-2.4)

| Ítem | Estado |
|------|--------|
| Story `Ficha/Resumen clínico MD3` → `GridScaffold` | ✓ |
| Doc `EPIS2_CLINICAL_SUMMARY_MD3.md` C-3b | ✓ |
| Tablero C-3 actualizado | ✓ |

**Signoff humano C-2.4:** capturas 6 superficies — sigue **NO-GO** (no bloquea C-3b).

## Gates

```bash
npx vitest run apps/web/src/components/clinical-summary/
npm run check
npm run theme:validate
```

## Riesgos

- Pulido Calm Premium (radii 20px) **no** aplicado — conflicto con forma cuadrada E3.
- `VITE_ENABLE_DUAL_CHART_MODES` sigue off en prod (C-4).

## Próximo paso

1. C-2.4 capturas manuales + matriz GO en `reports/m3-visual-evidence/`
2. THEME-CALM-01 fondo `#F7F9FC` vía tema (no hex en componentes)
3. Decisión humana activación prod dual-chart (C-4)
