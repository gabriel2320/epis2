# Reporte — Navegación ficha M3 + pantalla dividida

**Fecha:** 2026-06-07  
**Alcance:** Navigation Rail, shell paciente 5 niveles, preferencia split screen, scrollspy + FAB  
**Canon:** `docs/design/EPIS2_PATIENT_CHART_NAVIGATION_M3.md`

---

## Entregables

| Entrega | Estado |
|---------|--------|
| Especificación 5 niveles MD3 | ✓ doc canon |
| `EpisNavigationRail` + `EpisAppShellLayout` | ✓ |
| `EpisPatientChartShell` (N1–N2) | ✓ |
| `EpisClinicalScrollspy` + layout (N3) | ✓ |
| `EpisClinicalActionDock` (N4) | ✓ |
| Preferencia `clinicalSplitScreen` focus/split | ✓ |
| Centro de Comando mantiene home `/comando` | ✓ |
| Rail también en Centro de Comando | ✓ |

## Pantalla dividida

- Preferencia en `/preferencias-apariencia`: **Modo enfoque** vs **Pantalla dividida**
- `useEpisClinicalContextPanel` abre historial por defecto cuando `split`
- Toggle manual en `EpisClinicalFocusAppBar` sigue funcionando; persistencia por sesión+blueprint

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK |
| `npm run test` | OK — 377 tests (148 archivos) |
| `npm run db:validate` | OK — 31 migraciones |

## Riesgos

- Tests de layout clínico pueden requerir ajuste por nuevo shell (rail oculto en jsdom xs).
- Mensajería rail deshabilitada hasta integración real.

## Próximo paso

Badges CDS en cabecera paciente; pasada visual M3 en evolución con split activo.
