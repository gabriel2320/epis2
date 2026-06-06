# Reporte — Simetría y encuadre MD3 (EPIS2)

**Fecha:** 2026-06-07  
**Alcance:** tokens de layout M3, footer clínico, ritmo vertical de formularios, touch target 48dp  
**Canon:** `docs/design/EPIS2_M3_SYMMETRY_AND_FRAMING.md`

---

## Cambios

| Área | Antes | Después |
|------|-------|---------|
| Espaciado isla | `sm: 3.5` (28dp, fuera de grid) | 24dp / 32dp (`epis2M3IslandPadding`) |
| Filas de campo | 24dp (`fieldStackGap: 3`) | **16dp** |
| Secciones formulario | 28dp (`spacing={3.5}`) | **32dp** |
| Label → campo | 10dp (`spacing={1.25}`) | **8dp** |
| Botones | `minHeight: 40` | **48dp** (MD3 touch target) |
| Inputs clínicos | `minHeight: 40` | **48dp** |
| Footer formulario | apilado / sin alinear | `EpisClinicalFormFooter` — derecha, gap 8dp |
| Jerarquía botones | dos `contained` posibles | `appearance` filled + outlined |

## Archivos

- `packages/epis2-ui/src/theme/m3-layout-tokens.ts` (+ test)
- `packages/epis2-ui/src/forms/EpisClinicalFormFooter.tsx`
- `packages/epis2-ui/src/forms/EpisClinicalForm.tsx`
- `packages/epis2-ui/src/forms/EpisClinicalTwoPaneLayout.tsx`
- `packages/epis2-ui/src/forms/clinical-field-layout.tsx`
- `packages/epis2-ui/src/theme/components.ts`
- `packages/epis2-ui/src/theme/island-layout.ts`
- `packages/epis2-ui/src/theme/breakpoints.ts`
- `packages/epis2-ui/src/clinical/EpisApprovalGate.tsx`
- `apps/web/src/pages/GeneratedClinicalFormPage.tsx`

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK |
| `npm run test` | OK — 370 tests |
| `npm run theme:validate` | OK |
| `npm run db:validate` | OK — 31 migraciones |
| `architecture:validate` | OK (incluido en check) |

## Riesgos

- Formularios siguen con campos `fullWidth` hasta fase 2 (`columnSpan` en blueprint).
- Cambio de ritmo vertical (16dp entre campos) puede percibirse más compacto en formularios largos.

## Próximo paso

1. Ejecutar gates y actualizar tabla anterior.
2. Añadir `columnSpan` a blueprints de signos vitales / datos demográficos.
3. Pasada visual `npm run quality:m3-visual-pass` en formularios con footer.
