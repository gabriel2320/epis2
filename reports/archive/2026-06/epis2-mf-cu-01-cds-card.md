# MF-CU-01 — Componente ClinicalCdsCard

**Fecha cierre:** 2026-06-14 · **Programa:** PROG-STRENGTHEN · **Subprograma:** PROG-CDS-UX fase 1  
**Gate:** `npm run check` ✓ · unit test `ClinicalCdsCard.test.tsx` ✓

---

## Alcance

Tarjeta compacta estilo CDS Hooks (sin servidor CDS externo) con variantes MUI **info**, **suggestion** y **warning**. Base reutilizable para MF-CU-02 (patient-view hook). **No** integrada aún en ficha — eso es MF-CU-02.

## Entregables

| Artefacto | Descripción |
|-----------|-------------|
| `ClinicalCdsCard.tsx` | Alert MUI outlined/standard + badges variante y origen CDS/CDR |
| `ClinicalCdsCard.test.tsx` | Unit test variantes, detalle, acción clickable |
| `ClinicalCdsCard.stories.tsx` | Storybook espejo visual en epis2-ui |
| `copy.cdsCard` | Microcopy ES (variantes, hint no bloqueante) |
| `index.ts` | Barrel export del módulo cds |

## Variantes (CDS Hooks style)

| Variante | MUI | Uso demo |
|----------|-----|----------|
| `info` | `Alert severity="info" variant="outlined"` | Gaps, alergias documentadas |
| `suggestion` | `Alert severity="info" variant="standard"` | Pista accionable (comando sugerido) |
| `warning` | `Alert severity="warning" variant="outlined"` | Alertas CDS/CDR no bloqueantes |

## Compatibilidad

`ClinicalSilentSuggestionsPanel` (MF-DI-06) sigue consumiendo `ClinicalCdsCard` sin cambios de API; el click en etiqueta accionable se mantiene para E2E existente.

## Gates

```bash
npx vitest run apps/web/src/components/cds/ClinicalCdsCard.test.tsx
npx vitest run apps/web/src/components/cds/ClinicalSilentSuggestionsPanel.test.tsx
npm run check
```

## Próximo paso

**MF-CU-02** — Hook patient-view: cards al abrir ficha (`quality:cds-hooks-gate`).

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
