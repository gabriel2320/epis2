# EPIS2 — Plan de desarrollo automatizado: modos dual ficha (PROG-DUAL-CHART)

**Versión:** 1.0 · **Fecha:** 2026-06-10  
**ADR:** [`ADR-002-dual-chart-modes.md`](../adr/ADR-002-dual-chart-modes.md)  
**Ledger:** [`docs/quality/dual-chart-ledger.json`](../quality/dual-chart-ledger.json)  
**Precedencia:** post PROG-THREE-MODES · paralelo a olas clínicas

> **Fuente única** del programa dual ficha. Automatización: `npm run quality:dual-chart-plan`.

---

## Tabla de nomenclatura

| Capa | ID canónico | Nombre |
|------|-------------|--------|
| Programa | **PROG-DUAL-CHART** | Dos modos ficha + command bar transversal |
| Roadmap | **EPIS2-PM-02** | Dual chart modes (alias plan visual mayor) |
| Fases | **MF-DUAL-CHART-00…05** | Scaffold → launcher |
| Quality gates | **DC-00…DC-05** | `quality:dual-chart-*-gate` |
| Flag | `VITE_ENABLE_DUAL_CHART_MODES` | Preview + router switch (default DEV) |

**Decisión MUI:** **No abandonar.** Dos composiciones sobre `@epis2/epis2-ui` (electrónico denso + papel institucional).

---

## Norte arquitectónico

```text
Login → /comando (HOME — launcher delgado en fase 5)
         └─► /espacio/ficha?patientId=&chartMode=traditional|paper
                  ClinicalShell (siempre)
                  ├── PatientChartBanner
                  ├── ChartModeSwitch
                  ├── TraditionalEhrMode | PaperChartMode
                  ├── CommandPaletteOverlay (Ctrl+K)
                  └── EpisUniversalCommandBar (dock transversal)

Legacy congelado (bugfix only):
  ?mode=classic · /epis2/dashboard?mode=dashboard
```

Referencias Figma Make:

- [Medical Record — ficha electrónica](https://www.figma.com/make/PhZ55jJhxLQUtIWEuf17ZO/Medical-Record)
- [Ficha papel editable](https://www.figma.com/make/AJ9MNrSyClA0hh8jB8sx49/Crear-p%C3%A1ginas-de-ficha-m%C3%A9dica)

---

## Automatización (comandos)

| Comando | Uso |
|---------|-----|
| `npm run quality:dual-chart-ledger` | Valida ledger JSON (1 READY, deps) |
| `npm run quality:dual-chart-next` | JSON fase activa + comandos |
| `npm run dev:dual-chart:session` | Genera `reports/dual-chart-session-brief.md` |
| `npm run quality:dual-chart-plan` | Gate de fase activa |
| `npm run quality:dual-chart-plan -- --phase N` | Gate fase N |
| `npm run quality:dual-chart-plan -- --through N` | Gates 0…N acumulados |
| `npm run quality:dual-chart-plan -- --verify` | `check` + gate + unit chart |
| `npm run quality:dual-chart-plan -- --verify --e2e --legacy` | Cierre fase completo |
| `npm run quality:dual-chart-gate` | Ledger + scaffold + gate activo |
| `npm run test:unit:chart` | Vitest `components/chart/` |
| `npm run test:e2e:dual-chart` | Playwright (flag opt-in) |

### Flujo diario recomendado

```bash
npm run stack:dev
npm run dev:dual-chart:session          # brief → reports/dual-chart-session-brief.md
npm run quality:dual-chart-next         # confirmar MF-DUAL-CHART-NN READY

# desarrollo…

npm run quality:dual-chart-plan -- --verify --e2e
npm run test:e2e:three-modes            # legacy intacto
npm run dev:agent:close
```

### Cierre de fase (manual en ledger)

1. Gate de fase pasa: `npm run quality:dual-chart-plan -- --phase N --verify --e2e --legacy`
2. Completar `reports/epis2-mf-dual-chart-NN-*.md`
3. Editar `dual-chart-ledger.json`: fase `DONE` → siguiente `READY`
4. `npm run quality:dual-chart-ledger`

---

## Fases detalladas

### MF-DUAL-CHART-00 — Scaffold (DONE)

**Objetivo:** ADR, tokens, `ClinicalShell`, preview `/dev/chart-modes`, Storybook, E2E opt-in.

**Entregables:**

- [x] ADR-002 + mapa rutas + migración
- [x] `apps/web/src/components/chart/*`
- [x] `chart-modes-tokens.ts` (traditional + paper)
- [x] `PaperChartTemplate` 7 secciones I–VII
- [x] `paperChartPrint.css` Carta/A5 (no A4)
- [x] E2E `dual-chart-modes.spec.ts` (a–f)
- [x] Storybook `ChartModesPreview.stories.tsx`

**Gate:** `npm run quality:dual-chart-scaffold-gate`

**Preview:** `VITE_ENABLE_DUAL_CHART_MODES=true` → `/dev/chart-modes`

---

### MF-DUAL-CHART-01 — Paridad visual traditional (READY)

**Objetivo:** EMR denso alineado a Figma Medical Record; command bar en todo `/espacio/*`.

**Alcance permitido:**

```text
apps/web/src/routes/chartModeSearch.ts          (nuevo)
apps/web/src/components/chart/TraditionalEhrMode.tsx
apps/web/src/components/chart/ClinicalShell.tsx
apps/web/src/pages/PatientWorkspacePage.tsx     (solo rama flag, sin romper legacy)
apps/web/src/layouts/ClinicalShellLayout.tsx
packages/design-system/src/copy/es.ts
```

**Tareas:**

1. Crear `parseChartModeSearch()` — `chartMode`, `section`, `printFormat`
2. Integrar `PatientClinicalSummaryGrid` en área central `TraditionalEhrMode`
3. Nav lateral: anamnesis, examen, evolución, labs, meds, epicrisis
4. Panel derecho contexto/IA ≥1280px (`EpisClinicalContextPane` o stub)
5. Montar `ClinicalShell` + dock command en rutas `/espacio/*` (flag)

**DoD:**

- [ ] Gate `quality:dual-chart-traditional-gate` verde
- [ ] Unit chart tests verdes
- [ ] E2E preview o `/espacio/ficha` con flag
- [ ] `three-modes-journey` sin cambios

**Sesión Cursor:** `@reports/dual-chart-session-brief.md`

---

### MF-DUAL-CHART-02 — Modo papel SoT

**Objetivo:** Datos estructurados por sección; impresión real Carta/A5; borrador PostgreSQL.

**Alcance:**

```text
packages/clinical-forms/src/paper-chart/**     (blueprints Zod I–VII)
apps/api/src/**/paper-chart*                   (draft API)
apps/web/src/components/chart/paper/**
apps/web/src/routes/router.tsx                   (+ /espacio/ficha/imprimir)
```

**Tareas:**

1. Blueprint Zod por sección — mapeo a campos clínicos existentes
2. API borrador JSONB (reutilizar drafts si aplica)
3. `PaperChartTemplate`: `onSectionChange` → persistencia
4. Ruta print preview con `printFormat=letter|a5`
5. Extender golden journey (papel mínimo)

**DoD:**

- [ ] Gate `quality:dual-chart-paper-sot-gate`
- [ ] E2E edita anamnesis + print Carta/A5
- [ ] IA solo propone borrador — humano firma

**Editor rico (fase 2b, opcional):** interfaz `ClinicalDocumentSectionEditor`; Tiptap/Lexical tras gate seguridad deps.

---

### MF-DUAL-CHART-03 — Router switch

**Objetivo:** `/espacio/ficha?chartMode=` canónico; legacy default sin flag.

**Alcance:**

```text
apps/web/src/pages/DualChartPatientPage.tsx      (nuevo)
apps/web/src/pages/PatientWorkspacePage.tsx
apps/web/src/routes/router.tsx
apps/web/src/routes/clinicalNavigate.ts
```

**Pseudocódigo:**

```tsx
if (isDualChartModesEnabled() && patientId) {
  return <DualChartPatientPage chartMode={parseChartModeSearch(search)} />;
}
// legacy PatientWorkspacePage stack
```

**DoD:**

- [ ] Default `chartMode=traditional`
- [ ] E2E incluye `/espacio/ficha`
- [ ] `three-modes-journey` intacto

---

### MF-DUAL-CHART-04 — Congelar legacy

**Objetivo:** Classic/dashboard bugfix-only; redirect suave a `chartMode=traditional`.

**Tareas:**

1. Banner deprecación `EpisModeSwitcher`
2. `clinicalNavigate`: `?mode=classic` → `chartMode=traditional`
3. Mantener dashboard turno hasta signoff clínico

**DoD:**

- [ ] `quality:three-modes-gate` + `quality:dual-chart-legacy-freeze-gate`

---

### MF-DUAL-CHART-05 — Comando launcher + invariante #6

**Objetivo:** Home = búsqueda paciente; ficha = workspace principal.

**Tareas:**

1. `CommandCenterPage` layout slim (sin hero dashboard)
2. Enmienda `PRODUCT_INVARIANTS.md` #6
3. ADR-002 estado **Aceptado**
4. `EPIS2_DUAL_CHART_CLINICAL_SIGNOFF.md`

**DoD:**

- [ ] Signoff producto + clínica
- [ ] Gate launcher verde

---

## Mapa de rutas (resumen)

Ver [`EPIS2_DUAL_CHART_ROUTE_MAP.md`](../architecture/EPIS2_DUAL_CHART_ROUTE_MAP.md).

| Ruta | Modo | Shell |
|------|------|-------|
| `/comando` | Launcher | EpisAppScaffold |
| `/espacio/ficha?chartMode=traditional` | EMR denso | ClinicalShell |
| `/espacio/ficha?chartMode=paper` | Documento | ClinicalShell |
| `/espacio/ficha/imprimir` | Print | ClinicalShell |
| `/dev/chart-modes` | Preview dev | ClinicalShell |
| `?mode=classic` | Legacy | EpisClassicMd3Shell |

---

## Matriz de tests

| Test | Fases | CI |
|------|-------|-----|
| `three-modes-journey.spec.ts` | 0–5 | Siempre |
| `dual-chart-modes.spec.ts` | 0+ | Opt-in flag |
| `test:unit:chart` | 0+ | Con `--verify` |
| Storybook ChartModes | 0+ | Manual / Chromatic futuro |
| `quality:golden-journey` | 2+ ext. | Pre-release |

Casos E2E dual chart (a–f):

1. Abre ficha electrónica
2. Alterna a ficha papel
3. Edita anamnesis
4. Previsualiza Carta
5. Previsualiza A5
6. Command bar ambos modos + Ctrl+K

---

## Design tokens

| Token set | Archivo | Uso |
|-----------|---------|-----|
| `epis2TraditionalChartTokens` | `chart-modes-tokens.ts` | Nav 240px, banner 72px, context 360px |
| `epis2PaperChartTokens` | `chart-modes-tokens.ts` | Navy `#0B2540`, paper `#FAFAF8`, letter/A5 px |

Import: `@epis2/epis2-ui/theme` — **no** `@mui/*` desde apps/web.

---

## Rollback

```bash
VITE_ENABLE_DUAL_CHART_MODES=false
```

Rutas legacy sin cambios. Ledger puede revertir fase a `IN_PROGRESS`.

---

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| Conflicto invariante #6 | Fases 0–4 mantienen `/comando` home |
| Regresión three-modes | Gate `--legacy` en cierre fase |
| Scope editor rico | MVP textarea + Zod; Tiptap fase 2b |
| components/ congelado | Subcarpeta `chart/` ✓ |

---

## Documentos relacionados

- [`EPIS2_DUAL_CHART_MIGRATION.md`](../architecture/EPIS2_DUAL_CHART_MIGRATION.md)
- [`EPIS2_THREE_MODES_DEV_PLAN.md`](../product/EPIS2_THREE_MODES_DEV_PLAN.md) (legacy congelado)
- [`EPIS2_FIGMA_CODE_CONNECT.md`](../dev/EPIS2_FIGMA_CODE_CONNECT.md)
