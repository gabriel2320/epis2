# EPIS2 — CICA Theme & Responsive Wave (cierre)

**Fecha:** 2026-06-17  
**Alcance:** SDEPIS2 · CICA Clean Room — tema (modo/acento), grilla 8px responsiva, motion clínico  
**Veredicto:** **GO-CANDIDATE**

## Resumen

Ola de tema y responsive para la sala blanca `/app/*`: controles compactos en `CicaTopBar`, tokens semánticos vía `useCicaThemeTokens`, transiciones de ruta sobrias, y sistema de grillas alineado a 8px sin scroll horizontal en shell.

## Controles de tema

Componente canónico: `packages/epis2-ui/src/cica/CicaThemeControls.tsx` — integrado en `CicaTopBar` y `CicaAppLayout`.

| Control | Test ID | Comportamiento |
|---------|---------|----------------|
| Modo claro/oscuro | `cica-theme-mode-toggle` | `EpisThemeModeToggle` — persiste en `EpisThemePreferences` |
| Acento rápido — Azul clínico | `cica-accent-clinicalBlue` | `#1873DC` |
| Acento rápido — Calma clínica | `cica-accent-clinicalCalm` | `#0B5C66` |
| Acento rápido — Teal | `cica-accent-tealBlue` | `#0D7377` |
| Acento rápido — Salvia | `cica-accent-sageClinical` | `#28644A` |
| Preferencias completas | `cica-appearance-preferences-link` | Enlace a `/preferencias-apariencia` |

Acceso alternativo: menú «Más» en nav clínico → `cica-nav-more-appearance`.

Hook de consumo: `useCicaThemeTokens()` — layout estático (`cicaTokens`) + colores MUI resueltos + `mode` / `isDark`.

## Breakpoints responsivos

Fuente: `packages/epis2-ui/src/cica/cicaResponsive.ts` · `CICA_BREAKPOINT_TABLE`.

| Breakpoint | Min (px) | Max (px) | Padding shell (× 8px) | Padding efectivo |
|------------|----------|----------|-------------------------|------------------|
| `xs` | 0 | 599 | 1.5 | 12px |
| `sm` | 600 | 899 | 2 | 16px |
| `md` | 900 | 1199 | 2.5 | 20px |
| `lg` | 1200 | 1535 | 3 | 24px |
| `xl` | 1536 | — | 3 | 24px |

Notas adicionales:

- `cicaNavLabelMinPx = 360` — debajo de este ancho los labels de nav pueden acortarse.
- `CicaAppShell` usa `height: 100dvh` + safe-area insets.
- Contenedores: `cicaResponsiveContainerSx(profile)` con `overflowX: hidden` y `maxWidth` por perfil de pantalla.

## Motion y animaciones

Fuente: `packages/epis2-ui/src/cica/cicaMotion.ts` · `CicaScreenTransition.tsx`.

| Token | Duración | Uso |
|-------|----------|-----|
| `screen` | 180ms | Entrada de pantalla / cambio de ruta |
| `tab` | 120ms | Tabs e indicadores |
| `chrome` | 120ms | Sombra/borde de `CicaTopBar` al elevarse |

| Regla | Detalle |
|-------|---------|
| Activación | Solo con preferencia `motion: standard` **y** sin `prefers-reduced-motion` |
| Transición de ruta | `CicaScreenTransition` — fade + slide 4px (`cicaFadeInUp`) |
| Desactivación | Sin keyframes cuando `reduced` o media query reduce — layout estático |
| Top bar | `cicaTransition` en `border-color` / `box-shadow` |

## Sistema de grillas

| Componente | Ubicación | Comportamiento |
|------------|-----------|----------------|
| `CicaResponsiveGrid` | `@epis2/epis2-ui` | 1 col `xs` · 2 col `sm` · 12 col `md+`; opcional `CicaGridCell` span |
| `CicaFormGrid` | `@epis2/epis2-ui` | Campos: 1→2→12 cols; modo `prose` siempre 1 col |
| `CicaSummaryGrid` | `apps/web/src/cica` | Reestructura `ClassicChartSummaryPanel`: 1 col móvil, 2 col `md+` |

Tokens compartidos: `cicaResponsiveGrid`, `cicaFormGrid` en `cicaResponsive.ts`; gap base = `cicaTokens.unit` (8px).

## Gates

| Gate | Alcance | Estado |
|------|---------|--------|
| `quality:cica-responsive-gate` | `cicaResponsive.ts`, grids, shell 100dvh, exports, alineación 8px | **OK** |
| `quality:cica-clean-room-close-gate` | Compuesto foundation + formularios **incluye** responsive-gate | **OK** |
| `quality:cica-theme-gate` | `CicaThemeControls`, `useCicaThemeTokens`, `CicaScreenTransition`, exports | **OK** |

### Validación ejecutada

```bash
npm run quality:gate -- quality:cica-responsive-gate        # OK
npm run quality:gate -- quality:cica-clean-room-close-gate    # OK
npm run quality:gate -- quality:cica-theme-gate               # OK
```

`validate-cica-clean-room-close-gate.mjs` ya incluía `validate-cica-responsive-gate.mjs` — sin cambio de script requerido.

## E2E — specs `cica-*.spec.ts`

| Spec | Alcance |
|------|---------|
| `e2e/cica-clean-room-journey.spec.ts` | `/app` buscar → ficha → tabs; sin shell legacy |
| `e2e/cica-evolution-draft.spec.ts` | Resumen → nueva evolución → borrador → lista |
| `e2e/cica-form-drafts.spec.ts` | Borradores formularios CICA (prescripción/certificado) |

Login CICA: `loginAsPhysicianCica` (`e2e/helpers/demoPatient.ts`).

## Checklist QA manual

| Escenario | Pasos | Criterio |
|-----------|-------|----------|
| **375px** (iPhone SE) | `/app/buscar`, ficha paciente, censo | `document.documentElement.scrollWidth === clientWidth` — sin scroll horizontal |
| **375px** nav/tabs | Identidad paciente + chart tabs | Wrap o scroll táctil oculto; identidad en columna si hace falta |
| **Modo oscuro** | Toggle `cica-theme-mode-toggle` en top bar | Fondo/paper/divider/texto coherentes; acentos visibles en swatches |
| **Acentos** | Clic en cada `cica-accent-*` | Borde activo en swatch; primary MUI actualizado |
| **Preferencias** | `cica-appearance-preferences-link` o nav «Apariencia» | Navega a `/preferencias-apariencia` |
| **Motion reduced** | Preferencias → motion reduced | Sin fade al cambiar ruta; top bar sin transition |
| **Modo papel** | `/app/pacientes/:id/papel/dia/:date` | Nav oculto; contenido legible; sin overflow horizontal |
| **Impresión papel** | Print desde modo papel | Layout standalone; sin chrome administrativo |

## Riesgos residuales

- `CicaSummaryGrid` vive en `apps/web` — no cubierto por responsive-gate del package (solo shell + grids package).
- E2E no asserta dark mode ni viewport 375px de forma automatizada.
- Signoff visual before/after (CICA-L) sigue manual.

## Próximos pasos

1. E2E viewport 375px + toggle dark en journey spec.
2. Extender responsive-gate con presencia de `CicaSummaryGrid` en web si se estabiliza API.
3. Signoff visual CICA-L tema claro/oscuro en ficha y papel.

## Frase guía

**EPIS2 CICA UI no hereda pantallas. Hereda intención clínica.**
