# EPIS2 — Plan de desarrollo automatizado: modos dual ficha (PROG-DUAL-CHART)

> **SUPERSEDED_BY_CICA (2026-06-19):** plan historico de dual chart. Canon operativo: modo clasico + modo papel dentro de CICA `/app/*`; no reactivar three modes ni home legacy.

**Versión:** 2.0 · **Fecha:** 2026-06-11  
**ADR:** [`ADR-002-dual-chart-modes.md`](../adr/ADR-002-dual-chart-modes.md)  
**Canon visual:** [`EPIS2_DUAL_CHART_VISUAL_CANON.md`](../design/EPIS2_DUAL_CHART_VISUAL_CANON.md)  
**Ledger:** [`docs/quality/dual-chart-ledger.json`](../quality/dual-chart-ledger.json)

> **Fuente única** del programa dual ficha. Automatización: `npm run quality:dual-chart-plan`.

---

## Decisión visual mayor (v2)

```text
EPIS2
└── Ficha del paciente
    ├── Modo Ficha Electrónica (traditional)
    └── Modo Ficha Papel (paper)
```

**Barra de comandos:** transversal (Ctrl+K), **no** tercer modo visual.

**Deprecar como experiencia principal:** Command Center · Modo Clásico · Dashboard.

**Flujo canónico:**

```text
Login → Búsqueda/Censo → Ficha → [Ficha Electrónica | Ficha Papel]
```

**Cuatro capas fijas:** Header institucional · Banda paciente · Barra clínica · Contenido + Footer estado.

**MUI:** mantener vía `@epis2/epis2-ui` — dos composiciones (denso institucional + documento papel).

---

## Nomenclatura

| Capa | ID | Nombre |
|------|-----|--------|
| Programa | **PROG-DUAL-CHART** | Dos modos ficha + command transversal |
| Roadmap | **EPIS2-PM-02** | Decisión visual mayor post three-modes |
| Fases | **MF-DUAL-CHART-00…09** | Scaffold → census-first + signoff |
| Gates | **DC-00…DC-09** | `quality:dual-chart-*-gate` |
| Flag | `VITE_ENABLE_DUAL_CHART_MODES` | Preview + switch progresivo |

---

## Automatización

| Comando | Uso |
|---------|-----|
| `npm run dev:dual-chart:session` | Brief fase READY |
| `npm run quality:dual-chart-next` | JSON fase activa |
| `npm run quality:dual-chart-plan -- --phase N --verify` | Gate + check |
| `npm run quality:dual-chart-plan -- --verify --e2e --legacy` | Cierre fase |

---

## Roadmap de fases

| Fase | ID | Estado | Entrega |
|------|-----|--------|---------|
| 0 | MF-DUAL-CHART-00 | **DONE** | ADR, ClinicalShell scaffold, tokens, E2E opt-in |
| 1 | MF-DUAL-CHART-01 | **DONE** | chartModeSearch, grid EMR, command `/espacio/*` |
| 2 | MF-DUAL-CHART-02 | **DONE** | Paper SoT Zod + API + `/espacio/ficha/imprimir` |
| 3 | MF-DUAL-CHART-03 | **DONE** | `DualChartPatientPage`, default `chartMode=traditional` |
| 4 | MF-DUAL-CHART-04 | **DONE** | **Anatomía shell v2** — header, banda, action bar, footer |
| 5 | MF-DUAL-CHART-05 | **DONE** | **TraditionalEhrLayout** — nav clínico completo + panel colapsable |
| 6 | MF-DUAL-CHART-06 | **DONE** | **PaperChartLayout v2** — toolbar documental + estética institucional |
| 7 | MF-DUAL-CHART-07 | **DONE** | Legacy freeze + redirects classic/dashboard |
| 8 | MF-DUAL-CHART-08 | **DONE** | **Census-first** — post-login búsqueda/censo (reemplaza comando hero) |
| 9 | MF-DUAL-CHART-09 | **DONE** | Enmienda invariante #6 + signoff + ADR Aceptado |

**Programa PROG-DUAL-CHART cerrado** — ledger 10/10 DONE · commit `eab749c` · auditoría [`reports/archive/2026-06/epis2-dual-chart-audit-2026-06-10.md`](../../reports/archive/2026-06/epis2-dual-chart-audit-2026-06-10.md).

---

## MF-DUAL-CHART-03 — Router switch (READY)

**Objetivo:** Ficha dual canónica en `/espacio/ficha` detrás de flag.

**Tareas:**

1. `DualChartPatientPage.tsx` — extraer rama dual de `PatientWorkspacePage`
2. Default `chartMode=traditional` con `patientId`
3. E2E `dual-chart-modes.spec.ts` incluye `/espacio/ficha`
4. Legacy modern stack intacto si flag=false

**Gate:** `quality:dual-chart-router-gate`

---

## MF-DUAL-CHART-04 — Anatomía shell v2

**Objetivo:** Cuatro capas fijas según canon visual §2–5, §9.

**Componentes nuevos/refactor:**

```text
ClinicalInstitutionalHeader     (azul marino 56–64px)
PatientIdentityBand             (reemplaza PatientChartBanner)
ClinicalActionBar               (modos + acciones + slot Ctrl+K)
ClinicalFooterStatus            (autoguardado + estado legal)
ClinicalShell                   (compone las 4 capas)
```

**Reglas:**

- Header **sin** guardar/firmar/imprimir.
- Alergias siempre en banda.
- Eliminar dock suelto; unificar en `ClinicalActionBar`.

**Gate:** `quality:dual-chart-shell-anatomy-gate` (nuevo)

**Copy:** `packages/design-system/src/copy/es.ts` → `chartShell.*`

---

## MF-DUAL-CHART-05 — TraditionalEhrLayout

**Objetivo:** Ficha electrónica hospitalaria densa — no wizard, no dashboard.

**Componentes:**

```text
TraditionalEhrLayout
├── TraditionalSectionNav      (17 secciones clínicas — canon §6)
├── TraditionalClinicalPanel   (sección activa tabular/compacta)
└── ClinicalRightContextPanel  (pendientes, labs, IA — colapsable)
```

**Contenido por sección (MVP incremental):**

| Sección | MVP |
|---------|-----|
| Resumen clínico | Grid actual + alertas |
| Evolución | Link `/espacio/evolucion` + lista borradores |
| Indicaciones | Tabla + CTA nueva |
| Laboratorio | Inbox resultados |
| Epicrisis | Link formulario |

**Prohibido:** botón “Siguiente” como navegación principal.

**Gate:** `quality:dual-chart-traditional-layout-gate`

---

## MF-DUAL-CHART-06 — PaperChartLayout v2

**Objetivo:** Documento institucional editable — Carta/A5, no A4.

**Componentes:**

```text
PaperChartLayout
├── PaperDocumentToolbar       (formato, zoom, guardar, firmar, print, PDF)
├── PaperSectionNavigator      (I–VII)
├── PaperPageCanvas            (hoja centrada, fondo gris)
├── PaperFieldLine / PaperTable / PaperSignatureBlock
└── PaperFooter                (confidencial + página N/M)
```

**Estética:** serif títulos · monoespaciado campos · cabecera `#0B2540` · sin cajas MUI en cuerpo.

**Gate:** `quality:dual-chart-paper-layout-gate`

---

## MF-DUAL-CHART-07 — Legacy freeze

**Objetivo:** Classic/dashboard bugfix-only; redirects suaves.

1. Banner deprecación `EpisModeSwitcher`
2. `?mode=classic` → `chartMode=traditional`
3. Dashboard turno → panel derecho / resumen clínico (no modo)

**Gate:** `quality:dual-chart-legacy-freeze-gate` + `quality:three-modes-gate`

---

## MF-DUAL-CHART-08 — Census-first

**Objetivo:** Post-login = búsqueda/censo de pacientes, no Command Center hero.

```text
/login → /pacientes (o /comando slim) → selección → /espacio/ficha
```

**Tareas:**

1. Reducir `CommandCenterPage` a búsqueda + recientes (sin widgets dashboard)
2. Ruta canónica censo: `/espacio/buscar-paciente` o nueva `/pacientes`
3. Redirect `/comando` → census cuando flag dual activo
4. Redistribuir widgets dashboard → `ClinicalRightContextPanel` + Resumen clínico

**Gate:** `quality:dual-chart-census-gate`

---

## MF-DUAL-CHART-09 — Signoff + invariante #6

**Objetivo:** Cierre programa visual mayor.

1. Enmienda `PRODUCT_INVARIANTS.md` #6: *Home = búsqueda paciente; workspace = ficha*
2. ADR-002 estado **Aceptado**
3. `docs/product/EPIS2_DUAL_CHART_CLINICAL_SIGNOFF.md`
4. `quality:golden-journey` extensión dual chart

**Gate:** `quality:dual-chart-launcher-gate` (renombrar a signoff en v2.1)

---

## Mapa de rutas objetivo

| Ruta | Rol post-MF-08 |
|------|----------------|
| `/login` | Auth |
| `/pacientes` o `/espacio/buscar-paciente` | **Censo canónico** |
| `/espacio/ficha?chartMode=` | **Workspace principal** |
| `/espacio/ficha/imprimir` | Print Carta/A5 |
| `/comando` | Legacy redirect → censo (MF-08) |
| `/epis2/dashboard` | Legacy congelado |
| `?mode=classic` | Legacy redirect (MF-07) |
| `/dev/chart-modes` | Preview dev |

Detalle: [`EPIS2_DUAL_CHART_ROUTE_MAP.md`](../architecture/EPIS2_DUAL_CHART_ROUTE_MAP.md)

---

## Matriz E2E (obligatoria)

| Caso | Descripción |
|------|-------------|
| a | Abre ficha electrónica |
| b | Cambia a ficha papel |
| c | Edita anamnesis (modo papel) |
| d | Imprime/previsualiza Carta |
| e | Imprime/previsualiza A5 |
| f | Ctrl+K en ambos modos |

Spec: `e2e/dual-chart-modes.spec.ts` · CI opt-in `VITE_ENABLE_DUAL_CHART_MODES=true`

---

## Design tokens

| Token | Modo | Notas |
|-------|------|-------|
| `epis2TraditionalChartTokens` | Electrónico | Denso, nav 240px, context 360px |
| `epis2PaperChartTokens` | Papel | Navy `#0B2540`, paper `#FAFAF8`, letter/A5 |
| *(nuevo MF-04)* `epis2ClinicalShellTokens` | Shell | Header 56–64px, footer 32px |

Archivo: `packages/epis2-ui/src/theme/chart-modes-tokens.ts`

---

## Qué cambia vs primera imagen (turquesa)

| Actual problemático | Rediseño |
|--------------------|----------|
| Header turquesa genérico | Azul marino institucional |
| Botón “Siguiente” | Guardar / Firmar / sección |
| Campos grandes con aire | Tabular compacto |
| Paciente débil abajo | `PatientIdentityBand` fija |
| Menú corto administrativo | Nav clínico hospitalario 17 ítems |
| Dashboard como modo | Panel derecho colapsable |

---

## Rollback

```bash
VITE_ENABLE_DUAL_CHART_MODES=false
```

Legacy three-modes intacto; tests `three-modes-journey` siempre verdes en CI.

---

## Documentos relacionados

- [`EPIS2_DUAL_CHART_MIGRATION.md`](../architecture/EPIS2_DUAL_CHART_MIGRATION.md)
- [`EPIS2_THREE_MODES_DEV_PLAN.md`](EPIS2_THREE_MODES_DEV_PLAN.md) (histórico — congelado)
- [`EPIS2_FIGMA_CODE_CONNECT.md`](../dev/EPIS2_FIGMA_CODE_CONNECT.md)
