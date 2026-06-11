# MF-CM-02 — Ctrl+K + barra: misma resolución NL

**Fecha:** 2026-06-11 · **Estado:** DONE  
**Programa:** PROG-BARRA-COMANDO · **Gate:** `quality:cm-02-palette-gate`

## Alcance

Paleta clínica Ctrl+K comparte resolución NL con la barra universal: mismo `submit()` vía `useClinicalCommandSubmit`, búsqueda fuzzy por tokens, Enter con texto libre.

## Evidencia

| Requisito | Implementación |
|-----------|----------------|
| Palette `submit(text)` = barra | `ClinicalShellCommandPalette` → `runCommand` → `submit`; ítems usan `clinicalCommandTextForDefinition` |
| Búsqueda fuzzy | `filterClinicalCommandPaletteItems` + scoring por tokens |
| E2E Ctrl+K traditional + paper | `e2e/dual-chart-modes.spec.ts` tests k) l) |
| Enter NL libre | `onSubmitNaturalLanguage={runCommand}` en paleta |

## Archivos

- `packages/clinical-productivity/src/components/filterClinicalCommandPaletteItems.ts`
- `packages/clinical-productivity/src/components/ClinicalCommandPalette.tsx`
- `apps/web/src/clinical/buildClinicalCommandPaletteItems.ts` — export `clinicalCommandTextForDefinition`
- `apps/web/src/components/ClinicalShellCommandPalette.tsx`

## Verificación

```bash
npm run quality:cm-02-palette-gate
npm run test -- packages/clinical-productivity/src/components/filterClinicalCommandPaletteItems.test.ts
npm run test -- apps/web/src/clinical/buildClinicalCommandPaletteItems.test.ts
# E2E (stack dev + VITE_ENABLE_DUAL_CHART_MODES=true):
npm run test:e2e:ux-g02  # o dual-chart spec en CI opt-in
```

## Próximo paso

**MF-CM-03** — assist-route + hint IA en barra (`ai:evals:live`).
