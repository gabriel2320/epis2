# EPIS2 — Plan maestro por partes (evaluar · revisar · mejorar · seguir)

**Fecha:** 2026-06-11  
**Sistema:** [SDEPIS2](../docs/product/EPIS2_DEV_SYSTEM.md) · Tablero: [EPIS2_TABLERO.md](../docs/product/EPIS2_TABLERO.md)  
**Canon visual:** [EPIS2_DUAL_CHART_VISUAL_CANON.md](../docs/design/EPIS2_DUAL_CHART_VISUAL_CANON.md) · [EPIS2_DUAL_CHART_DEV_PLAN.md](../docs/product/EPIS2_DUAL_CHART_DEV_PLAN.md) · [EPIS2_TRADITIONAL_M3_SHAPE_COLOR_PLAN.md](../docs/design/EPIS2_TRADITIONAL_M3_SHAPE_COLOR_PLAN.md) (forma cuadrada · 8 paletas · barra comando)

> **Regla:** una sesión = una **entrega** o un **tramo** dentro de un programa. Sin mezclar registries. Sin auto-commit. IA planifica; humano aprueba.

---

## 0. Nomenclatura única (referencia rápida)

```text
Invariante
 └─ Ola (capacidad producto)
      └─ Hito (1A, EPIS2-05…)
           └─ Capa (L0–L6)
                └─ Hilo (secuencia activa: A…D, NORM, M3-R…)
                     └─ Programa (PROG-*)
                          └─ Entrega / Tramo / Microfase (MF-*)
                               └─ PR acotado
```

| Término | ID ejemplo | Uso en este plan |
|---------|------------|------------------|
| **Hilo** | Hilo C | Qué hacer **ahora** (Ola 3 longitudinal) |
| **Entrega** | C-1…C-4 | Unidad dentro del Hilo C |
| **Programa** | PROG-DUAL-CHART, PROG-CALM-PREMIUM | Iniciativa transversal con ledger propio |
| **Tramo** | THEME-CALM-01, UX-CALM-COMMAND | Sub-unidad visual o auto-dev |
| **Microfase** | MF-CLINICAL-SUMMARY-B | Sesión acotada con gate |
| **Gate** | DC-03, `quality:m3-signoff` | Criterio objetivo Done |

**Deprecado → no usar en docs nuevos:** Fase A/B plan global · Etapa · Story board · P1/P1b (usar Entrega C-n).

---

## 1. Norte visual (post PROG-DUAL-CHART)

### 1.1 Decisión mayor (v2)

```text
EPIS2
├── Flujo: Login → Censo/Búsqueda → Ficha paciente
└── Ficha paciente
    ├── Modo Ficha Electrónica   (chartMode=traditional)
    └── Modo Ficha Papel         (chartMode=paper)

Barra de comandos (Ctrl+K): TRANSVERSAL — no es tercer modo visual
```

### 1.2 Cuatro capas fijas (toda pantalla clínica)

| Capa | Componente canónico | Evaluar en cada entrega |
|------|---------------------|-------------------------|
| 1 | `ClinicalInstitutionalHeader` | Altura 56–64px · azul marino `#0B2540` |
| 2 | Banda paciente (identidad + alergias + estado) | Chips tonales · máx. 2 líneas |
| 3 | **Barra clínica** (modos ficha + acciones + **Ctrl+K**) | Siempre visible en ficha |
| 4 | Contenido + footer estado legal | Traditional vs Paper layout |

### 1.3 Conciliación documental pendiente

| Doc viejo | Doc nuevo | Acción Bloque 0 |
|-----------|-----------|-----------------|
| `EPIS2_MODES_LAYER.md` (command/classic/dashboard) | Canon dual ficha v2 | Marcar superseded; census-first reemplaza hero comando |
| Home = `/comando` (invariante producto) | Census-first post-login (visual) | **No violar** invariante #6: home sigue siendo Centro de Comando en routing; census-first es flujo UX dentro del shell |
| PROG-THREE-MODES (EPIS2-PM-01) | PROG-DUAL-CHART (EPIS2-PM-02) | Mantener gates legacy; experiencia principal = dual ficha |

---

## 2. Estado actual (snapshot 2026-06-11)

| Área | Estado | Evidencia |
|------|--------|-----------|
| Bootstrap EPIS2-00…12 | ✓ | Tablero § Hecho |
| Hilos A, B, D, UX-1, NORM, M3-R | ✓ | Reportes cierre |
| PROG-DUAL-CHART | ✓ código · flag **off** | `epis2-dual-chart-audit-2026-06-10.md` |
| Hilo C infra | ✓ receta A5 · M3 piloto · print carta | `epis2-hilo-c-p1-print-prescription-2026-06-09.md` |
| Entrega C-1 | Automatizado ✓ · humano opcional | `epis2-m3-visual-pass-2026-06-10.md` |
| Entrega C-2 | ✓ signoff GO | [`EPIS2_CLINICAL_CALM_PREMIUM_PLAN.md`](../design/EPIS2_CLINICAL_CALM_PREMIUM_PLAN.md) · [`epis2-entrega-c2-calm-premium-2026-06-11.md`](../../reports/epis2-entrega-c2-calm-premium-2026-06-11.md) |
| Entrega C-3a | ✓ scaffold resumen | `EPIS2_CLINICAL_SUMMARY_MD3.md` |
| Entrega C-4 | Pendiente | `VITE_ENABLE_DUAL_CHART_MODES=false` |
| PROG-AUTO-DEV-6H | **Pausado** | No relanzar sin decisión |
| Evolab | 24 hallazgos abiertos | QA externo paralelo |

---

## 3. Modelo de trabajo por partes

Cada **bloque** del plan sigue el mismo ciclo:

```text
EVALUAR  → inventario + gates + capturas + diff
REVISAR  → humano / OpenClaw read-only / Evolab muestra
MEJORAR  → una entrega · diff mínimo · un registry
SEGUIR   → reporte reports/*.md · actualizar tablero si cambia siguiente
```

### Gates estándar (toda sesión)

```bash
npm run check
npm run test                    # o subset del alcance
npm run db:validate             # si toca datos/migraciones
npm run dev:agent:close         # plantilla cierre
```

---

## 4. Plan detallado por bloques

### Bloque 0 — Evaluación y alineación (1 sesión)

**Objetivo:** Alinear docs, agentes y canon visual antes de tocar UI producto.

| Paso | Acción | Artefacto |
|------|--------|-----------|
| E0.1 | Leer canon: `PRODUCT_INVARIANTS` · `EPIS2_DUAL_CHART_VISUAL_CANON` · tablero | Declaración alcance |
| E0.2 | Ejecutar baseline | `npm run check` · `quality:dual-chart-ledger` · `quality:layers-integration-gate` |
| E0.3 | Inventario rutas modos | `apps/web/src/modes/` vs `DualChartPatientPage` · redirects legacy |
| E0.4 | Conciliar docs superseded | Nota en `EPIS2_MODES_LAYER.md` → apunta a dual chart v2 |
| E0.5 | Auditoría agentes (§5) | Decisión: manual `dev:session` only |

**Subagente:** `gate-runner` + `layers-integrator` (solo lectura)  
**Entrega:** `reports/epis2-bloque0-alineacion-visual-YYYY-MM-DD.md`  
**No hacer:** relanzar `dev:auto:cycle` · editar registries en paralelo

---

### Bloque 1 — Entrega C-4: Activación dual ficha (1–2 sesiones)

**Objetivo:** Evaluar en dev/staging el shell v2 con flag on; revisar traditional + paper + barra clínica.

| Paso | Acción | Criterio |
|------|--------|----------|
| E1.1 | `VITE_ENABLE_DUAL_CHART_MODES=true` en `.env` local | App arranca sin error |
| E1.2 | Flujo Login → censo → `/espacio/ficha?chartMode=traditional` | Cuatro capas visibles |
| E1.3 | Switch a `chartMode=paper` | PaperChartLayout v2 · impresión |
| E1.4 | **Ctrl+K** desde ficha electrónica y papel | Palette abre · no pierde contexto paciente |
| E1.5 | Redirect `?mode=classic` → dual chart | `classicModeToDualChartSearch` OK |
| E1.6 | E2E opt-in | `dual-chart-modes.spec.ts` + `three-modes-journey` legacy |
| E1.7 | CI opt-in documentado | Variable CI o job separado |

**Archivos permitidos:** `apps/web/src/pages/DualChart*` · `clinicalNavigate*` · `e2e/dual-chart*` · `.env.example` · docs product  
**Subagentes:** `layers-integrator` → `golden-guardian` → `gate-runner`  
**Gates:** `quality:dual-chart-gate` · `test:unit:chart` · E2E dual  
**Entrega:** actualizar tablero C-4 → Done · reporte cierre

---

### Bloque 2 — Entrega C-1: Signoff visual M3 (0–1 sesión humana)

**Objetivo:** Revisar (no reimplementar) capturas post-NORM.

| Paso | Acción | Fuente |
|------|--------|--------|
| E2.1 | Abrir `reports/m3-visual-evidence/2026-06-10/` | 16 capturas V1–V6 |
| E2.2 | Checklist hover/foco/rail/two-pane claro+oscuro | `quality:m3-signoff` criterios |
| E2.3 | Veredicto GO / NO-GO / GO con notas | 1 página en reporte |
| E2.4 | Si NO-GO: abrir micro-entregas (no bloquear C-2) | Lista P0/P1 visual |

**Subagentes:** ninguno obligatorio (humano) · opcional `m3-guardian` para fixes P0  
**Gates:** `quality:m3-visual-pass` ya PASS — no re-ejecutar salvo cambio código  
**Entrega:** `reports/epis2-entrega-c1-signoff-humano-YYYY-MM-DD.md`

---

### Bloque 3 — Entrega C-2: PROG-CALM-PREMIUM (3–5 sesiones)

**Objetivo:** Mejorar estética sobre shell dual ficha activo (Bloque 1 recomendado antes).

Orden de tramos (dependencias):

```text
THEME-CALM-01 → UX-AESTHETIC P3 → UX-CALM-PATIENT / UX-CALM-COMMAND → Signoff
```

#### Sesión C-2.1 — Tramo THEME-CALM-01

| Paso | Alcance | Gate |
|------|---------|------|
| Tokens petróleo light/dark | `clinical-calm.material-theme.json` · `create-epis2-theme.ts` | `theme:validate` |
| Contraste AA | `clinical-roles.contrast.test.ts` | PASS |
| Sin hex sueltos en pages | grep audit | manual |

**Subagentes:** `layers-integrator` → `m3-guardian`

#### Sesión C-2.2 — Tramo UX-AESTHETIC P3

| Paso | Alcance | Gate |
|------|---------|------|
| Islas 20px · border outlineVariant · sin sombra | `islands.ts` · `EpisClinicalSummaryCard` | visual |
| Canvas `#F7F9FC` vía tema | theme tokens | `check` |
| Chips alerta tonal | summary cards | Storybook |

#### Sesión C-2.3 — Tramo UX-CALM-COMMAND (barra siempre presente)

**Objetivo crítico:** Unificar barra comando en censo, ficha electrónica y ficha papel.

| Superficie | Componente | Spec |
|------------|------------|------|
| Censo / búsqueda | dock o barra fija inferior | Altura 56–64px · radius 28–32px |
| Ficha traditional | capa 3 barra clínica + Ctrl+K | `EpisUniversalCommandBar` variant premium |
| Ficha paper | misma barra (acciones documentales) | No ocultar al imprimir preview |
| Centro de Comando | barra coherente si ruta legacy activa | Transición sin regressión |

**Evaluar:** ¿barra visible sin foco? ¿placeholder clínico? ¿icono IA tertiary 20px?  
**Subagentes:** `layers-integrator` → `golden-guardian` (E2E command-first)  
**Gates:** `test:e2e:ux-g02` · `test:e2e:login-gateway`

#### Sesión C-2.4 — Signoff Calm Premium

| Paso | Acción |
|------|--------|
| Capturas 6 superficies (comando, censo, traditional, paper, dark, print) | `quality:m3-visual-pass` adaptado |
| Veredicto NO-GO → GO | Actualizar `EPIS2_CLINICAL_CALM_PREMIUM_PLAN.md` |

**Entrega:** `reports/epis2-entrega-c2-calm-premium-YYYY-MM-DD.md`

---

### Bloque 4 — Entrega C-3: Resumen clínico MD3 (2–3 sesiones)

| Entrega | Antes | Alcance | Estado |
|---------|-------|---------|--------|
| **C-3a** | Fase A | Scaffold mosaico + header + grid | ✓ |
| **C-3b** | Fase B | Medicación 3 zonas · labs crítica-first · alergias estructuradas | pendiente |

#### Sesión C-3b.1 — MF-CLINICAL-SUMMARY-B (datos)

| Paso | Acción |
|------|--------|
| Zonas medicación activa / PRN / suspendida | `PatientClinicalSummaryGrid` |
| Labs valor grande + meta temporal | tarjeta labs |
| Banner sticky 2 líneas + chips | tramo UX-CALM-PATIENT |

**Archivos:** `apps/web/src/components/clinical-summary/*` · `packages/epis2-ui` primitivos  
**Subagentes:** `layers-integrator` → `ollama-clinical` (solo assist demo, no SoT) → `golden-guardian`  
**Invariantes:** PostgreSQL SoT · IA no firma

---

### Bloque 5 — Evaluación integrada modo visual (1 sesión revisión)

**Objetivo:** Matriz de aceptación los tres ejes visuales.

| Eje | Pregunta de evaluación | Método |
|-----|----------------------|--------|
| Ficha electrónica | ¿Parece EMR institucional denso? | Piloto 15 min + capturas |
| Ficha papel | ¿Parece documento imprimible SoT? | Print preview + PDF |
| Barra comando | ¿Siempre alcanzable en <1 s (Ctrl+K)? | E2E + teclado |
| Cambio modo | ¿Switch traditional↔paper sin perder paciente? | E2E dual-chart |
| Legacy | ¿`?mode=classic` redirige sin romper? | test unitario + manual |

**Entrega:** matriz GO/NO-GO en reporte · input para Ola 4

---

### Bloque 6 — Seguir: Ola 4+ y tramos clínicos (backlog ordenado)

| Prioridad | Hilo / Tramo | Depende de |
|-----------|--------------|------------|
| **0** | **PROG-PAPER-MODE** MF-PAPER-00…09 | C-4 · [`EPIS2_PAPER_MODE_DEV_PLAN.md`](../docs/product/EPIS2_PAPER_MODE_DEV_PLAN.md) |
| **0b** | **PROG-PAPER-PLANNER** MF-PLANNER-00…04 | MF-PAPER-02 |
| 1 | Extensión `@epis2/clinical-productivity` en ficha dual | C-2, C-3 |
| 2 | Tramo K / inventario IDC pendiente | `quality:tramo-k-inventory-gate` |
| 3 | PEND-002 nota post-procedimiento | Ola 2+ defer |
| 4 | PEND-004 combobox E2E helper | testing infra |
| 5 | Evolab 24 hallazgos — triage P0/P1 | repo hermano |
| 6 | RLS todas tablas | plan por olas clínicas |

No abrir segundo registry · no import EPIS sin manifest.

---

## 5. Agentes — utilidad, uso recomendado y estado

### 5.1 Principio

```text
Humano + Cursor + dev:session  =  camino principal (2026-06-11)
Automatización masiva (PROG-AUTO-DEV) = pausada — ruido > valor sin supervisión
```

### 5.2 Matriz de agentes

| Agente / herramienta | Utilidad | Cuándo usar | Cuándo NO | Estado |
|---------------------|----------|-------------|-----------|--------|
| **`dev:session`** | ★★★★★ | Cada sesión manual | Nunca omitir arranque | **Activo** |
| **`layers-integrator`** | ★★★★★ | Diff en `apps/web`, shell, dual ficha, Calm | Cambios solo API | Activo |
| **`m3-guardian`** | ★★★★☆ | Densidad MD3, tokens, anti-deriva UI | Backend puro | Activo |
| **`golden-guardian`** | ★★★★☆ | Flujos clínico, E2E, approve draft | Docs only | Activo |
| **`gate-runner`** | ★★★★★ | Siempre al cerrar | A mitad de sesión | Activo |
| **`ollama-clinical`** | ★★★☆☆ | Assist producto, evals (`dev:ai`) | Planificar UI sin dev:ai | Requiere stack |
| **`ollama-dev-writer`** | ★★★☆☆ | Reportes/docs L0 tras revisión | Código producto | Dry-run default |
| **`tramo-implementer`** | ★★★☆☆ | Tramo clínico K+ con MF ledger | Hilo C visual | Cuando MF READY |
| **`ledger-keeper`** | ★★☆☆☆ | Apertura/cierre MF nueva | Ledger cerrado | Bajo demanda |
| **`ci-parity`** | ★★★☆☆ | Pre-PR, scripts quality | Iteración UI rápida | Pre-push |
| **OpenClaw reviewers** | ★★★☆☆ | Auditoría read-only pre-PR grande | Implementación | Manual · gateway off OK |
| **OpenClaw L3 patch** | ★★☆☆☆ | Solo L0 docs con humano | Código sin revisión | No en auto |
| **PROG-AUTO-DEV-6H** | ★☆☆☆☆ | — | Sesiones focadas | **PAUSADO** |
| **Evolab** | ★★★☆☆ | QA escenarios clínicos paralelo | Sustituir golden local | 24 open |

### 5.3 Secuencia subagentes por tipo de entrega

| Tipo entrega | Secuencia recomendada |
|--------------|----------------------|
| Visual / shell dual | `layers-integrator` → `m3-guardian` → `gate-runner` |
| Flujo clínico / E2E | `layers-integrator` → `golden-guardian` → `gate-runner` |
| Assist / blueprint | `ollama-clinical` → `golden-guardian` → `gate-runner` |
| Solo docs / plan | `ollama-dev-writer` (dry-run) → humano → `gate-runner` |
| Pre-PR grande | `openclaw:brief` → Cursor implementa → `openclaw:handoff` → `gate-runner` |

### 5.4 Arranque sesión estándar (manual)

```bash
npm run stack:dev
npm run dev:session
# Cursor: @reports/dev-agent-brief.md + @reports/dev-agent-prompt-<primario>.md
# Declarar: Bloque · Entrega C-n · archivos permitidos
```

Cierre:

```bash
npm run check
npm run test          # subset si aplica
npm run dev:agent:close
# Completar reports/epis2-session-close-*.md
```

### 5.5 Ollama — dos capas (no mezclar)

| Capa | Comando | Escribe SoT |
|------|---------|-------------|
| Dev plan | `dev:agent:ollama` / `--ollama-auto` | No |
| Dev write L0 | `dev:agent:ollama-write --apply` | No (solo allowlist docs) |
| Producto clínico | `dev:ai` + `ai:evals:live` | No — borradores only |

---

## 6. Mapa visual: modos y barra de comando

```text
                    ┌─────────────────────────────────────┐
                    │  Ctrl+K  Barra comando TRANSVERSAL │
                    └─────────────────────────────────────┘
                                      │
        ┌─────────────────────────────┼─────────────────────────────┐
        ▼                             ▼                             ▼
   Censo/Búsqueda              Ficha Electrónica              Ficha Papel
   (MF-DUAL-CHART-08)          chartMode=traditional          chartMode=paper
        │                             │                             │
        └─────────────── selección paciente ──────────────────────┘
                                      │
                              Cuatro capas fijas
                              (header · banda · barra · contenido)
```

**Evaluar en cada bloque:** la barra capa-3 y Ctrl+K deben sentirse **una sola pieza** en los tres contextos.

---

## 7. Cronograma sugerido (sin fechas rígidas)

| Orden | Bloque | Entrega SDEPIS2 | Sesiones est. |
|-------|--------|-----------------|---------------|
| 1 | Bloque 0 | Alineación | 1 |
| 2 | Bloque 1 | **C-4** | 1–2 |
| 3 | Bloque 2 | **C-1** humano | 0–1 |
| 4 | Bloque 3 | **C-2** Calm Premium | 3–5 |
| 5 | Bloque 4 | **C-3b** | 2–3 |
| 6 | Bloque 5 | Matriz integrada | 1 |
| 7 | Bloque 6 | Ola 4+ | continuo |

**Paralelo permitido:** Evolab triage · OpenClaw brief read-only · Entrega C-1 humano mientras C-4 en dev.

**Paralelo prohibido:** dos subagentes tocando mismo registry · auto-dev + sesión Cursor mismo archivos.

---

## 8. Definition of Done (plan maestro)

El plan visual modo clásico/papel + barra comando se considera **seguido con éxito** cuando:

1. **C-4** Done — flag on en staging · E2E dual opt-in documentado  
2. **C-1** — signoff humano GO o GO con notas acotadas  
3. **C-2** — signoff Calm Premium GO en traditional + paper + barra  
4. **C-3b** — MF-CLINICAL-SUMMARY-B cerrado con gates  
5. Matriz Bloque 5 — tres ejes visuales GO  
6. Tablero y `EPIS2_GLOBAL_DEV_PLAN` actualizados  
7. PROG-AUTO-DEV permanece pausado salvo decisión explícita documentada  

---

## 9. Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| Docs three-modes vs dual-chart confunden agentes | Bloque 0 conciliación · brief solo tablero |
| Calm Premium en legacy stack si C-4 retrasa | Priorizar C-4 antes de C-2.3 |
| Barra comando duplicada (dock + capa 3) | Sesión C-2.3 unificación explícita |
| Ollama plan desalineado (MF-183…) | Ignorar MF propuesta brief si contradice tablero |
| Evolab P0 sin triage | Bloque 6.5 dedicado · no mezclar con UI |
| Invariante home vs census-first | Routing `/comando` intacto; UX census dentro shell |

---

## 10. Próximo paso exacto

```text
Bloque 0 → declarar alcance → Bloque 1 (Entrega C-4) activar dual ficha en local
```

Comandos inmediatos:

```bash
npm run stack:dev
npm run dev:session
npm run quality:dual-chart-ledger
# Tras .env: VITE_ENABLE_DUAL_CHART_MODES=true → npm run dev -w @epis2/web
```

**Cursor:** `@reports/dev-agent-brief.md` + `@reports/dev-agent-prompt-layers-integrator.md`  
**Alcance:** Bloque 1 · Entrega C-4 · `DualChart*` · `e2e/dual-chart*` · prohibido `dev:auto:*`

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
