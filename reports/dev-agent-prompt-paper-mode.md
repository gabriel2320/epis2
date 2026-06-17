# Prompt sesión — PROG-PAPER-MODE (modo papel EPIS2)

**Plan:** [`docs/product/EPIS2_PAPER_MODE_DEV_PLAN.md`](../docs/product/EPIS2_PAPER_MODE_DEV_PLAN.md)  
**Conciliación mirror:** [`docs/product/EPIS2_PAPER_MIRROR_RECONCILIATION.md`](../docs/product/EPIS2_PAPER_MIRROR_RECONCILIATION.md)  
**Auditoría:** [`reports/archive/2026-06/epis2-paper-mirror-audit-2026-06-11.md`](./archive/2026-06/epis2-paper-mirror-audit-2026-06-11.md)  
**Ledger:** [`docs/quality/paper-mode-ledger.json`](../docs/quality/paper-mode-ledger.json)  
**Subagente primario:** `layers-integrator` · assist → `ollama-clinical` · cierre → `gate-runner`

---

## Arranque

```bash
npm run stack:dev
npm run dev:session
npm run quality:paper-mode-next
```

Leer: `PRODUCT_INVARIANTS.md` · `ADR-002` · `EPIS2_DUAL_CHART_VISUAL_CANON.md` §5 · conciliación mirror (si toca arquitectura).

**Declarar en primera respuesta:** MF activo · archivos permitidos (ledger) · gate de cierre.

---

## Misión

Extender `chartMode=paper` hasta documento clínico institucional imprimible (Carta noble, A5 auxiliar), con IA **fuera** del papel, SoT en PostgreSQL.

**Extender** — no crear `apps/web/src/paper-mode/`.

**Estado 2026-06-11:** MF-PAPER-00…05 **DONE** · siguiente MF-06 (paginación) o MF-08 (comandos IA, paths disjuntos).

---

## Código canónico

```text
apps/web/src/components/chart/paper/     ← todo UI papel
packages/clinical-forms/paper-chart/     ← Zod + blueprint (SoT)
packages/epis2-ui/print/                 ← PrintLetter/A5
packages/epis2-ui/theme/chart-modes-tokens.ts
packages/command-registry/               ← comandos IA (MF-08)
apps/api/src/clinical/paperChart.ts      ← API borrador/firma
```

**Futuro motor espejo (NO implementar hasta PM-09):**

```text
packages/clinical-forms/src/mirror/      ← ClinicalFieldBinding, events
apps/web/src/components/chart/mirror/    ← ClinicalMirrorProvider
apps/web/src/components/chart/paper/pdf/ ← PdfBridge UI
docs/adr/ADR-004-paper-mirror-expansion-proposed.md
```

---

## Reglas

| ✓ | ✗ |
|---|---|
| MUI vía `@epis2/epis2-ui` | import `@mui/*` en apps/web |
| Ctrl+K + panel derecho para IA | PaperCommandAgent duplicado |
| Borrador → humano → firma | IA firma o escribe final |
| 7 secciones I–VII existentes | Segundo Form Registry |
| `paperChartPrint.css` + tokens | A4 · dashboard home |
| PDF / print = **salida** | PDF como SoT |
| Un contrato → dos renderizadores | Dos sistemas clínicos paralelos |

**Dentro `.epis2-paper-page`:** prohibido Card, DataGrid, botones, chips.

---

## Motor espejo (prompt conciliado)

El prompt externo «Paper Clinical OS» describe la evolución correcta:

```text
Modo clásico  ←→  Modelo clínico único  ←→  Modo papel
```

**EPIS2 hoy:** dual UI + `paper_chart` SoT + firma/IA PM-03/05 — **sin sync bidireccional** classic↔paper.

**Implementación mirror:** programa **PROG-PAPER-MIRROR** post MF-PAPER-09. Ver conciliación completa.

### Adoptado del prompt

- Carta principal · A5 auxiliar (receta, certificado, orden simple)
- PostgreSQL SoT · HTML/CSS print → PDF
- Metadatos campo (`source`, `confirmed`) · bloqueo firma IA
- Tipografía clínica · grilla basal · IA fuera del área imprimible
- Paper Planner (programa hermano) · PaperQualityGate (MF-09)

### Rechazado / diferido

| Prompt | EPIS2 |
|--------|-------|
| `apps/web/src/paper-mode/*` | `components/chart/paper/` |
| `ClinicalMirrorEngine` day-1 | PROG-PAPER-MIRROR |
| `PdfBridgeEngine` carpeta raíz | Extender `documentIntake` |
| 15 ClinicalDocumentType upfront | Blueprints existentes |
| `PaperExpansionEngine` auto-rutas | MF-07 manual P0 |
| Tiptap/Lexical | ADR + gate seguridad |
| XFA canónico | Referencia/OCR only |
| Modo split en prod | Dev flag + Storybook |

### Reglas sync (target mirror)

```text
1. Editar clásico → actualiza papel (clinicalPath → sección)
2. Editar papel → actualiza clásico
3. PDF import → modelo clínico (no solo PDF)
4. IA propone sobre modelo, no DOM
5. Firma bloquea ambos modos
6. Enmienda = nueva versión
7. Cambios auditados
```

---

## Microfase activa

```bash
npm run quality:paper-mode-next
```

Orden típico restante:

`MF-PAPER-06` paginación → `07` puente docs → `08` comandos IA → `09` signoff.

**Planner** (`PROG-PAPER-PLANNER`): tras MF-PAPER-02 ✓, paths `paper/planner/`.

---

## Cierre sesión

```bash
npm run check
npm run test -- apps/web/src/components/chart/paper/
npx playwright test e2e/dual-chart-modes.spec.ts   # si UI ficha
npm run dev:agent:close
```

Reporte: `reports/epis2-mf-paper-XX-*.md` · actualizar ledger state si MF cerrado.

**Sin commit/push** salvo instrucción explícita.

---

## Prompt Cursor — sesión tipo (copiar)

```text
Actúa como arquitecto EPIS2 (SDEPIS2). Sesión PROG-PAPER-MODE.

Leer:
- docs/product/EPIS2_PAPER_MIRROR_RECONCILIATION.md
- docs/quality/paper-mode-ledger.json
- reports/dev-agent-prompt-paper-mode.md

Declarar: MF activo · allowedPaths · gate cierre.

Objetivo: [MF-PAPER-06 paginación | MF-PAPER-08 comandos IA] — consultar quality:paper-mode-next.

Reglas:
- Extender components/chart/paper/ y clinical-forms — NO apps/web/src/paper-mode/
- Un Form Registry · PostgreSQL SoT · IA no firma · PDF solo salida/plantilla
- PROG-PAPER-MIRROR prohibido hasta PM-09 DONE

Entregar: diff mínimo · gates · reporte reports/epis2-mf-paper-XX-*.md · sin commit.
```

---

*El comando acompaña al médico; la ficha lo orienta.*
