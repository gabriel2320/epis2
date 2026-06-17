# MF-PAPER-00 — Reconocimiento modo papel (PROG-PAPER-MODE)

**Fecha:** 2026-06-11  
**Microfase:** MF-PAPER-00 · **Estado:** DONE  
**Programa:** PROG-PAPER-MODE · **Roadmap:** EPIS2-PM-03  
**Prerequisito ledger:** Entrega C-4 (flag dual ficha en staging/prod operador)  
**Plan:** [`docs/product/EPIS2_PAPER_MODE_DEV_PLAN.md`](../docs/product/EPIS2_PAPER_MODE_DEV_PLAN.md)

---

## 1. Alcance de sesión

| Campo | Valor |
|-------|-------|
| Objetivo | Inventario código + canon + gap vs objetivo Paper Clinical OS (conciliado) |
| Archivos tocados | Solo este reporte + ledger |
| Código producto | **Ninguno** (recon only) |
| Subagente | `gate-runner` (baseline) + lectura `layers-integrator` |

---

## 2. Baseline ejecutado

| Comando | Resultado |
|---------|-----------|
| `npm run quality:dual-chart-gate` | ✓ OK (ledger + scaffold) |
| `npm run quality:paper-mode-next` | ✓ MF-PAPER-00 READY |
| Vitest paper (3 archivos, 6 tests) | ✓ PASS |
| `npm run check` | No ejecutado en MF-00 (sin diff código) |

**Tests unitarios modo papel:**

```text
PaperChartTemplate.test.tsx     2/2
ChartModeSwitch.test.tsx        1/1
paper-chart/schema.test.ts      3/3
```

**E2E:** `e2e/dual-chart-modes.spec.ts` — 8 casos (a–h); requiere `VITE_ENABLE_DUAL_CHART_MODES=true`. CI job `e2e-dual-chart` verde en run [27351241135](https://github.com/gabriel2320/epis2/actions/runs/27351241135).

---

## 3. Inventario de implementación actual

### 3.1 UI (`apps/web/src/components/chart/`)

| Componente | Archivo | Estado |
|------------|---------|--------|
| Shell dual | `ClinicalShell.tsx` | ✓ 4 capas |
| Modo papel | `PaperChartMode.tsx` | ✓ toolbar + canvas + template |
| Toolbar | `PaperDocumentToolbar.tsx` | ✓ Carta/A5/print; save/sign/pdf **opcionales no cableados** |
| Template 7 secciones | `paper/PaperChartTemplate.tsx` | ✓ EpisTextField multiline |
| Canvas | `paper/PaperPageCanvas.tsx` | ✓ fondo gris + centrado |
| Footer | `paper/PaperFooter.tsx` | ✓ **estático** `1/7` |
| Secciones IDs | `paper/paperChartSections.ts` | ✓ I–VII alineado Zod |
| Print CSS | `paper/paperChartPrint.css` | ◐ básico (@page, ruled, no-print) |
| Switch modos | `ChartModeSwitch.tsx` | ✓ |
| Command overlay | `CommandPaletteOverlay.tsx` | ✓ Ctrl+K transversal |
| Panel contexto | `ClinicalRightContextPanel.tsx` | ✓ colapsable (sin UI IA paper-specific) |

### 3.2 Componentes canon §5 **ausentes**

| Canon visual | Implementado |
|--------------|--------------|
| `PaperSectionNavigator` | ✗ |
| `PaperFieldLine` | ✗ |
| `PaperTable` | ✗ |
| `PaperSignatureBlock` | ✗ |
| Clase `.epis2-paper-page` unificada | ✗ (usa testid + print classes) |
| Zoom toolbar | ✗ |
| Paginación N/M real | ✗ |

### 3.3 Datos y API

| Capa | Artefacto | Notas |
|------|-----------|-------|
| Zod | `packages/clinical-forms/paper-chart/schema.ts` | 7 campos string planos, max 16k |
| Blueprint | `paper-chart-blueprint.ts` | Registrado; route `/espacio/ficha/papel` |
| API | `apps/api/src/clinical/paperChart.ts` | GET/patch por sección; audit event |
| Hook web | `usePaperChartDraft.ts` | Debounce 600ms; sin loading UI en template |
| Print route | `PaperChartPrintPage.tsx` | `/espacio/ficha/imprimir` |
| Rutas ficha | `DualChartPatientPage.tsx` | `chartMode=traditional\|paper` |

### 3.4 Tokens y estética

| Token actual (`epis2PaperChartColors`) | Objetivo plan PM-01 |
|----------------------------------------|---------------------|
| `paperBg: #FAFAF8` | `#fffdf6` marfil cálido |
| `ruledLine: #C5CED8` | azul tenue `rgba(40,76,120,0.16)` |
| `marginLine: #E8ECF0` | rojo margen clínico tenue |
| Letter px 816×1056 | OK pantalla; mm print en CSS parcial |
| Tipografía | MUI `EpisTextField` + `titleMedium` chips — **no roles papel** |

### 3.5 Print / documentos relacionados

| Documento | Formato | Ruta | Integración ficha papel |
|-----------|---------|------|-------------------------|
| Ficha I–VII | Carta/A5 | template + print page | ✓ |
| Epicrisis | Carta | `/espacio/epicrisis/imprimir` | ✗ sin enlace desde paper |
| Receta | A5 | `/espacio/receta/imprimir` | ✗ |
| Certificado | A5 | print page | ✗ |
| Lab/imagen solicitud | A5 | print pages | ✗ |

### 3.6 IA y comandos

| Esperado (plan PM-08) | Actual |
|-----------------------|--------|
| Comandos paper en registry | Solo genéricos evolución/SOAP en `definitions.ts` |
| `ai_draft` / confirmación | ✗ schema string plano |
| Bloqueo firma IA pendiente | ✗ toolbar sign no conectado |
| Agente lateral dedicado | **Rechazado** — usar Ctrl+K + panel derecho |

### 3.7 Paper Planner

**Estado:** no iniciado (0 archivos en `paper/planner/`). Programa hermano PROG-PAPER-PLANNER post MF-PAPER-02.

---

## 4. Matriz gap (priorizada)

Leyenda: **P0** bloquea percepción clínica · **P1** flujo · **P2** polish · **P3** planner

| ID | Gap | Prioridad | MF |
|----|-----|-----------|-----|
| G-01 | Campos con apariencia formulario MUI (label, outline, borderRadius sección) | P0 | PM-02 |
| G-02 | Tokens marfil / margen rojo / grilla 6mm no alineados canon prompt | P0 | PM-01 |
| G-03 | Print no oculta shell AppBar/Drawer completo | P0 | PM-01 |
| G-04 | Sin metadatos IA ni bloqueo firma | P1 | PM-03 |
| G-05 | Toolbar save/sign/PDF no wired en `PaperChartMode` | P1 | PM-05 |
| G-06 | Footer página fija 1/7 | P1 | PM-06 |
| G-07 | Sin navigator I–VII | P2 | PM-04 |
| G-08 | Sin PaperTable / SignatureBlock | P2 | PM-02/06 |
| G-09 | Sin puente a receta/epicrisis A5/Carta | P2 | PM-07 |
| G-10 | Comandos IA contextuales paper | P2 | PM-08 |
| G-11 | PaperVisualAudit + signoff | P2 | PM-09 |
| G-12 | Agenda día/semana/mes | P3 | PP-00…04 |
| G-13 | C-4 prod flag operador | P1 (ops) | C-4 |
| G-14 | Canon §9 tabla “Pendiente MF-04” desactualizada | docs | Bloque 0 |

---

## 5. Evaluación vs ideas “Paper Clinical OS” (prompt maestro)

| Idea prompt | Veredicto EPIS2 |
|-------------|-----------------|
| Carpeta `paper-mode/` raíz | **Rechazado** — extender `chart/paper/` |
| Motor espejo classic↔paper | **Adoptado fase 2** — PROG-PAPER-MIRROR post PM-09 |
| PdfBridge / AcroForm | **Adoptado fase 2** — extender `documentIntake` |
| PaperExpansion automático | **Diferido** — MF-07 manual P0 |
| PaperQualityGate score | **Adoptado** — MF-PAPER-09 |
| 15 ClinicalDocumentType upfront | **Diferido** — mapear a blueprints existentes |
| PaperCommandAgent sidebar | **Rechazado** — CommandPalette + panel |
| Motor paginación completo day-1 | **En curso** — MF-PAPER-06 |
| Tipografía Arial/Times/Courier roles | **Adoptado** ✓ PM-01/02 |
| Carta noble + A5 auxiliar | **Adoptado** ✓ |
| PostgreSQL SoT, PDF salida | **Adoptado** ✓ |
| Planner físico | **Adoptado** — PROG-PAPER-PLANNER |

---

## 6. Matriz aceptación visual (Bloque 5 plan maestro — preview)

Evaluación **estática** (código + canon; capturas humanas en MF-PAPER-09).

| Eje | Estado actual | Notas |
|-----|---------------|-------|
| ¿Parece documento institucional? | **PARCIAL** | Navy header ✓; campos MUI rompen ilusión |
| ¿Carta/A5 conmutables? | **GO** | Toolbar + classes print |
| ¿Líneas pautadas? | **PARCIAL** | ruled gradient 24px ≠ baseline 6mm |
| ¿Imprimible sin UI? | **PARCIAL** | `.epis2-paper-chart-no-print` solo toolbar |
| ¿IA fuera del papel? | **GO** | Command bar fuera template |
| ¿SoT estructurado? | **GO** | paper_chart draft |
| ¿Switch sin perder paciente? | **GO** | E2E h |

**Veredicto recon:** **NO-GO signoff paper** hasta MF-PAPER-02 mínimo; **GO scaffold** PROG-DUAL-CHART.

---

## 7. Riesgos identificados

| Riesgo | Severidad | Mitigación |
|--------|-----------|------------|
| Schema v2 rompe borradores string | Media | Parse tolerant en PM-03 |
| Calm Premium (#F7F9FC) vs marfil paper | Baja | PM-01 tokens scoped a paper |
| Gate MF-06 solo existence check | Baja | PM-09 auditoría DOM |
| C-4 retrasado | Media | Dev local `.env.example` ya `true` |
| Duplicar print pages | Media | PM-07 enlaces, no reimplementar |

---

## 8. Recomendaciones MF-PAPER-01 (siguiente sesión)

**Objetivo:** máximo impacto visual con diff acotado.

1. Actualizar `epis2PaperChartColors.paperBg` → `#fffdf6`; `ruledLine` / `marginLine` según plan.
2. Ampliar `paperChartPrint.css`:
   - vars `--paper-baseline: 6mm`
   - `@media print` ocultar `.MuiAppBar-root`, `.MuiDrawer-root`, shell chrome
   - clase `.epis2-paper-page` en root template
3. Ajustar `epis2PaperDocumentSx` sombra pantalla only.
4. Test mínimo: assert stylesheet contiene `@media print` + token paperBg.

**Archivos permitidos:** ledger MF-PAPER-01.

**No hacer en PM-01:** campos nativos (PM-02), schema IA (PM-03).

---

## 9. Definition of Done MF-PAPER-00

- [x] Inventario código + API + tokens
- [x] Matriz gap priorizada
- [x] Baseline gates/tests paper
- [x] Conciliación prompt maestro vs EPIS2
- [x] Veredicto visual preliminar
- [x] Recomendaciones MF-PAPER-01
- [x] Ledger actualizado → MF-PAPER-01 READY

---

## 10. Próximo paso

```bash
npm run dev:session
npm run quality:paper-mode-next   # → MF-PAPER-01
```

**Cursor:** `@reports/dev-agent-prompt-paper-mode.md`  
**Alcance:** MF-PAPER-01 · tokens + CSS print  
**Gate objetivo:** `quality:paper-mode-tokens-gate` (crear en PM-01)

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
