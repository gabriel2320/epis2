# EPIS2 — Auditoría profunda: Fase 3 (pulido M3) — 2026-06-09

> Continuación de `reports/epis2-auditoria-profunda-2026-06-09.md` (plan §Fase 3).
> Fase 1: `reports/epis2-auditoria-fase1-higiene-2026-06-09.md` · Fase 2: `reports/epis2-auditoria-fase2-robustez-2026-06-09.md`.

## Alcance declarado

- Nivel SDEPIS2: tramo de mejora transversal (auditoría), sin tocar SoT clínico ni invariantes.
- Archivos: `packages/epis2-ui/src/theme/*`, `packages/epis2-ui/src/clinical/EpisDraftStatus*`,
  `packages/epis2-ui/src/command/*`, `packages/epis2-ui/src/providers/EpisThemePreferences.tsx`,
  `apps/web/src/pages/AdminConsolePage.tsx`, `apps/web/src/pages/DraftReviewPage.tsx`,
  `packages/design-system/src/copy/es.ts`.

## Cambios

### 3.1 `palette.tertiary` + escalera `surfaceContainer*` completa en runtime (M8/M9 auditoría)

- `M3SurfaceRoles` ahora incluye `surfaceContainerLowest/Low/Highest` además de los tres roles previos.
  - MTB: mapeados 1:1 desde el esquema (`m3-palette-from-scheme.ts`, `visual-identity.ts`).
  - Legacy: valores neutros coherentes añadidos a `lightSurfaces`/`darkSurfaces` (`color-roles.ts`).
- `palette.tertiary` expuesto vía module augmentation de MUI (`create-epis2-theme.ts`):
  - Temas MTB: `tertiary/tertiaryContainer/onTertiary*` del esquema aprobado.
  - Path legacy: cae al `secondary` del preset (documentado en código).
- `visual-identity.ts` deduplicado: fallback legacy reutiliza `lightSurfaces`/`darkSurfaces` en vez de hex repetidos.

### 3.2 `EpisDraftStatus` → roles clínicos protegidos (M10 auditoría)

- El chip de estado de borrador ya no usa la paleta de marca MUI (`color="success"` etc.) sino
  `theme.epis2.clinical.*` (roles protegidos M3-01, inmutables por acento de usuario):
  - `draft`/`editing` → `clinical.draft` · `ready_for_review` → `clinical.warning`
  - `rejected` → `clinical.critical` · `approved` → `clinical.approved` · `cancelled` → neutro.
- Test añadido: `EpisDraftStatus.test.tsx` verifica `approved.container` (#E8F5EE) aplicado al chip.

### 3.3 Refactor `AdminConsolePage` al design system (M11 auditoría)

- `Paper variant="outlined"` → `EpisWorkspaceSection` (patrón plano LAYOUT-G12).
- `Typography` → `EpisM3Text` con roles M3; `Button variant="contained"` → `EpisButton appearance="filled"`;
  `TextField` → `EpisTextField`; `Alert` → `EpisAlert`.
- Copy hardcodeado movido a `copy.adminConsole.*` en `packages/design-system/src/copy/es.ts`
  (título, disclaimer, tabs, secciones, campos, botón staging).

### 3.4 `DraftReviewPage` unificada con `EpisM3Text` (M12 auditoría)

- `Typography variant=h6/subtitle1/subtitle2/body2` → `EpisM3Text` con roles
  `titleMedium`/`bodyLarge`/`labelLarge`/`labelMedium` (paridad visual exacta con el mapa
  `epis2M3TypographyVariants`).
- Botón «Continuar edición» migrado de `variant="outlined"` a `appearance="outlined"` (API M3).

### 3.5 Motion: auto-sync `prefers-reduced-motion` + tokenización (M13 auditoría)

- `EpisThemePreferences.loadPreferences()`: si el usuario no guardó preferencia explícita de motion,
  se respeta `prefers-reduced-motion` del SO (`systemMotionDefaults()`); una preferencia guardada
  siempre gana.
- Magic numbers tokenizados:
  - `120ms ease` → `epis2Motion.duration.short` + `epis2Motion.easing.standard`
    (`EpisCommandSuggestionCards`, `EpisCommandCenterInlineBar`).
  - `minHeight: 132` → `epis2BarLayout.suggestionCardMinHeight`.

### Extra: estabilización `DashboardModePage.test.tsx` (flaky preexistente)

- El test fallaba intermitentemente por timeout 5s: el `lazy()` de `DashboardModeContent`
  transforma un grafo grande en caliente bajo carga. Verificado que fallaba igual en `fb5ba23`
  limpio (no causado por Fase 3).
- Fix: precarga del módulo lazy en el test + `timeout: 20000` del caso + `waitFor` 8s.

### 3.6 Alto contraste ampliado — DIFERIDO

- El modo `contrast: 'high'` actual solo refuerza peso tipográfico. Ampliarlo a outline +
  `onSurfaceVariant` + foco requiere pasada visual completa (signoff humano) sobre los 7 temas MTB
  × 2 modos. Se difiere a tramo propio con captura de evidencia (no es bloqueante de la auditoría).

## Gates

| Gate | Resultado |
|---|---|
| `npm run check` (lint + typecheck + architecture:validate) | ✅ |
| `npm run test` | ✅ |
| `npm run db:validate` | ✅ |

## Riesgos

- `EpisDraftStatus` cambia apariencia visual de los chips de estado (ahora container clínico +
  borde): verificado en tests; los E2E usan `data-testid`, no color.
- `palette.tertiary` en path legacy = secondary del preset; si un componente futuro asume hue
  tertiary distinto, usar temas MTB (path por defecto).

## Próximo paso

- Fase 4 del plan de auditoría (deuda técnica: división de `service.ts`, candados de tamaño).
- Tramo propio para 3.6 (alto contraste ampliado) con captura visual.
