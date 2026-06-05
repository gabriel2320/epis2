# Reporte — Canon tipografía y estética (20 reglas)

**Fecha:** 2026-06-04 · **Fase:** THEME-02+ · **Alcance:** documentación + tokens, sin refactor UI masivo

## Objetivo

Codificar las 20 reglas de tipografía y composición visual del usuario en canon EPIS2 y alinear tokens existentes en `@epis2/epis2-ui`.

## Entregables

| Artefacto | Descripción |
|-----------|-------------|
| `docs/design/EPIS2_TYPOGRAPHY_AND_AESTHETICS_RULES.md` | Canon normativo con mapeo EPIS2 |
| `packages/epis2-ui/src/theme/typography-rules.ts` | Constantes exportables (prosa, tabular, grid, motion) |
| `packages/epis2-ui/src/theme/typography-rules.test.ts` | Tests de contrato |
| `typography.ts` | lineHeight 1.5 cuerpo / 1.2 display; tracking label |
| `components.ts` | Mono + tabular-nums en `pre`/`code` |
| `apps/web/index.html` | Carga Roboto Mono |
| `EPIS2_MATERIAL3_CLINICAL_EXPERIENCE.md` | Enlace al canon |

## Alineación por regla

| # | Regla | Estado EPIS2 |
|---|-------|--------------|
| 1 | 2 familias (sans + mono) | Par sans Google Sans + Roboto; Roboto Mono técnica |
| 2 | Escala modular | 14px × 1.2 documentado (`epis2TypeScale`) |
| 3 | 45–75 chars | `65ch` (`epis2ClinicalProseSx`) |
| 4 | Interlineado | body 1.5, headings 1.2 |
| 5 | Tabular nums | `epis2TabularNumsSx` + baseline |
| 6 | Peso jerarquía | Roles M3 con pesos fijos |
| 7 | Sin mayúsculas | `textTransform: none` en botones |
| 8 | Alineación | `epis2NumericCellSx` |
| 9 | Tracking | label +0.02em, display -0.02em |
| 10 | WCAG AA | Gates contraste clínico existentes |
| 11 | Grid 8pt | spacing 8; shape radios 2–6 excepción |
| 12 | Proximidad | Islas / layout existente |
| 13 | Sin #000 | MTB dark surfaces |
| 14 | 60-30-10 | Roles M3 surface/container/primary |
| 15 | Iconos uniformes | Material Symbols — convención doc |
| 16 | Densidad | comfortable / compact por contexto |
| 17 | Fondos vs bordes | surfaceContainer — guía doc |
| 18 | Estados | `components.ts` overrides |
| 19 | Elevación tonal | MTB surface tiers |
| 20 | Animación 150–300ms | motion 180–260ms; reduced-motion |

## Riesgos

- **Adopción gradual:** `epis2ClinicalProseSx` y `epis2NumericCellSx` deben aplicarse en vistas clínicas nuevas; no hay migración masiva de grids.
- **Dos sans:** Google Sans + Roboto cuenta como par UI coordinado; no añadir tercera sans decorativa.
- **Shape 2–6px:** Radios pequeños fuera de 8pt grid — mantener solo en controles densos.

## Próximo paso

1. THEME-03 — Preferencias de apariencia (densidad, contraste, movimiento).
2. Aplicar `epis2ClinicalProseSx` en blueprints de evolución/epicrisis (Ola 2+).
3. Data Grid: columna numérica con `epis2NumericCellSx` en `EpisDataGrid` wrapper.

## Gates

Ejecutar al cierre de sesión: `npm run check`, `npm run test`, `npm run db:validate`.
