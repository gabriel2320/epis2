# EPIS2 — Conciliación Paper Clinical OS · Motor espejo

**Versión:** 1.0 · **Fecha:** 2026-06-11  
**Estado:** Canónico para planificación (no implementación greenfield)  
**Programa actual:** PROG-PAPER-MODE (MF-PAPER-00…05 **DONE**)  
**Programa propuesto:** PROG-PAPER-MIRROR (post MF-PAPER-09)  
**Referencias:** [EPIS2_PAPER_MODE_DEV_PLAN.md](./EPIS2_PAPER_MODE_DEV_PLAN.md) · [ADR-002](../adr/ADR-002-dual-chart-modes.md) · [ADR-004 propuesto](../adr/ADR-004-paper-mirror-expansion-proposed.md)

---

## 1. Veredicto ejecutivo

El prompt «Paper Clinical OS / motor dual en espejo» describe la **dirección correcta de producto**:

```text
Modo clásico (operativo)  ←→  Modelo clínico único  ←→  Modo papel (documental)
```

**EPIS2 ya adopta** gran parte de la identidad (Carta noble, A5 auxiliar, SoT PostgreSQL, IA fuera del área imprimible, sin dashboard en papel, borrador→firma humana). Lo que **aún no existe** es el **motor espejo**: hoy `chartMode=traditional` y `chartMode=paper` son **dos vistas paralelas** sobre datos **parcialmente solapados**, no un `ClinicalDocumentState` compartido con sincronización bidireccional.

**Conciliación obligatoria:**

| Prompt propone | EPIS2 adopta | Motivo |
|----------------|--------------|--------|
| `apps/web/src/paper-mode/mirror/` | **Rechazado** → `packages/clinical-forms/` + `components/chart/` | Ledger `noParallelRoot`; invariante #10 |
| `ClinicalMirrorProvider` + `PaperCommandAgent` | **Provider sí** · **Agent no** | Ctrl+K + panel derecho (ADR-002) |
| `PdfBridgeEngine` carpeta raíz | **Extender** `documentIntake` + print existente | Ya hay intake demo; PDF = salida |
| 15 `ClinicalDocumentType` day-1 | **Diferido** → blueprints existentes | Recon MF-PAPER-00 |
| `PaperExpansionEngine` automático | **Fase 2** tras signoff PM-09 | P0 manual primero |
| `PaperQualityGate` score 0.92/0.97 | **MF-PAPER-09** + ampliación mirror | Auditoría incremental |
| Tiptap/Lexical en papel | **ADR separado** + gate seguridad | ADR-002 fase 2 |
| PDF como SoT | **Prohibido** | Invariante #5, #12 |
| XFA canónico | **Prohibido** | Solo referencia / conversión |

**Frase guía conciliada:** *Un contrato clínico, dos renderizadores; PostgreSQL decide, el papel impresiona.*

---

## 2. Estado actual vs motor espejo (auditoría 2026-06-11)

### 2.1 Entregado (PROG-PAPER-MODE)

| MF | Entrega | Alineación prompt |
|----|---------|-------------------|
| 00 | Recon + gap | ✓ Rechaza greenfield `paper-mode/` |
| 01 | Tokens marfil, grilla 6mm, print CSS | ✓ Estética máquina de escribir |
| 02 | `PaperFieldRow`, `PaperTextarea`, `PaperSection` | ✓ Componentes papel nativos |
| 03 | `PaperFieldState`, IA `ai_draft`, `canSignPaperChart` | ✓ Reglas 5, 8, 9 del mirror |
| 04 | `PaperSectionNavigator` I–VII + scroll/`?section=` | ✓ Nav documental |
| 05 | Toolbar guardar/firmar/PDF + API approve | ✓ Firma bloqueada IA; read-only post-firma |

### 2.2 Scaffold dual (PROG-DUAL-CHART — cerrado)

- `DualChartPatientPage`: switch `traditional` \| `paper` sin perder paciente
- SoT `paper_chart` JSONB + Zod v2 backward-compatible
- Command palette transversal; panel contexto colapsable
- Print Carta/A5 vía HTML/CSS (`paperChartPrint.css`, `PrintLetterDocument`)

### 2.3 Brecha espejo (MF-PA-05 MVP ✓)

```text
Entregado MF-PA-05:
  mirrorReconcile.ts — seed summaryFields → paper_chart (borrador vacío)
  getPaperChartState — mirrorSeeded en carga empty
  PAPER_MIRROR_VARIABLE_KEYS + CHART_SECTION_MIRROR_BINDINGS

Pendiente PROG-PAPER-MIRROR:
  applyMirrorEvent() bidireccional en tiempo real
  Modo split classic|paper
  PdfTemplateProfile / AcroForm mapping
  PaperQualityGate mirrorSyncWorks = true
```

**Riesgo si se implementa el prompt literal:** segundo registry, dos SoT, duplicación validaciones — **viola** invariantes #10, #12 y postmortem EPIS.

---

## 3. Arquitectura conciliada (objetivo escalable)

### 3.1 Capas (una sola verdad)

```text
PostgreSQL (clinical_drafts, clinical_notes, approvals)
        ↓
packages/clinical-forms/          ← único Clinical Form Registry (#10)
  paper-chart/schema.ts           ← MVP: 7 secciones
  [futuro] mirror/bindings.ts     ← ClinicalFieldBinding
  [futuro] mirror/events.ts       ← ClinicalMirrorEvent
        ↓
ClinicalDocumentState (normalizado)
        ↓
┌─────────────────────────┬─────────────────────────┐
│ TraditionalEhrMode      │ PaperChartMode          │
│ grids, panels, forms    │ PaperChartTemplate      │
│ EpisClinicalFormRhf     │ PaperFieldRow/Textarea  │
└─────────────────────────┴─────────────────────────┘
        ↓
CommandPalette + ClinicalRightContextPanel (IA transversal)
        ↓
Print / PDF Bridge (salida, no SoT)
```

### 3.2 Reglas de sincronización (adoptadas del prompt, implementación diferida)

| # | Regla prompt | EPIS2 hoy | Target PROG-PAPER-MIRROR |
|---|--------------|-----------|---------------------------|
| 1 | Editar clásico → actualiza papel | ✗ | Patch vía `clinicalPath` → sección paper |
| 2 | Editar papel → actualiza clásico | ✗ | Patch sección → blueprint field |
| 3 | PDF import → modelo clínico | Parcial (intake texto) | PdfBridge sobre intake |
| 4 | IA propone sobre modelo, no DOM | ✓ paper PM-03 | Extender a todos los drafts |
| 5 | Firma bloquea ambos modos | ✓ paper PM-05 | Extender a draft types |
| 6 | Enmienda = nueva versión | ✓ approveDraft | Mirror version field |
| 7 | Cada cambio auditado | ✓ API audit | Mirror event log |

### 3.3 `ClinicalFieldBinding` conciliado

No crear tipo nuevo en `paper-mode/`. Extender `clinical-forms`:

```ts
/** packages/clinical-forms/src/mirror/fieldBinding.ts (PROPUESTO) */
export type ClinicalFieldBinding = {
  fieldId: string;
  label: string;
  clinicalPath: string; // ej. "encounter.anamnesis.narrative"
  zodRuleId: string;    // referencia schema existente
  classicWidget: 'TextField' | 'Select' | 'DatePicker' | 'Textarea';
  paperWidget: 'PaperFieldRow' | 'PaperTextarea' | 'PaperTableCell';
  printRole: 'metadata' | 'typed-field' | 'clinical-body' | 'signature';
  required: boolean;
  /** Hereda PaperFieldState.source en paper_chart */
};
```

MVP actual ya es un binding **coarse-grained** (7 secciones ↔ 7 bloques narrativos). El mirror fino mapea **blueprints existentes** (`evolution_note`, `discharge_summary`, …) a subcampos papel.

---

## 4. PDF Bridge — conciliación

### 4.1 Casos del prompt vs EPIS2

| Caso | Prompt | EPIS2 conciliado |
|------|--------|------------------|
| A AcroForm | pdf-lib read/fill | **MF-MIRROR-PDF-01** — extender `documentIntake.ts`; perfil plantilla en DB |
| B PDF plano | PDF.js + overlay | **MF-MIRROR-PDF-02** — overlay EPIS2; no SoT en PDF |
| C XFA | No canónico | **Rechazado** como fuente; referencia/OCR solo |

### 4.2 Rutas canónicas (no `paper-mode/pdf-bridge/`)

```text
apps/api/src/clinical/documentIntake.ts     ← ampliar
apps/api/src/clinical/pdfTemplate.ts        ← nuevo (perfil + hash)
apps/web/src/components/chart/paper/pdf/    ← UI wizard/mapper
packages/clinical-forms/src/pdf-bridge/     ← tipos Zod PdfTemplateProfile
```

Flujo conciliado:

```text
1. Subir PDF → hash + detectar tipo
2. AcroForm → listar campos → inferClinicalPath (IA + diccionario ES clínico)
3. Humano confirma → PdfTemplateProfile en PostgreSQL
4. Llenar desde ClinicalDocumentState / paper_chart
5. Export → HTML print nativo EPIS2 o PDF completado (salida inmutable + audit)
```

**Regla de oro (adoptada):** PDF importado = plantilla o salida; **EPIS2 Clinical Model = SoT**.

---

## 5. Paper Expansion — conciliación

El prompt `PaperExpansionEngine` **no** debe generar 40 rutas `/paper/...` automáticamente. EPIS2 ya tiene plan por prioridades:

| Prioridad prompt | EPIS2 MF / programa |
|------------------|---------------------|
| P0 evolución, ingreso, epicrisis, receta, orden | MF-PAPER-07 puente · blueprints existentes |
| P1 enfermería, vitales, lab, imagen | PROG-PAPER-PLANNER + rutas print |
| P2 consentimientos, certificados | Print A5 existente |
| P3 admin | Fuera de scope papel |

**Motor de expansión conciliado:** inventario estático (`PaperScreenInventory.ts`) + scoring manual en ADR-004, no generador de rutas ciego.

---

## 6. Paper Quality Gate — conciliación

MF-PAPER-09 entrega `PaperVisualAudit` (vitest DOM). El prompt añade score numérico:

```ts
/** Objetivo MF-PAPER-09 + PROG-PAPER-MIRROR */
type PaperQualityGate = {
  documentIdentity: boolean;
  correctPaperSize: boolean;       // Carta default; A5 solo auxiliar
  baselineGridAligned: boolean;
  noDashboardInsidePaper: boolean;
  noMaterialCardsInsidePaper: boolean;
  noButtonsInsidePrintableArea: boolean;
  printCssPresent: boolean;
  printHidesUi: boolean;
  headerFooterPresent: boolean;
  signaturePresentWhenRequired: boolean;
  mirrorSyncWorks: boolean;        // false hasta PROG-PAPER-MIRROR
};
// Regla: ≥0.92 pantalla papel; ≥0.97 documentos P0 post-signoff
```

---

## 7. Mapa prompt → ubicación EPIS2

| Módulo prompt | Ubicación conciliada | Cuándo |
|---------------|----------------------|--------|
| `ClinicalMirrorEngine` | `packages/clinical-forms/src/mirror/` | PROG-PAPER-MIRROR |
| `ClinicalMirrorProvider` | `apps/web/src/components/chart/mirror/` | PROG-PAPER-MIRROR |
| `SplitMirrorDebugView` | `apps/web/src/dev/` (flag dev) | PROG-PAPER-MIRROR |
| `PdfBridgeEngine` | `packages/clinical-forms/src/pdf-bridge/` + API | Post MF-PAPER-09 |
| `PaperExpansionEngine` | `docs/product/` + MF-PAPER-07 | Paralelo PM-06 |
| `PaperQualityGate` | `apps/web/src/components/chart/paper/audit/` | MF-PAPER-09 |
| Paper Planner | `components/chart/paper/planner/` | PROG-PAPER-PLANNER |

---

## 8. Prompt Cursor conciliado (usar en sesiones)

Ver [`reports/dev-agent-prompt-paper-mode.md`](../../reports/dev-agent-prompt-paper-mode.md) § Motor espejo.

**Orden de ejecución:**

```text
1. Cerrar PROG-PAPER-MODE (MF-06…09)
2. Entrega C-4 staging
3. PROG-PAPER-PLANNER-00 (ADR-003) si paths disjuntos
4. ADR-004 aceptado → PROG-PAPER-MIRROR MF-MIRROR-00…
```

**Prohibido en toda sesión:** carpeta `apps/web/src/paper-mode/` · segundo Form Registry · PDF como SoT · `PaperCommandAgent` duplicado.

---

## 9. Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| Implementar mirror antes de cerrar PM-09 | Ledger: MIRROR blocked until PM-09 |
| Duplicar campos classic vs paper | ClinicalFieldBinding en clinical-forms |
| pdf-lib scope creep | AcroForm P1; flat PDF P2; XFA nunca SoT |
| Split mode en prod | Solo dev flag + Storybook |
| Schema break multi-draft | parse tolerant + version field |

---

## 10. Próximo paso exacto

```bash
npm run quality:paper-mode-next   # → MF-PAPER-06 READY
npm run dev:session
```

**Sesión tipo:** MF-PAPER-06 paginación **o** MF-PAPER-08 comandos IA (paralelo permitido si paths disjuntos).

**Documentación mirror:** leer este doc + ADR-004 propuesto antes de escribir código mirror.

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
