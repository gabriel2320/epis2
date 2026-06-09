# EPIS2 — Modo Clásico EMR con Material Design 3 (MF-CLASSIC-EMR-MD3)

**Fecha:** 2026-06-07  
**Microfase:** MF-CLASSIC-EMR-MD3  
**Estado:** Implementado (vista alternativa; `/comando` intacto)

## Objetivo

Ofrecer una vista alternativa de ficha/workspace con layout EMR tradicional (paneles fijos, supporting pane MD3) para usuarios que prefieren ese patrón, **sin** duplicar arquitectura clínica ni reemplazar el canon command-first de EPIS2.

## Principios Material Design 3 aplicados

| Principio | Implementación |
|-----------|----------------|
| Scaffold claro | `EpisClassicMd3Shell` — grid `100dvh`, scroll policy `main-pane-only` |
| Top app bar fija | `EpisClassicMd3TopAppBar` — marca, contexto, volver a `/comando` |
| Navegación lateral | `EpisClassicMd3LeftNavigation` — destinos clínicos existentes |
| Supporting pane | `EpisClassicMd3SupportingPane` — contexto colapsable 320–360px |
| Jerarquía visual | Espacio, tonos suaves, chips sobrios en header |
| Presupuesto de iconos/acciones | Action rail ≤10; command bar ≤4 sugerencias; ActionBar única en main pane |
| Adaptividad | Left nav oculta en xs; supporting pane en lg+; action rail en sm+ |
| Acciones globales concentradas | `EpisClinicalFormActionBar` solo en main pane; top bar sin guardar/firmar |

## Rutas afectadas

- `/espacio/ficha?mode=classic` — ficha paciente (PatientWorkspacePage)
- `/espacio/evolucion?mode=classic` — formularios scrollspy (GeneratedClinicalFormPage)
- `/espacio/*?mode=classic` — vía `classicModeSearch` en navegación lateral
- `/epis2/dashboard?view=classic` — enlace administrativo desde nav clásica
- Preferencia: `userPreferences.defaultPatientView = 'classic'` (localStorage `epis2-user-preferences`)

## Componentes creados

```
apps/web/src/components/classic-md3/
  EpisClassicMd3Shell.tsx
  EpisClassicMd3TopAppBar.tsx
  EpisClassicMd3PatientHeader.tsx
  EpisClassicMd3LeftNavigation.tsx
  EpisClassicMd3MainPane.tsx
  EpisClassicMd3SupportingPane.tsx
  EpisClassicMd3ActionRail.tsx
  EpisClassicMd3CommandBar.tsx
  EpisClassicMd3StatusBar.tsx
  EpisClassicMd3SplitPane.tsx
  ClassicMd3WorkspaceLayout.tsx
  ClassicMd3ClinicalPageShell.tsx
  ClassicMd3PreferencesSection.tsx

apps/web/src/classic-md3/
  useClassicMd3Mode.ts
  userPreferences.ts
  classicNavDestinations.ts
```

## Layout final

```
Top App Bar (52px) → Patient Header → [Left Nav | Main Pane | Supporting | Rail]
Command Bar → Status Bar (32px)
```

Un solo scroll principal en `EpisClassicMd3MainPane`. Body sin scroll global caótico (`overflow: hidden` en shell).

## Comportamiento adaptativo

| Breakpoint | Left nav | Supporting | Action rail |
|------------|----------|------------|-------------|
| Compact (xs) | Oculta | Oculta | Oculta |
| Medium (sm–md) | Visible | Oculta en xs–md | Visible |
| Expanded (lg+) | Expandida | Visible si abierta | Visible |

Split pane (`EpisClassicMd3SplitPane`) para evolución+ficha con persistencia local.

## Integración command-registry

- `EpisClassicMd3CommandBar` delega en `useClinicalCommandSubmit` (PatientWorkspacePage, ClassicMd3ClinicalPageShell)
- Sin router paralelo ni segundo registry
- `CommandConfirmationDialog` para acciones riesgosas

## Integración RAD/MD3 discipline

- Entradas en `radScreenRegistry.ts`: `patient-chart-classic`, `clinical-form-evolution-classic`, `dashboard-classic-view`
- `uiDensityRules.ts`: scaffold `EpisClassicMd3Shell`, ruta classic en registry
- `EpisDesignModeOverlay`: chips modo Classic, supporting-pane, scroll policy cuando `VITE_ENABLE_DESIGN_MODE=true`

## Riesgos

| Riesgo | Mitigación |
|--------|------------|
| Duplicar ActionBar | Gates + footer solo en main pane; top/supporting sin guardar/firmar |
| Usuario atrapado en clásico | Botón volver a `/comando` + preferencias modern/classic |
| Scroll doble | `data-epis-scroll-policy="main-pane-only"` + gate fixed-panels |
| Mezclar API en UI visual | Gate classic-md3-mode valida ausencia de imports `api/` en componentes visuales |

## Gates ejecutados

```bash
npm run quality:classic-md3-mode-gate
npm run quality:classic-fixed-panels-gate
npm run quality:classic-supporting-pane-gate
npm run quality:classic-commandbar-gate
npm run quality:classic-actionrail-gate
npm run quality:classic-statusbar-gate
npm run quality:ui-simplify-gate
npm run quality:rad-m3-discipline-gate
npm run quality:design-mode-gate
```

## Recomendación para habilitar como preferencia

1. Exponer `ClassicMd3PreferencesSection` en Apariencia (ya integrado en `AppearancePreferencesPage`).
2. Default `modern`; opt-in explícito a `classic`.
3. Pilotar con 2–3 usuarios en demo antes de institucional.
4. Monitorear gates en CI tras merge.

## Próximo paso

- Ampliar cobertura E2E: `/espacio/ficha?mode=classic` → evolución → borrador → volver a `/comando`.
- Evaluar supporting pane con plantillas/snippets cuando MF-CLINICAL-TEXTBOX esté en más formularios.
