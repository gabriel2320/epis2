# EPIS2-LAYOUT-01 — Diseño two-pane clínico

**Fecha:** 2026-06-05 · **Alcance:** Diseño + implementación LAYOUT-01 shell

## Entregable

`docs/design/EPIS2_CLINICAL_TWO_PANE_LAYOUT.md` — diseño profesional Modo Enfoque ↔ Modo Contexto alineado a M3 Canonical Two-pane y canon EPIS2.

## Decisiones clave

| Tema | Decisión |
|------|----------|
| Default | Lienzo único 65ch, sin historial visible |
| Split | 40/60 desktop; drawer <960px |
| Superficies | `surfaceContainerLowest` (acción) vs `low` (consulta) |
| IA | Invisible + explícita en panel derecho; sin chat lateral |
| Inserción | Chip «Añadir al plan» v1; drag v2 |
| Blueprints v1 | `evolution_note`, `discharge_summary` |

## Referencias cruzadas

- `EPIS2_MATERIAL3_CLINICAL_EXPERIENCE.md` §2
- `M3_ADOPTION_PLAN.md` — fases LAYOUT-01…04
- `EPIS2_PRODUCTIVITY_AND_DISCLOSURE_RULES.md` §2.2

## Gates

No aplica (solo documentación). Implementación futura: `npm run check`, golden journey evolución.

## Implementación LAYOUT-01

| Artefacto | Ruta |
|-----------|------|
| Layout shell | `packages/epis2-ui/src/forms/EpisClinicalTwoPaneLayout.tsx` |
| App bar | `EpisClinicalFocusAppBar.tsx` |
| Hook foco | `useEpisClinicalContextPanel.ts` |
| Blueprint gate | `clinical-context-blueprints.ts` |
| Integración | `GeneratedClinicalFormPage.tsx` |
| Placeholder contexto | `EpisClinicalContextPanePlaceholder.tsx` |

## Próximo paso

**LAYOUT-02** — Timeline real + búsqueda local + chip inserción.
