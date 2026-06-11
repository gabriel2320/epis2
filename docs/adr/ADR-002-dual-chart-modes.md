# ADR-002 — Dos modos de ficha clínica + Command Bar transversal

**Estado:** Propuesto · **Fecha:** 2026-06-10  
**Decisores:** producto + arquitectura EPIS2  
**Referencias Figma:** [Medical Record](https://www.figma.com/make/PhZ55jJhxLQUtIWEuf17ZO/Medical-Record) · [Ficha papel](https://www.figma.com/make/AJ9MNrSyClA0hh8jB8sx49/Crear-p%C3%A1ginas-de-ficha-m%C3%A9dica)

---

## Contexto

EPIS2 opera hoy con **tres modos de experiencia** (Command · Classic MD3 · Dashboard) sobre rutas existentes (`EPIS2_MODES_LAYER.md`). El producto evoluciona hacia una **ficha del paciente** como eje principal post-selección, con:

1. **Ficha electrónica tradicional** — EMR estructurado, denso, institucional.
2. **Ficha papel / documento clínico editable** — apariencia hospitalaria impresa (Carta / A5), datos estructurados en SoT.

La **barra de comando IA** debe permanecer **transversal** (Power Bar / palette), no como “modo visual” principal.

---

## Decisión 1 — No abandonar MUI

| Opción | Veredicto |
|--------|-----------|
| **A. Migrar a Tailwind / CSS puro / Radix** | **Rechazada** — reescritura masiva; rompe gates `no-direct-mui-imports`, Storybook, 20 reglas tipográficas, print primitives. |
| **B. Mantener MUI vía `@epis2/epis2-ui`** | **Adoptada** — dos *temas de ficha* (electrónico / papel) como extensiones de `createEpis2Theme`, no segundo stack UI. |
| **C. Abandonar MUI solo en modo papel** | **Rechazada** — duplica mantenimiento print + forms; `PrintLetterDocument` ya vive en epis2-ui. |

**Rationale:** MUI es la fachada de implementación MD3; el cambio visual es **composición + tokens**, no reemplazo de librería. Invariante #4 se mantiene.

---

## Decisión 2 — Dos modos canónicos de ficha (reemplazo progresivo de classic/modern/dashboard en ficha)

| Modo | ID | UX |
|------|-----|-----|
| Ficha electrónica tradicional | `traditional` | Nav lateral · banner · área central · panel contexto opcional |
| Ficha papel editable | `paper` | 7 secciones documento · Carta/A5 · cabecera institucional |

Activación: search `chartMode=traditional|paper` en rutas `/espacio/ficha*` (fase B).  
Legacy: `?mode=classic|dashboard` congelado — sin nuevas features.

---

## Decisión 3 — Command Bar siempre presente

Componente transversal **`ClinicalShell`** envuelve toda ruta clínica autenticada:

```text
ClinicalShell
├── PatientChartBanner
├── ChartModeSwitch (traditional ↔ paper)
├── {TraditionalEhrMode | PaperChartMode}
├── CommandPaletteOverlay (Ctrl+K, existente)
└── EpisUniversalCommandBar (variant chart-transversal, dock fijo)
```

- **No eliminar** `/comando` como home (invariante #6) en fase 1.
- Post-login con paciente fijado: deep-link preferido → `/espacio/ficha?patientId=&chartMode=traditional`.
- Comando deja de ser “pantalla vacía principal” en fase 3 (ADR enmienda propuesta).

---

## Decisión 4 — Datos estructurados en modo papel

Modo papel **no** es PDF plano:

- Secciones I–VII mapean a **blueprints Zod** existentes / extensiones en `clinical-forms`.
- MVP: campos controlados (`EpisClinicalFormRhf` / textarea por sección) persistidos como borrador.
- Fase 2: editor estructurado (Tiptap/Lexical) detrás de interfaz `ClinicalDocumentSectionEditor` — sin instalar deps hasta gate de seguridad.

---

## Decisión 5 — Impresión Carta y A5 (no A4)

Reutilizar `PrintLetterDocument` y `PrintA5Document` (`@epis2/epis2-ui/print`).  
CSS `@page` en `paperChartPrint.css` — tamaños US Letter y A5 únicamente.

---

## Consecuencias

### Positivas

- Un shell clínico unificado; menos duplicación classic vs modern.
- Modo papel alineado a norma institucional chilena (Carta/A5 ya en programa).
- Command-first preservado sin competir con layouts de ficha.

### Negativas / riesgos

| Riesgo | Mitigación |
|--------|------------|
| Conflicto invariante #6 (home=comando) | Fase 1–2: comando launcher; fase 3: ADR enmienda + signoff producto |
| Regresión E2E three-modes | Legacy congelado; tests legacy intactos; nuevos tests bajo flag |
| Scope editor rico | MVP campos simples; ADR fase Tiptap |
| Gate `web-components-root-frozen` | Nuevos bajo `components/chart/` — registrar excepción en validador si aplica |

---

## Plan de migración (resumen)

Ver [`EPIS2_DUAL_CHART_DEV_PLAN.md`](../product/EPIS2_DUAL_CHART_DEV_PLAN.md) · ledger [`dual-chart-ledger.json`](../quality/dual-chart-ledger.json).

| Fase | Entrega | Gates |
|------|---------|-------|
| **0** | ADR + tokens + scaffold + Storybook + E2E bajo flag | `check` |
| **1** | Preview dev `/dev/chart-modes` | Storybook + E2E opt-in |
| **2** | `chartMode` en `/espacio/ficha`; legacy default | `three-modes` sin cambios |
| **3** | Deprecar `PatientWorkspacePage` modern stack | journey golden |
| **4** | Congelar `/epis2/dashboard` y classic shell | signoff clínico |
| **5** | Comando → launcher delgado | enmienda invariante #6 |

---

## Alternativas descartadas

- **Un solo modo híbrido** — mezcla EMR + papel confunde médicos.
- **Dashboard como home** — viola invariante #7.
- **Abandonar command registry** — viola invariante #9.

---

## Aprobación pendiente

- [ ] Enmienda invariante #6 (fase 3+) — home delgado vs ficha-first
- [ ] Signoff clínico modo papel (7 secciones)
- [ ] `architecture:validate` — allowlist `components/chart/`

**Frase guía:** *El comando acompaña al médico; la ficha lo orienta.*
