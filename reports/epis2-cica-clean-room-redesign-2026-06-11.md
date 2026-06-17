# EPIS2 — CICA Clean Room Redesign (cierre PR1)

**Fecha:** 2026-06-11  
**Alcance:** SDEPIS2 · CICA Clean Room Foundation (PR1)  
**Veredicto:** **PASS WITH FIXES** — foundation lista; PR2–PR6 pendientes

## Principio aplicado

> El legacy dona datos y contratos; **no** dona composición visual.

Nueva raíz `/app/*` con `VITE_ENABLE_CICA_UI=true` (default ON). Legacy `/espacio/*` intacto como fallback.

## Rutas nuevas CICA

| Ruta | Pantalla | Estado |
|------|----------|--------|
| `/app/buscar` | Buscar paciente | **Implementada** |
| `/app/censo` | Censo clínico | **Implementada** |
| `/app/pacientes/:id/resumen` | Ficha resumen (5 bloques) | **Implementada** |
| `/app/pacientes/:id/evoluciones` | Lista evoluciones | Stub PR4 |
| `/app/pacientes/:id/evoluciones/nueva` | Nueva evolución SOAP | Stub PR4 |
| `/app/pacientes/:id/indicaciones` | Indicaciones | Stub |
| `/app/pacientes/:id/examenes` | Exámenes | Stub |
| `/app/pacientes/:id/documentos` | Documentos | Stub |
| `/app/pacientes/:id/papel/dia/:date` | Modo papel standalone | **Implementada** |

## Rutas legacy (sin tocar composición)

- `/espacio/*` — fallback temporal
- `/epis2/dashboard` — archive/lab admin

## Componentes CICA creados

```
packages/epis2-ui/src/cica/
  CicaAppShell.tsx
  CicaTopBar.tsx
  CicaClinicalNav.tsx
  CicaPatientIdentityBand.tsx
  CicaContextStrip.tsx
  ClinicalActionBar.tsx (alias)
  PaperModeScreen.tsx (+ Toolbar, Canvas)
  EPIS_CICA_SCREEN_REGISTRY.ts
  cicaTokens.ts
  index.ts

apps/web/src/cica/
  CicaAppLayout.tsx
  CicaPatientSearchPage.tsx
  CicaCensusPage.tsx
  CicaPatientSummaryPage.tsx
  CicaPatientSectionPages.tsx
  CicaPaperDayPage.tsx
  components/CicaChartTabs.tsx
```

## Policy + feature flag

- `docs/design/EPIS2_CICA_CLEAN_ROOM_POLICY.md`
- `apps/web/src/dev/cicaUiEnv.ts` → `VITE_ENABLE_CICA_UI`
- `EPIS2_CLINICAL_HOME` → `/app/buscar` cuando CICA ON

## Gates creados

| Gate | Estado |
|------|--------|
| `quality:cica-no-legacy-shell-gate` | OK |
| `quality:cica-no-dashboard-mode-gate` | OK |
| `quality:cica-screen-registry-gate` | OK |
| `quality:cica-action-density-gate` | OK |
| `quality:cica-paper-standalone-gate` | OK |
| `quality:cica-clean-room-close-gate` | OK |

## Validación

```bash
npm run quality:gate -- quality:cica-clean-room-close-gate
npm run typecheck -w @epis2/web
npm run typecheck -w @epis2/epis2-ui
```

## Próximo paso (PR2–PR6)

1. **PR2** — E2E sobre `/app/buscar` (no `/espacio/buscar-paciente`)
2. **PR3** — Pulir ficha resumen (tabs + bloques + IA chip)
3. **PR4** — Evoluciones SOAP limpio en `/app/.../evoluciones/nueva`
4. **PR5** — Papel: desacoplar `PaperChartMode` de rutas `/espacio`
5. **PR6** — Redirects legacy → CICA + reporte estético before/after

## Riesgos

- Login y bookmarks apuntan a `/app/buscar` — legacy sigue en `/espacio/*`
- Stubs de sección muestran placeholder hasta PR4+
- `PaperChartMode` aún conoce rutas `/espacio` internamente (deuda PR5)

## Frase guía

**EPIS2 CICA UI no hereda pantallas. Hereda intención clínica.**
