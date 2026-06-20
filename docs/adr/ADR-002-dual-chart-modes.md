# ADR-002 — Dos modos de ficha clínica + Command Bar transversal

> **SUPERSEDED_DOC fence (2026-06-19):** aceptado como ADR historico de dual chart, pero las referencias a "Command/three modes" como home quedan superseded. Canon vigente: CICA GO, home `/app/buscar`, dashboard/three modes secundarios, `/espacio/*` fallback congelado.

**Estado:** Aceptado · **Fecha:** 2026-06-11  
**Canon visual:** [`EPIS2_DUAL_CHART_VISUAL_CANON.md`](../design/EPIS2_DUAL_CHART_VISUAL_CANON.md)
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

## Decisión 2 — Dos modos canónicos (eliminar three-modes como experiencia)

```text
EPIS2
└── Ficha del paciente
    ├── Ficha Electrónica (traditional)
    └── Ficha Papel (paper)
```

**Deprecar como pantallas principales:** Command Center · Classic · Dashboard.

Flujo: `Login → Censo → Ficha → selector modos`.

| Modo | ID | UX |
|------|-----|-----|
| Ficha electrónica | `traditional` | Nav clínico · denso · panel IA colapsable |
| Ficha papel | `paper` | Documento I–VII · Carta/A5 · institucional |

---

## Decisión 2b — Anatomía de pantalla (cuatro capas)

Ver canon visual. Componentes objetivo:

```text
ClinicalShell
├── ClinicalInstitutionalHeader      (azul marino, 56–64px)
├── PatientIdentityBand              (RUN, alergias, estado legal)
├── ClinicalActionBar                (modos + acciones + Ctrl+K)
├── TraditionalEhrLayout | PaperChartLayout
├── ClinicalFooterStatus             (autoguardado, confidencial)
└── CommandPaletteOverlay            (transversal, no modo)
```

Implementación incremental: MF-00…02 scaffold · MF-04+ anatomía completa.

---

## Decisión 3 — Command Bar transversal (no modo)

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
| Conflicto redacción home vs censo-first | **Resuelto en docs (2026-06-14):** home = Centro de Comando; censo = estado inicial; ficha dual = workspace. Routing sin cambio hasta signoff fase 3 |
| Regresión E2E three-modes | Legacy congelado; tests legacy intactos; nuevos tests bajo flag |
| Scope editor rico | MVP campos simples; ADR fase Tiptap |
| Gate `web-components-root-frozen` | Nuevos bajo `components/chart/` — registrar excepción en validador si aplica |

---

## Plan de migración (resumen)

Ver [`EPIS2_DUAL_CHART_DEV_PLAN.md`](../product/EPIS2_DUAL_CHART_DEV_PLAN.md) · ledger [`dual-chart-ledger.json`](../quality/dual-chart-ledger.json).

| Fase | Entrega | Gates |
|------|---------|-------|
| **0–2** | Scaffold + EMR + paper SoT | DONE |
| **3** | Router dual canónico | router-gate |
| **4** | Shell v2 anatomía | shell-anatomy-gate |
| **5** | TraditionalEhrLayout | traditional-layout-gate |
| **6** | PaperChartLayout v2 | paper-layout-gate |
| **7** | Legacy freeze | legacy-freeze-gate |
| **8** | Census-first | census-gate |
| **9** | Signoff + invariante #6 | launcher-gate |

---

## Alternativas descartadas

- **Un solo modo híbrido** — mezcla EMR + papel confunde médicos.
- **Dashboard como home** — viola invariante #7.
- **Abandonar command registry** — viola invariante #9.

---

## Aprobación pendiente

- [x] Enmienda invariante #6 (fase 3+) — home censo-first · **MF-FF-00** 2026-06-15
- [ ] Signoff clínico modo papel (7 secciones)
- [ ] `architecture:validate` — allowlist `components/chart/`

**Frase guía:** *El comando acompaña al médico; la ficha lo orienta.*
