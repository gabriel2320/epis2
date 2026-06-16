# EPIS2 — Plan de desarrollo modo papel (PROG-PAPER-MODE)

**Versión:** 1.0 · **Fecha:** 2026-06-11  
**Roadmap:** EPIS2-PM-03 (extensión post PROG-DUAL-CHART)  
**Predecesor:** [EPIS2_DUAL_CHART_DEV_PLAN.md](./EPIS2_DUAL_CHART_DEV_PLAN.md) · [ADR-002](../adr/ADR-002-dual-chart-modes.md)  
**Canon visual:** [EPIS2_DUAL_CHART_VISUAL_CANON.md](../design/EPIS2_DUAL_CHART_VISUAL_CANON.md) §5  
**Ledger:** [`docs/quality/paper-mode-ledger.json`](../quality/paper-mode-ledger.json)

> **Principio:** PROG-DUAL-CHART entregó el **scaffold** (shell, SoT, toolbar, 7 secciones). PROG-PAPER-MODE profundiza la **fidelidad clínica de papel**, impresión, IA asistida y agenda (Planner) **sin** duplicar registries ni crear `apps/web/src/paper-mode/`.

Automatización (cuando exista gate): `npm run quality:paper-mode-next`

---

## 1. Norte de producto

```text
Login → Censo/búsqueda → Ficha paciente
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
     chartMode=traditional              chartMode=paper
     (EMR denso)                        (documento institucional)

Ctrl+K + panel contexto = IA transversal (fuera del área imprimible)
PostgreSQL + clinical-forms = SoT · PDF/print = salida
```

**Meta visual:** hoja Carta/A5 reconocible para médicos chilenos — líneas pautadas, tipografía clínica, sin apariencia dashboard. **Meta técnica:** extender código bajo `components/chart/paper/` y `packages/clinical-forms/paper-chart/`.

**Frase guía:** *El papel es el lenguaje del modo paper; no reemplaza la ficha electrónica.*

---

## 2. Estado actual vs objetivo (gap)

| Área | Hecho (PROG-DUAL-CHART) | Gap (PROG-PAPER-MODE) | MF |
|------|-------------------------|------------------------|-----|
| Shell dual + switch | ✓ `DualChartPatientPage`, `ChartModeSwitch` | Pulir Calm Premium en paper (C-2) | — |
| SoT borrador | ✓ `paper_chart` Zod v2 + API | Mirror classic↔paper (PROG-PAPER-MIRROR) | PM-09+ |
| Secciones I–VII | ✓ `PaperChartTemplate` + navigator | Subplantillas SOAP/ingreso | PM-04 ✓ |
| Campos editables | ✓ campos papel nativos | — | PM-02 ✓ |
| Toolbar | ✓ guardar/firmar/PDF + approve | — | PM-05 ✓ |
| Print CSS | ✓ grilla 6mm; ocultar shell | Paginación N/M real | PM-01 ✓ / PM-06 |
| Paginación | Footer fijo `1/7` | Motor bloques + N/M real | PM-06 |
| Documentos A5 sueltos | ✓ receta, certificado, lab | Enlace desde ficha papel → rutas print | PM-07 |
| IA contextual | ✓ Ctrl+K global | Comandos paper en registry + borrador IA | PM-08 |
| Planner día/semana/mes | ✗ | PROG-PAPER-PLANNER (programa hermano) | PP-00…04 |
| Auditoría visual | Parcial E2E | `PaperVisualAudit` + gate | PM-09 |
| Prod | Flag off | Entrega C-4 staging/prod | C-4 |

---

## 3. Nomenclatura SDEPIS2

| Capa | ID | Nombre |
|------|-----|--------|
| Programa principal | **PROG-PAPER-MODE** | Extensión ficha papel post dual-chart |
| Programa hermano | **PROG-PAPER-PLANNER** | Agenda clínica papel (día · semana · mes) |
| Roadmap | **EPIS2-PM-03** / **EPIS2-PM-04** | Papel · Planner |
| Microfases | **MF-PAPER-01…09** | Ver ledger |
| Microfases planner | **MF-PAPER-PLANNER-00…04** | Ledger § planner |
| Gates | **PM-01…09** | `quality:paper-mode-*-gate` |
| Prerequisito | **Entrega C-4** | `VITE_ENABLE_DUAL_CHART_MODES=true` en dev/staging |

**Deprecado en docs nuevos:** carpeta `apps/web/src/paper-mode/` · `PaperTemplateRegistry` paralelo · `PaperCommandAgent` duplicado.

---

## 4. Arquitectura (extender, no reemplazar)

```text
apps/web/src/components/chart/
  PaperChartMode.tsx
  PaperDocumentToolbar.tsx
  paper/
    PaperChartTemplate.tsx      ← evolucionar
    PaperPageCanvas.tsx
    PaperFooter.tsx
    paperChartSections.ts       ← IDs canónicos I–VII
    paperChartPrint.css
    paperTypography.ts          ← nuevo PM-01
    paperPagination.ts          ← nuevo PM-06
    fields/                     ← PM-02 PaperFieldRow, PaperTextarea
    audit/                      ← PM-09 PaperVisualAudit
    planner/                    ← PROG-PAPER-PLANNER

packages/clinical-forms/src/paper-chart/
  schema.ts                     ← extender PM-03
  paper-chart-blueprint.ts

packages/epis2-ui/src/
  print/PrintLetterDocument.tsx · PrintA5Document.tsx
  theme/chart-modes-tokens.ts   ← epis2PaperChartTokens
  theme/paper-visual-reference.ts ← referencia FichaPapel (sx transversal)

packages/command-registry/        ← comandos IA paper PM-08
apps/api/src/clinical/paperChart.ts
```

**Invariantes:** #4 MUI vía `@epis2/epis2-ui` · #9/#10 registries únicos · #11 IA no firma · #12 borrador primero.

**Referencia visual:** [EPIS2_FICHAPAPEL_VISUAL_REFERENCE.md](../design/EPIS2_FICHAPAPEL_VISUAL_REFERENCE.md) · gate `quality:paper-mode-fichapapel-reference-gate`.

**Prohibido dentro de `.epis2-paper-page`:** `MuiCard`, `MuiDataGrid`, chips dashboard, botones.

---

## 5. Modelo documental

### 5.1 MVP actual (mantener)

7 secciones romanizadas en `PAPER_CHART_SECTION_IDS`: cover, anamnesis, physicalExam, orders, soap, labs, discharge.

### 5.2 Extensión PM-03 (metadatos por campo)

```ts
type PaperFieldMeta = {
  value: string;
  source: 'human' | 'ai_draft' | 'template' | 'system';
  confirmed: boolean;
  lastEditedAt?: string;
};
```

Persistencia: evolucionar JSONB `paper_chart` con migración backward-compatible (string plano → objeto opcional).

### 5.3 Tipos documentales (fases tardías)

No crear 15 tipos en MF-01. Mapear a **blueprints existentes**:

| Kind | Formato | Ruta / componente |
|------|---------|-------------------|
| `paper_chart` | Carta | `/espacio/ficha?chartMode=paper` |
| `progress_note` | Carta | sección V (soap) + `/espacio/evolucion` |
| `discharge_summary` | Carta | sección VII + `/espacio/epicrisis/imprimir` |
| `prescription` | A5 | `/espacio/receta/imprimir` |
| `medical_certificate` | A5 | print page existente |

Resolver tamaño:

```ts
function resolvePaperSize(kind: PaperDocumentKind): 'letter' | 'a5'
```

---

## 6. Roadmap de microfases (PROG-PAPER-MODE)

Orden optimizado por **impacto visual / riesgo / dependencias**.

### MF-PAPER-00 — Reconocimiento y baseline

**Depende de:** C-4 recomendado (flag on local)  
**Entrega:** reporte gap + capturas print actual vs Figma  
**Gate:** — (solo docs)  
**Salida:** `reports/epis2-paper-mode-recon-*.md`

---

### MF-PAPER-01 — Tokens + CSS print (grilla basal)

**Objetivo:** Unificar tokens prompt ↔ `epis2PaperChartTokens`; grilla 6mm; margen rojo; print limpio.

| Tarea | Archivo |
|-------|---------|
| Tokens marfil/ink/rule | `chart-modes-colors.ts`, `chart-modes-tokens.ts` |
| CSS vars + `@media print` shell | `paperChartPrint.css` |
| Ocultar AppBar/Drawer/toolbar en print | `paperChartPrint.css` |

**Gate:** `quality:paper-mode-tokens-gate`  
**Tests:** snapshot CSS vars · print rule exists  
**Esfuerzo:** 1 sesión

---

### MF-PAPER-02 — Campos papel nativos

**Objetivo:** Sustituir apariencia MUI de `EpisTextField` dentro del documento.

| Componente | Rol |
|------------|-----|
| `PaperFieldRow` | Grid label/valor clínico |
| `PaperTextarea` | Courier, line-height = baseline, sin borde |
| `PaperSection` | Título + avoidBreakInside |

**Gate:** `quality:paper-mode-fields-gate`  
**E2E:** dual-chart caso c (edita anamnesis) sigue verde  
**Esfuerzo:** 1–2 sesiones

---

### MF-PAPER-03 — Metadatos IA + validación firma

**Objetivo:** IA inserta `ai_draft`; firma bloqueada si no confirmado.

| Tarea | Detalle |
|-------|---------|
| Schema Zod v2 | `packages/clinical-forms/paper-chart/schema.ts` |
| API patch | `paperChart.ts` acepta meta |
| UI | subrayado punteado `.paper-ai-draft` |
| Validación | `canSignPaperChart()` antes de firmar |

**Gate:** `quality:paper-mode-ai-meta-gate`  
**Invariante:** #11, #12, #13  
**Esfuerzo:** 2 sesiones

---

### MF-PAPER-04 — Navigator + subestructura secciones

**Objetivo:** `PaperSectionNavigator` (I–VII); hints SOAP dentro de sección V.

| Tarea | Detalle |
|-------|---------|
| Nav lateral scroll-spy | solo fuera de `.epis2-paper-page` |
| Placeholders clínicos | copy en `design-system/es.ts` |
| Opcional | sub-secciones SOAP como texto guía, no campos separados SoT |

**Gate:** `quality:paper-mode-nav-gate`  
**Esfuerzo:** 1 sesión

---

### MF-PAPER-05 — Toolbar acciones clínicas

**Objetivo:** Conectar guardar/firmar/PDF en `PaperChartMode`.

| Acción | Implementación |
|--------|----------------|
| Guardar | autoguardado existente `usePaperChartDraft` + botón explícito |
| Firmar | flujo `approveDraft` + validación PM-03 |
| PDF | `window.print()` o ruta `/espacio/ficha/imprimir` |
| Zoom | opcional screen-only |

**Gate:** `quality:paper-mode-toolbar-gate`  
**E2E:** casos d/e print  
**Esfuerzo:** 1 sesión

---

### MF-PAPER-06 — Paginación real

**Objetivo:** Footer N/M dinámico; reglas avoidBreakInside (firma, encabezado sección).

| Tarea | Archivo |
|-------|---------|
| `estimateBlockLines` · `paginateDocument` | `paper/pagination/` |
| Integrar template | `PaperChartTemplate` multi-página screen |
| Print | `page-break-after` por hoja |

**Gate:** `quality:paper-mode-pagination-gate`  
**Tests:** unit pagination (firma no cortada)  
**Esfuerzo:** 2–3 sesiones

---

### MF-PAPER-07 — Puente documentos A5/Carta

**Objetivo:** Desde ficha papel, acciones rápidas a receta/epicrisis/orden A5.

| Tarea | Detalle |
|-------|---------|
| Links clínicos en toolbar o sección IV | `clinicalNavigate` |
| Reutilizar | `PrintA5Document`, `PrintLetterDocument` |
| No duplicar | layout print pages existentes |

**Gate:** `quality:paper-mode-doc-bridge-gate`  
**Esfuerzo:** 1 sesión

---

### MF-PAPER-08 — Comandos IA paper (registry)

**Objetivo:** Comandos contextuales vía `@epis2/command-registry`, no sidebar nuevo.

Comandos mínimos:

```text
ordenar_en_soap · resumir_ultimas_24h · preparar_impresion
preparar_epicrisis_borrador · crear_receta_a5 · detectar_pendientes
```

| Regla | Detalle |
|-------|---------|
| Inserción | assist API → patch sección como `ai_draft` |
| Panel | `ClinicalRightContextPanel` muestra borradores |
| Print | IA nunca en área imprimible |

**Gate:** `quality:paper-mode-ai-commands-gate` · `ai:evals:live` si `dev:ai`  
**Esfuerzo:** 2 sesiones

---

### MF-PAPER-09 — Auditoría visual + signoff

**Objetivo:** Cierre programa papel.

| Entrega | Detalle |
|---------|---------|
| `PaperVisualAudit` | vitest DOM checks |
| Stories | `ChartModesPreview.stories` ampliado |
| Signoff | `docs/product/EPIS2_PAPER_MODE_CLINICAL_SIGNOFF.md` |
| Capturas | 6 superficies (paper letter, a5, print, dark) |

**Gate:** `quality:paper-mode-signoff-gate`  
**Esfuerzo:** 1–2 sesiones

---

## 7. Programa hermano: PROG-PAPER-PLANNER

Agenda clínica estilo planificador físico — **independiente** del documento I–VII.

```text
chartMode=paper
  └── pestaña o ruta: Agenda
        ├── Día    (hoja carta — timeline + pendientes)
        ├── Semana (grid 7 cols, máx 4 ítems/día)
        └── Mes    (hitos: ingreso, alta, críticos, sin evolución)
```

| MF | Entrega | Gate |
|----|---------|------|
| MF-PAPER-PLANNER-00 | ADR-003 + `DailyClinicalPage` demo datos | `paper-planner-scaffold-gate` |
| MF-PAPER-PLANNER-01 | Semana + algoritmos | `paper-planner-week-gate` |
| MF-PAPER-PLANNER-02 | Mes + markers | `paper-planner-month-gate` |
| MF-PAPER-PLANNER-03 | Print planner + E2E | `paper-planner-print-gate` |
| MF-PAPER-PLANNER-04 | Comandos IA por vista | assist evals |

**Ubicación:** `apps/web/src/components/chart/paper/planner/`  
**Datos:** API encuentros, evoluciones, labs (no SoT nuevo)  
**Prohibido:** FullCalendar, DatePicker MUI dentro del papel

**Iniciar cuando:** MF-PAPER-02 DONE (estética base estable).

---

## 8. Integración con Hilo C y plan maestro

```text
Secuencia recomendada (2026-06-11):

  C-4 activar dual ficha (flag staging)
       ↓
  C-2 Calm Premium en shell paper (paralelo permitido)
       ↓
  MF-PAPER-00 → 01 → 02  (máximo impacto visual)
       ↓
  MF-PAPER-03 + 05  (flujo clínico completo)
       ↓
  MF-PAPER-06 + 07 + 08
       ↓
  MF-PAPER-PLANNER-00… (paralelo con 06 si paths disjuntos)
       ↓
  MF-PAPER-09 signoff
```

| Paralelo permitido | Paralelo prohibido |
|--------------------|-------------------|
| C-1 humano + MF-PAPER-01 | PM-03 + PM-08 mismo registry sin orden |
| C-3b resumen clínico + planner | PROG-PAPER + import EPIS |
| Evolab triage | Dos sesiones en `PaperChartTemplate` |

---

## 9. Gates y verificación

### Por sesión

```bash
npm run stack:dev
npm run dev:session
npm run check
npm run test -- apps/web/src/components/chart/paper/
npm run quality:dual-chart-gate          # si toca shell dual
npx playwright test e2e/dual-chart-modes.spec.ts
npm run dev:agent:close
```

### Matriz E2E (mantener + ampliar)

| Caso | MF relevante |
|------|--------------|
| a–b switch modos | baseline |
| c edita anamnesis | PM-02, PM-03 |
| d/e print Carta/A5 | PM-01, PM-05 |
| f Ctrl+K | PM-08 |
| g firma bloqueada con IA draft | PM-03 (nuevo) |
| h navigator sección | PM-04 (nuevo) |

---

## 10. Definition of Done (programa completo)

PROG-PAPER-MODE cerrado cuando:

1. C-4 Done — dual ficha activa en staging/prod  
2. MF-PAPER-01…09 en ledger **DONE**  
3. Campos papel sin apariencia formulario web en print preview  
4. IA borrador confirmable; firma bloqueada si pendiente  
5. Paginación N/M real en Carta  
6. Puente A5/Carta a documentos existentes  
7. `quality:paper-mode-signoff-gate` ✓  
8. `architecture:validate` ✓ · golden journey no regresiona  
9. Reporte cierre `reports/epis2-prog-paper-mode-close-*.md`

PROG-PAPER-PLANNER: criterio aparte tras MF-PLANNER-04.

---

## 11. Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| Reescritura greenfield `paper-mode/` | Ledger allowedPaths; gate architecture |
| Schema break `paper_chart` | Migración parse tolerant string→meta |
| Duplicar Command Agent | Solo command-registry + panel derecho |
| Scope editor rico (Tiptap) | Defer; ADR separado + gate seguridad |
| Flag off en prod | C-4 antes de signoff PM-09 |
| Calm Premium vs tokens marfil | PM-01 alinea con THEME-CALM-01 |

---

## 12. Próximo paso exacto

```text
MF-PAPER-06 (paginación) → MF-PAPER-07/08 en paralelo si paths disjuntos → MF-PAPER-09 signoff
       ↓
PROG-PAPER-MIRROR (post ADR-004) — ver §13
```

```bash
npm run stack:dev
npm run dev:session
npm run quality:paper-mode-next
```

**Cursor:** `@reports/dev-agent-brief.md` + `@reports/dev-agent-prompt-paper-mode.md`  
**Alcance sesión tipo:** MF-PAPER-06 · `paper/pagination/`

---

## 13. Fase 2 — Motor espejo (PROG-PAPER-MIRROR)

**Estado:** Propuesto · **Prerequisito:** MF-PAPER-09 DONE + Entrega C-4  
**Conciliación:** [`EPIS2_PAPER_MIRROR_RECONCILIATION.md`](./EPIS2_PAPER_MIRROR_RECONCILIATION.md)  
**ADR:** [`ADR-004-paper-mirror-expansion-proposed.md`](../adr/ADR-004-paper-mirror-expansion-proposed.md)

El prompt «Paper Clinical OS / motor dual en espejo» es la **evolución natural** post signoff papel. **No** implementar literalmente (`paper-mode/mirror/`, `PdfBridgeEngine` raíz, expansion automática).

### Arquitectura objetivo

```text
PostgreSQL → clinical-forms (único registry) → ClinicalDocumentState
                    ↓                                    ↓
         TraditionalEhrMode                    PaperChartMode
                    ↓                                    ↓
              CommandPalette + ClinicalRightContextPanel (IA)
                    ↓
         Print nativo EPIS2 · PDF Bridge (plantilla/salida)
```

### Secuencia recomendada

```text
MF-PAPER-06…09 (cerrar PROG-PAPER-MODE)
       ↓
C-4 staging/prod
       ↓
PROG-PAPER-PLANNER-00 (opcional paralelo)
       ↓
ADR-004 aceptado → PROG-PAPER-MIRROR (MF-MIRROR-00…)
       ↓
PdfBridge sobre documentIntake (MF-MIRROR-PDF-01…)
```

### Qué NO hacer antes de PM-09

- `ClinicalMirrorEngine` / `ClinicalMirrorProvider` productivos
- Segundo registry o SoT PDF
- Generador automático rutas `/paper/*`
- Modo split en producción

---

## Documentos relacionados

| Doc | Rol |
|-----|-----|
| [EPIS2_DUAL_CHART_DEV_PLAN.md](./EPIS2_DUAL_CHART_DEV_PLAN.md) | Scaffold cerrado MF-00…09 |
| [EPIS2_DUAL_CHART_VISUAL_CANON.md](../design/EPIS2_DUAL_CHART_VISUAL_CANON.md) | Anatomía §5 modo papel |
| [EPIS2_TABLERO.md](./EPIS2_TABLERO.md) | Hilo C activo |
| [reports/archive/2026-06/epis2-plan-maestro-desarrollo-por-partes-2026-06-11.md](../../reports/archive/2026-06/epis2-plan-maestro-desarrollo-por-partes-2026-06-11.md) | Orquestación global |
| [EPIS2_PAPER_MIRROR_RECONCILIATION.md](./EPIS2_PAPER_MIRROR_RECONCILIATION.md) | Conciliación motor espejo + PDF Bridge |
| [reports/dev-agent-prompt-paper-mode.md](../../reports/dev-agent-prompt-paper-mode.md) | Prompt sesión Cursor (conciliado) |

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
