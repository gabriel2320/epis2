# MF-FF-09 — Evolución diaria layout clínico

**Fecha cierre:** 2026-06-15 · **Programa:** PROG-FICHA-FIRST · **Wave:** 3  
**Gate:** `quality:clinical-grid-gate` ✓ (grillas) · wiring evolution en form page

---

## Alcance

Formulario `evolution_note` en dual-chart debe abrir dentro de `TraditionalEhrMode` con foco en sección evolución (`navEvolution`).

## Cambios

| Artefacto | Entrega |
|-----------|---------|
| `GeneratedClinicalFormPage.tsx` | Wrap dual-chart + `evolution_note` → `TraditionalEhrMode` con `initialTraditionalSection: "navEvolution"` |
| | `data-testid="epis2-evolution-traditional-shell"` |
| | Queries longitudinales/resumen para contexto clínico |

## Próximo paso

**MF-FF-10** — Receta A5 triple vista.
