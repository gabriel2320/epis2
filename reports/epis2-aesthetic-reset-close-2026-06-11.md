# EPIS2 — PROG-AESTHETIC-RESET cierre parcial (Fases 1–3)

**Fecha:** 2026-06-11  
**Alcance:** Shell clínico mínimo · búsqueda paciente · ficha clásica tabulada  
**Sin commit** — pendiente revisión visual en navegador.

## Objetivo

Eliminar contradicción visual dashboard/deprecado, reducir capas de navegación y consolidar flujo **Censo → Ficha → Papel** con CICA.

## Entregado

### FASE 1 — Shell global limpio ✓

| Cambio | Archivo |
|--------|---------|
| `ClinicalNavStrip` — Censo · Buscar · Ficha · Papel · Más + contexto DEMO | `apps/web/src/layouts/ClinicalNavStrip.tsx` |
| Shell mínimo dual ficha para todo `/espacio/*` | `apps/web/src/layouts/ClinicalShellLayout.tsx` |
| Top bar delega en nav clínica | `apps/web/src/layouts/ClinicalGlobalTopBar.tsx` |
| `EpisModeSwitcher` oculto en dual ficha | `apps/web/src/components/modes/EpisModeSwitcher.tsx` |
| Rail labels cortos | `apps/web/src/navigation/epis2NavigationRail.tsx` |

### FASE 2 — Patient Search ✓

| Cambio | Archivo |
|--------|---------|
| Pantalla dedicada + nav unificada | `apps/web/src/pages/PatientSearchScreen.tsx` |

### FASE 3 — Ficha clásica / resumen ✓

| Cambio | Detalle |
|--------|---------|
| `ClassicChartSummaryPanel` | 5 bloques: diagnósticos · evolución · indicaciones · exámenes · documentos |
| `TraditionalEhrMode` | `cicaLayout` activa panel tabulado; sin CDS duplicado |
| `DualChartPatientPage` | `cica-minimal` + `ClinicalContextDenseStrip` bajo identidad |
| `ClinicalShell` | Context strip visible también en composición minimal |
| `resolveCicaTabLayoutActions` | Resumen: primaria evolución + papel secundaria (sin botón labs extra) |
| Gate | `classic-chart-composition-gate` ampliado (panel 5 bloques, cica-minimal) |
| E2E | `aesthetic-classic-mode.spec.ts` — identity band + 5 bloques + primaria evolución |

## Gates verdes

```bash
npm run quality:gate -- quality:classic-shell-layout-gate
npm run quality:gate -- quality:classic-chart-composition-gate
npm run quality:gate -- quality:clinical-layout-engine-gate
npm run quality:gate -- quality:patient-search-layout-gate
npm run quality:gate -- quality:aesthetic-reset-close-gate
npm run typecheck -w @epis2/web
```

## Pendiente (Fases 4–6)

1. **Formularios** — revisar `ClinicalLayoutActionBar` en evolución, indicaciones, receta, documentos (base CICA-L ya existe).
2. **Modo papel** — verificar UX amplia en `/espacio/ficha/papel` (MF-AEST-03).
3. **Screenshots** antes/después en `reports/cica-l/`.
4. **E2E transversal** — specs con `epis2-census-command-bar` obsoleto en censo.

## Verificación visual recomendada

1. `/espacio/buscar-paciente` → nav clínica, sin switcher deprecado
2. Abrir DEMO-001 → banda identidad + context strip + tabs clínicos
3. Tab **Resumen** → 5 bloques tabulados, acción primaria **Nueva evolución**
4. **Más → Tablero** solo si necesitas modo secundario

**Commit sugerido (cuando apruebes):**  
`fix(aesthetic): rebuild classic clinical layout with cica engine`
