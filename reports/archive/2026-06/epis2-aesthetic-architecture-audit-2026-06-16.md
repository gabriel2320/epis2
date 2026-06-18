# EPIS2 — Informe de auditoría técnica: arquitectura estética y experiencia de usuario

**Fecha:** 2026-06-16  
**Commit auditado:** `9cf7d44` — `chore(ux-lab): MF-UXLAB-04 autopilot audit-only bot (#35)`  
**Tipo:** Auditoría técnica (canon + código + gates + signoff humano)  
**Alcance:** Capa visual M3, arquitectura UX clínica, señales de confianza, calidad automatizada  
**Congelamiento clínico:** vigente — este informe no autoriza cambios de lógica SoT

---

## 1. Resumen ejecutivo

EPIS2 implementa una **arquitectura de diseño en dos capas acopladas**:

| Capa | Responsabilidad | Estado auditado |
|------|-----------------|-----------------|
| **Estética / design system** | Tokens MTB, tipografía, superficies, roles clínicos, elevación, dark mode | **Implementada y validada por gates** (`theme:validate` ✓) |
| **Experiencia de usuario clínica** | Censo → turno → ficha dual → formularios → cierre; command-first; trust ladder | **Funcionalmente aprobada** (signoff humano Modo A ✓) |
| **Composición visual global** | Clinical Calm Premium — calma editorial, jerarquía tonal 80/15/5 | **Pendiente de rediseño** (UXLAB-AEST-01 Major) |

**Veredicto global de producto (2026-06-16):** **PASS WITH FIXES**

- Flujo demo Modo A (sin IA): **APROBADO**
- Estética / composición visual: **NECESITA REDISEÑO**
- Autopilot UX-LAB: **GO-CANDIDATE** · 0 UX-BLOCKER
- Tag demo `v0.1-demo-rc4`: **DIFERIDO** hasta tramo estético MF-AEST-01 o signoff visual explícito

**Frase guía de auditoría:** *El turno demo funciona; la capa visual no cumple aún el norte «Clinical Calm Premium».*

---

## 2. Marco normativo (canon de diseño)

### 2.1 Documentos vinculantes

| Documento | Ruta | Función en auditoría |
|-----------|------|----------------------|
| Reglas tipográficas (20 reglas) | `docs/design/EPIS2_TYPOGRAPHY_AND_AESTHETICS_RULES.md` | Piso 13px, escala modular, WCAG AA, 8pt grid, 60-30-10 |
| Plan Clinical Calm Premium | `docs/design/EPIS2_CLINICAL_CALM_PREMIUM_PLAN.md` | Norte estético: petróleo `#0B5C66`, canvas `#F7F9FC`, islas, dark clínico |
| Experiencia M3 clínica | `docs/design/EPIS2_MATERIAL3_CLINICAL_EXPERIENCE.md` | Standard vs Expressive por contexto; roles protegidos |
| Anti-patrones MD | `docs/design/EPIS2_MATERIAL_DESIGN_ANTI_PATTERNS.md` | 20 prohibiciones (shadow creep, cards anidadas, FAB abuse…) |
| Arquitectura UI | `docs/design/EPIS2_UI_ARCHITECTURE.md` | Command-first, un solo tema, abstracción `@epis2/epis2-ui` |
| Arquitectura de temas | `docs/design/EPIS2_THEME_ARCHITECTURE.md` | Pipeline MTB → generated → `createEpis2Theme` |
| Design system M3 | `docs/design/EPIS2_CLINICAL_DESIGN_SYSTEM_M3.md` | Catálogo 8 perfiles MTB, targets de contraste |
| Ficha dual visual | `docs/design/EPIS2_DUAL_CHART_VISUAL_CANON.md` | Modos tradicional / papel |
| Plan UX-LAB | `docs/quality/EPIS2_UX_LAB_MODERN_PLAN.md` | 4 capas de experiencia post-RC3 |
| Signoff humano | `reports/epis2-ux-lab-human-signoff-2026-06-16.md` | Evidencia PASS WITH FIXES |

### 2.2 Invariantes de producto relevantes

Desde `docs/product/PRODUCT_INVARIANTS.md` y canon UI:

1. **Home = Centro de Comando clínico** — censo `/espacio/buscar-paciente`; nunca dashboard como entrada.
2. **Un solo generador de tema** — `createEpis2Theme()` en `@epis2/epis2-ui`.
3. **Apps no importan `@mui/*` directamente** — solo wrappers `@epis2/epis2-ui`.
4. **Copy visible en español** — `@epis2/design-system/copy/es.ts`; sin strings en inglés en UI.
5. **Roles clínicos inmutables** — `draft`, `aiAssistance`, `approved`, `warning`, `critical` no cambian con el acento MTB.
6. **IA no aprueba ni firma** — disclosure y chips degradados obligatorios.

---

## 3. Arquitectura estética (capa visual)

### 3.1 Pipeline de tokens (Material Theme Builder → runtime)

```text
Material Theme Builder (MTB)
  packages/epis2-ui/src/theme/source/*.material-theme.json
        │
        ▼
scripts/theme/import-material-theme.mjs
scripts/theme/validate-*.mjs (8 pasos en theme:validate)
        │
        ▼
packages/epis2-ui/src/theme/generated/*.ts
        │
        ▼
createEpis2Theme({ mode, themeId, density, contrast, motion })
        │
        ▼
Epis2ThemeProvider → apps/web
```

**Workflow canon:** `docs/design/EPIS2_MATERIAL_THEME_BUILDER_WORKFLOW.md`

### 3.2 Perfiles MTB aprobados (8)

Registro: `packages/epis2-ui/src/theme/material-theme-registry.ts`

| `themeId` | Seed / carácter | Rol en producto |
|-----------|-----------------|-----------------|
| `clinical-blue` | `#1E6FD6` | **Default runtime** (`DEFAULT_THEME_ID`) |
| `clinical-calm` | `#0B5C66` (petróleo) | **Target Calm Premium** — JSON existe, no es default |
| `calm-teal` | Teal clínico | Alternativa acento |
| `slate-professional` | Gris pizarra | Alternativa acento |
| `sage-clinical` | Verde salvia | Alternativa acento |
| `ocean-depth` | Azul profundo | Alternativa acento |
| `warm-linen` | Lino cálido | Alternativa acento |
| `monochrome-gray` | Monocromo | Alternativa acento |

**Tensión auditada:** El plan Calm Premium documenta GO humano 2026-06-11, pero el signoff UX-LAB 2026-06-16 declara rediseño visual pendiente con default aún en `clinical-blue`.

### 3.3 API `createEpis2Theme`

Archivo: `packages/epis2-ui/src/theme/create-epis2-theme.ts`

```ts
createEpis2Theme({
  mode: 'light' | 'dark',
  themeId?: Epis2ApprovedThemeId,
  accent?: Epis2Accent,           // alias legacy → themeId
  density?: 'comfortable' | 'compact',
  contrast?: 'standard' | 'high',
  motion?: Epis2MotionScheme,
})
```

| Opción | Comportamiento técnico |
|--------|------------------------|
| `density: comfortable` | MUI `spacing: 8` (grilla 8dp) — default |
| `density: compact` | MUI `spacing: 7`; `resolveEpis2M3FormLayout('compact')` |
| `contrast: high` | `applyHighContrastRoles()` — `onSurfaceVariant`, `outline` reforzados; `fontWeight: 500` body |
| `motion` | Respeta `prefers-reduced-motion` (V6 signoff M3) |

Preferencias de usuario: `EpisAppearancePreferencesPanel` — testIds `epis2-density-comfortable`, `epis2-density-compact`; aplicación instantánea (anti-patrón §9: sin botón Guardar).

### 3.4 Roles de color

#### 3.4.1 Roles M3 (MTB)

Pares validados WCAG AA en `scripts/theme/validate-theme-contrast.mjs`:

- `primary` / `onPrimary`
- `surface` / `onSurface`
- `onSurfaceVariant` / `surface`
- `error` / `onError`
- `outline` / `surface`

#### 3.4.2 Roles clínicos protegidos (EPIS2)

Archivo: `packages/epis2-ui/src/theme/clinical-roles.ts`

| Rol | Uso | Inmutable por acento |
|-----|-----|----------------------|
| `draft` | Borrador no aprobado | ✓ |
| `aiAssistance` | Sugerencias IA | ✓ |
| `approved` | Documento firmado | ✓ |
| `warning` | Alertas no críticas | ✓ |
| `critical` | Seguridad clínica | ✓ |

Tests: `clinical-roles.contrast.test.ts` — pares container y main ≥ 4.5:1.

#### 3.4.3 Regla 80/15/5 (Calm Premium)

| Porcentaje | Aplicación |
|------------|------------|
| **80%** | Neutros — canvas `#F7F9FC`, islas blancas, `surfaceContainer*` |
| **15%** | Tonos clínicos suaves — `primaryContainer`, nav secundaria |
| **5%** | Color fuerte — CTA primario, error real `#BA1A1A`, tertiary IA `#6B5C8A` |

**Estado:** Regla normativa; composición global aún no alcanza el target visual en runtime default.

### 3.5 Superficies y layout tokens

Exportados desde `@epis2/epis2-ui/theme`:

| Token Sx | Función | Color objetivo (light) |
|----------|---------|------------------------|
| `epis2CanvasSx` | Fondo app (nivel 0) | `#F7F9FC` |
| `epis2IslandSx` | Tarjeta principal (nivel 1) | `#FFFFFF` + borde `outlineVariant` |
| `epis2CalmIslandSx` | Isla calm premium | Borde sutil, sin shadow creep |
| `epis2PaperCanvasSx` | Modo papel — fondo documento | Referencia carta clínica |
| `epis2PaperCalmCanvasSx` | Papel + calm | Composición editorial |
| `epis2ClinicalProseSx` | Prosa clínica | max-width ~65ch |

Chart modes: `packages/epis2-ui/src/theme/chart-modes-tokens.ts`

- `epis2ClinicalShellTokens`
- `epis2PaperChartTokens`
- `epis2ChartModeTokens`

Canvas override Calm: `packages/epis2-ui/src/theme/clinical/clinical-calm-canvas.ts` — light `#F7F9FC`, dark `#101418`.

### 3.6 Elevación (4 niveles + modal)

Canon Calm Premium — **sin shadow creep**:

```text
Nivel 0 — fondo app
Nivel 1 — tarjetas (borde 1px outlineVariant; sombra mínima o ninguna)
Nivel 2 — banner paciente sticky / panel activo (tonal)
Nivel 3 — menú flotante / autocomplete comando
Nivel 4 — modal / diálogo aprobación
```

Implementación: `packages/epis2-ui/src/theme/epis2-elevation.ts`, `foundations/shadows.ts`.  
Tests: `epis2-elevation.test.ts`.

### 3.7 Tipografía

**Norma:** `docs/design/EPIS2_TYPOGRAPHY_AND_AESTHETICS_RULES.md` (20 reglas)

| Familia | Fuente | Uso |
|---------|--------|-----|
| Display | Google Sans Text | Login, Comando, títulos |
| Body | Roboto | Formularios, tablas, metadatos |
| Mono | Roboto Mono | IDs, logs, `pre`/`code` |

**Escala (base 14px, ratio 1.2):**

| Token | px | rem |
|-------|-----|-----|
| `labelMedium` | 13 | 0.8125 — **piso absoluto** |
| `body` | 14 | 0.875 |
| `headline` | 17 | 1.0625 |
| `display` | 20 | 1.25 |

Implementación: `typography.ts`, `typography-rules.ts`, `foundations/typography.ts`.

**Prohibiciones:** texto < 13px; negro puro (`epis2ForbiddenColors.pureBlack`); más de 3 pesos tipográficos por tarjeta (`EPIS_CLINICAL_CARD_MAX_FONT_WEIGHT = 600`).

### 3.8 Forma (radios MD3)

| Elemento | Radio | Artefacto |
|----------|-------|-----------|
| App shell | 28px | `shape.shellRadius` |
| Tarjetas principales | 20px | `epis2IslandSx` |
| Tarjetas pequeñas | 16px | `EpisClinicalSummaryCard` |
| Chips / pill | 999px | MUI `borderRadius: 9999` |
| Inputs | 14–16px | `components.ts` TextField |
| Modales | 28px | Dialog override |
| Barra comando | 28–32px | `EpisUniversalCommandBar` |

### 3.9 Dark mode clínico

Target Calm Premium (pendiente MF-AEST-04):

| Rol | Hex objetivo |
|-----|--------------|
| Fondo | `#101418` |
| Superficie | `#171C20` |
| Surface-container | `#1F252A` |
| Texto principal | `#E1E5EA` |
| Primary | `#8BD4DD` |
| Tertiary IA | `#D2C1FF` |

Validación paridad light/dark: `validate-light-dark-parity.mjs`.

Target contraste AAA (7:1) para datos de paciente: MF-AEST-04 — no verificado en signoff humano.

---

## 4. Arquitectura de experiencia de usuario

### 4.1 Modelo de 4 capas (PROG-UX-LAB)

```text
CAPA 0 — Entrada canónica
  /espacio/buscar-paciente (censo) + barra de comando
  /comando = redirect compat · tablero = secundario

CAPA 1 — Shift Context Strip
  Turno sintético · DEMO/SIM · IA on/off/degradada · pendientes

CAPA 2 — Censo como mapa del turno
  Fila compacta · pendiente principal · acción primaria única

CAPA 3 — Ficha dual + confianza
  MD3 estructurado │ modo papel carta · estados visibles

CAPA 4 — Cierre del turno
  borrador → revisión → aprobación humana → auditoría → censo
```

**Pilares UX (no decorativos):** ritmo clínico, progressive disclosure, trust by design, command as muscle memory, degradable by default.

### 4.2 Pilares de confianza (Trust Ladder)

Cada superficie debe responder visualmente:

| Pregunta clínica | Señal UI | testId / componente |
|------------------|----------|---------------------|
| ¿Es entorno demo? | Banner global + badge paciente | `epis2-demo-environment-banner`, `epis2-patient-identity-demo-badge` |
| ¿Es borrador? | Chip estado borrador | `epis2-draft-status-*`, `epis2-draft-status-chip` |
| ¿Está firmado/aprobado? | Roles `approved` | `EpisDraftStatus`, `EpisApprovalGate` |
| ¿Intervino IA? | Chip degradado / disclosure | `EpisAiDegradedChip`, `EpisAiDisclosure` |
| ¿Es documento papel? | Watermark | `epis2-paper-document-watermark` |
| ¿Contexto de turno? | Shift strip | `epis2-shift-context-strip` |

Autopilot verifica estas señales en `e2e/ux-lab-autopilot-mode-a.spec.ts`.

### 4.3 Stack de shells (jerarquía de layout)

```text
ClinicalShellLayout (apps/web/src/layouts/ClinicalShellLayout.tsx)
├── Dual ficha ON  → ClinicalShell (pantalla completa, sin rail)
├── Classic MD3    → EpisClassicMd3Shell  [data-epis-classic-md3]
├── Dashboard MD3  → EpisDashboardMd3Shell
└── Default        → EpisAppScaffold + EpisAppShellLayout (@epis2/epis2-ui)
```

#### ClinicalShell (ficha dual — ADR-002)

Archivo: `apps/web/src/components/chart/ClinicalShell.tsx`  
testId default: `epis2-clinical-shell-v2`

**4 capas fijas:**

1. `ClinicalInstitutionalHeader` — institución / servicio
2. `PatientIdentityBand` — identidad paciente + badge DEMO
3. `ClinicalActionBar` + `EpisUniversalCommandBar` (variant `clinical-chart`)
4. Contenido scroll + `ClinicalFooterStatus`

Command palette overlay: `ClinicalShellCommandPalette` — Ctrl+K — `epis2-clinical-command-palette`.

#### EpisAppScaffold

Archivo: `apps/web/src/components/layout/EpisAppScaffold.tsx`  
testId: `epis2-app-scaffold`  
Atributo: `data-epis-screen-kind` = `command` | `workspace` | `form` | `document`

Slots:
- `epis2-command-bar-slot`
- `epis2-main-content` (scroll único)
- `epis2-clinical-action-bar-slot`

Viewport: `100dvh`.

### 4.4 Modos de experiencia

#### 4.4.1 Modo A / Modo B (operación demo)

| Modo | IA | Uso auditoría |
|------|-----|---------------|
| **Modo A** | Off / degradada (`EPIS2_STACK_SKIP_AI=1`) | Signoff humano 2026-06-16 ✓ |
| **Modo B** | Ollama activo | Evals IA; no bloqueante UX-LAB |

#### 4.4.2 Ficha dual (canon principal)

Flag: `VITE_ENABLE_DUAL_CHART_MODES` — **ON por defecto** (opt-out `false`)

| Modo | ID | Superficie |
|------|-----|------------|
| Electrónica | `traditional` | MD3 estructurado |
| Papel | `paper` | Documento carta + watermark |

Switch: `epis2-chart-mode-switch`, `epis2-chart-mode-traditional`, `epis2-chart-mode-paper`  
Superficie papel: `epis2-paper-chart-mode`

Secciones papel: `epis2-paper-section-{id}`, campos `epis2-paper-field-{id}`  
Formatos: `epis2-paper-format-letter` / `epis2-paper-format-a5`  
Acciones: `epis2-paper-save`, `epis2-paper-sign`, `epis2-paper-print`

#### 4.4.3 Tres modos MD3 (secundarios / compat)

| Modo | Ruta | Shell |
|------|------|-------|
| Command | `/comando` | `EpisAppScaffold` |
| Classic EMR | `/espacio/ficha?mode=classic` | `EpisClassicMd3Shell` — `epis2-clinical-shell-classic` |
| Dashboard | `/epis2/dashboard?mode=dashboard` | `EpisDashboardMd3Shell` — `epis2-dashboard-md3-main-grid` |

Gate: `quality:three-modes-gate`. Canon: `docs/design/EPIS2_THREE_MODES_ORCHESTRATION.md`.

### 4.5 Command-first y variantes de barra

Componente central: `EpisUniversalCommandBar` (`apps/web/src/components/command/`)

| Variant | Superficie | testId típico |
|---------|----------|---------------|
| `command-center` | `/comando` | `epis2-power-bar`, `epis2-command-google-bar` |
| `census-search` | Censo home | `epis2-census-command-bar` |
| `clinical-chart` | Ficha dual | `epis2-chart-command-bar` |
| `classic-contextual` | Classic MD3 | contextual |
| `dashboard-operational` | Dashboard MD3 | operational |

**Presupuestos UX (uiDensityRules.ts):**

- Máx. **3** sugerencias visibles en command bar (`EPIS_COMMAND_BAR_MAX_SUGGESTIONS`)
- Máx. **3** acciones primarias en action bar clínica (`EPIS_CLINICAL_ACTION_BAR_MAX_PRIMARY`)
- Presupuesto iconos por `EpisScreenKind`: command 6, workspace 10, form 6, document 0

### 4.6 Mapa de superficies auditadas

| Superficie | Ruta | Scaffold | Screen kind | testIds clave |
|------------|------|----------|-------------|---------------|
| **Censo (home)** | `/espacio/buscar-paciente` | `EpisClinicalWorkspaceShell` | `command` | `epis2-census-command-bar`, `epis2-shift-context-strip`, `epis2-census-primary-action-{DEMO-xxx}`, `epis2-patient-search-autocomplete` |
| **Ficha dual** | `/espacio/ficha` | `ClinicalShell` | `workspace` | `epis2-clinical-shell-v2`, `epis2-patient-identity-band`, `epis2-chart-command-bar`, `epis2-chart-mode-switch` |
| **Modo papel** | `?chartMode=paper` | dentro ClinicalShell | `workspace` | `epis2-paper-chart-mode`, `epis2-paper-document-watermark` |
| **Formularios** | `/espacio/evolucion`, ingreso, epicrisis… | `EpisClinicalWorkspaceShell` | `form` | `epis2-clinical-form-action-bar`, `epis2-form-save`, `epis2-form-sign`, `epis2-draft-status-chip` |
| **Command compat** | `/comando` | `EpisAppScaffold` | `command` | `epis2-app-scaffold`, `epis2-command-google-bar`, `epis2-census-open-search` |
| **Preferencias** | `/preferencias-apariencia` | scaffold estándar | — | `epis2-density-*`, toggles tema/accent |
| **Classic MD3** | `?mode=classic` | `EpisClassicMd3Shell` | `workspace` | `epis2-clinical-shell-classic` |
| **Dashboard MD3** | `?mode=dashboard` | `EpisDashboardMd3Shell` | `workspace` | `epis2-dashboard-md3-main-grid` |

Registro completo: `apps/web/src/quality/uiDensityRules.ts` → `EPIS_SCREEN_REGISTRY`.

Chrome global: `epis2-global-top-bar`, `epis2-nav-buscar`, `epis2-nav-comando`, `epis2-offline-banner`.

---

## 5. Paquetes de design system

### 5.1 `@epis2/epis2-ui`

**Ruta:** `packages/epis2-ui/`  
**Rol:** Única puerta MUI + composición clínica/command/dashboard.

Módulos exportados (`src/index.ts`):

| Módulo | Componentes representativos |
|--------|----------------------------|
| `theme/` | `createEpis2Theme`, tokens Sx, roles clínicos |
| `providers/` | `Epis2ThemeProvider` |
| `primitives/` | `EpisButton`, `EpisTextField`, `EpisChip`, `EpisDemoBadgeChip`, `EpisCard` |
| `layout/` | `EpisBentoGrid`, `EpisSplitPane`, `EpisWorkspaceSection` |
| `clinical/` | `EpisAppShellLayout`, `EpisDraftStatus`, `EpisApprovalGate`, `EpisAiDegradedChip`, `EpisPatientChartShell` |
| `command/` | `EpisCommandBar`, `EpisCommandCenterInlineBar`, `EpisCommandCenterHero` |
| `forms/` | `EpisClinicalField`, `EpisClinicalForm`, `EpisClinicalTwoPaneLayout` |
| `data/` | `EpisDataGridCore` (density compact) |
| `feedback/`, `widgets/`, `print/`, `charts/`, `dashboard/`, `pickers/` | Lazy MUI X donde aplica |

**Regla de auditoría:** Cualquier import `@mui/*` en `apps/web/src/**` es violación arquitectónica (gate MUI anti-drift).

### 5.2 `@epis2/design-system`

**Ruta:** `packages/design-system/`  
**Rol actual:** Microcopy clínico español — `src/copy/es.ts` (~1400 líneas).

Dominios de copy relevantes para UX:

- `login`, `commandCenter`, `censusShift`, `chartModes`
- `drafts`, `paperWatermark*`, `themePreferences`
- `classicMd3`, `dashboardMd3`

Gate: `validate-theme-copy-spanish.mjs` — sin tokens técnicos en inglés en UI visible.

---

## 6. Accesibilidad y contraste

| Requisito | Fuente | Enforcement |
|-----------|--------|-------------|
| WCAG AA 4.5:1 texto | Reglas tipográficas §10 | `validate-theme-contrast.mjs` — todos los perfiles MTB |
| Roles clínicos AA | Design system M3 | `clinical-roles.contrast.test.ts` |
| AAA 7:1 identidad paciente | `EPIS2_TRADITIONAL_M3_SHAPE_COLOR_PLAN.md` | Target MF-AEST-04 — pendiente signoff |
| Modo alto contraste | `createEpis2Theme({ contrast: 'high' })` | Preferencias usuario |
| Piso 13px | Regla §2 | `epis2TypeScale.labelMedium` |
| Reduced motion | `motion.ts` | `prefers-reduced-motion`; V6 E2E |
| Sin negro puro | Regla §13 | Manual + anti-patrón |
| Focus visible | M3 components | Overrides en `components.ts` |

Checklist manual: `docs/design/EPIS2_THEME_QA_CHECKLIST.md` (15 min).

---

## 7. Gates de calidad (estética y UX)

### 7.1 `theme:validate` (8 pasos)

Script orquestador: `scripts/theme/validate-theme-all.mjs`

| Paso | Script | Qué audita |
|------|--------|------------|
| 1 | `validate-single-theme.mjs` | Integridad esquema |
| 2 | `validate-material-color-roles.mjs` | Roles M3 completos |
| 3 | `validate-clinical-semantic-roles.mjs` | Roles clínicos EPIS2 |
| 4 | `validate-light-dark-parity.mjs` | Paridad light/dark |
| 5 | `validate-theme-contrast.mjs` | WCAG AA pares MTB |
| 6 | `validate-theme-copy-spanish.mjs` | Copy ES sin tokens técnicos |
| 7 | `validate-no-hardcoded-colors.mjs` | Sin hex sueltos en apps |
| 8 | `compare-theme-snapshots.mjs` | Regresión visual tokens |

**Estado auditado:** ✓ verde en signoff 2026-06-16.

### 7.2 M3 anti-drift

Canon: `docs/quality/MUI_ANTI_DRIFT_GATES.md` — gates M3-G01…G15 automatizados.

### 7.3 `quality:m3-human-pilot`

Script: `scripts/quality/run-m3-human-pilot.mjs`  
E2E: `e2e/m3-visual-signoff.spec.ts` — checklist V1–V6

| Vista | Ruta |
|-------|------|
| V1 Preferencias | `/preferencias-apariencia` |
| V2 Comando | `/comando` |
| V3 Formulario | `/espacio/evolucion` |
| V4 Catálogo visual | `/desarrollo/catalogo-visual` |
| V5–V6 | Motion / offline |

**Estado 2026-06-16:** Automatizado **GO DEMO M3** @ `6533680`; checkbox humano visual **pendiente**.

### 7.4 PROG-UX-LAB

| Gate | Función | Estado |
|------|---------|--------|
| `quality:ux-lab-autopilot` | Walkthrough Modo A + señales trust | ✓ GO-CANDIDATE @ `9cf7d44` |
| `quality:ux-lab-close` | security-promote + golden-journey + ux-pilot + m3-human-pilot + fast | ◐ corrida completa post-#35 no verificada punta a punta |
| `quality:golden-journey` | Journey clínico 17/17 | ✓ baseline RC3 |
| `quality:ux-pilot` | E2E piloto demo | ✓ |
| `quality:three-modes-gate` | Tres modos MD3 | ✓ |

Autopilot: `tools/ux-lab-autopilot/autopilot.mjs --mode audit-only`  
Reporte: `reports/ux-lab-autopilot/run-2026-06-16.md`

---

## 8. Inventario de componentes scaffold (no duplicar)

Lista canon en `EPIS_M3_SCAFFOLD_COMPONENTS` (`uiDensityRules.ts`):

- `EpisAppScaffold`, `EpisTopAppBar`, `EpisSideNavigation`
- `EpisCommandBar`, `EpisMainContent`, `EpisSupportingPane`
- `EpisClinicalActionBar`, `EpisClinicalWorkspaceShell`
- `EpisSplitWorkspace`, `EpisClassicMd3Shell`, `EpisDashboardMd3Shell`

**ClinicalShell** (apps/web) es capa de producto sobre epis2-ui — no duplicar en paquete.

Patrones de interacción permitidos: `EpisBulkActionMenu`, `EpisDraggableList`, `EpisCopyPasteTextTools`, `EpisProgressiveMenu`.

---

## 9. Hallazgos de auditoría

### 9.1 Fortalezas

| ID | Área | Evidencia |
|----|------|-----------|
| F-01 | Pipeline tema único MTB → runtime | `createEpis2Theme`, 8 perfiles, 8 pasos validate |
| F-02 | Roles clínicos inmutables + tests contraste | `clinical-roles.ts`, tests |
| F-03 | Arquitectura UX 4 capas implementada | PROG-UX-LAB cerrado funcionalmente |
| F-04 | Trust ladder con testIds estables | Autopilot 0 UX-BLOCKER |
| F-05 | Ficha dual tradicional/papel | ADR-002, E2E dual chart |
| F-06 | Command-first con presupuestos de densidad | `uiDensityRules.ts` |
| F-07 | Degradación IA sin bloqueo Modo A | Signoff humano ✓ |
| F-08 | Copy centralizado ES | `@epis2/design-system` |

### 9.2 Hallazgos / brechas

| ID | Severidad | Descripción | Impacto |
|----|-----------|-------------|---------|
| **UXLAB-AEST-01** | **Major** | Rediseño estético global pendiente — densidad, jerarquía tonal, Calm Premium no alcanzado en default | Demo rc4 diferido; percepción «no premium» |
| A-02 | Medium | Default runtime `clinical-blue` vs target `clinical-calm` petróleo | Desalineación canon visual / runtime |
| A-03 | Medium | Signoff M3 humano visual pendiente (automation ✓) | Riesgo regresión visual no detectada por bot |
| A-04 | Low | Tensión documental GO 2026-06-11 vs NECESITA REDISEÑO 2026-06-16 | Clarificar autoridad: signoff UX-LAB prevalece para demo |
| A-05 | Low | `quality:ux-lab-close` corrida completa no verificada post-#35 | Gap evidencia CI local |

### 9.3 Riesgos

| Riesgo | Probabilidad | Mitigación |
|--------|--------------|------------|
| Regresión visual al cambiar default a `clinical-calm` | Media | MF-AEST-01 + snapshots before/after |
| Shadow creep en rediseño censo/ficha | Media | Anti-patrones + `epis2-elevation.test.ts` |
| Duplicación shells en tramo estético | Baja | `EPIS_M3_SCAFFOLD_COMPONENTS` + architecture:validate |
| Contraste AAA paciente no alcanzado en dark | Media | MF-AEST-04 + tests dedicados |

---

## 10. Plan de remediación (tramo estético — sin lógica clínica)

**Canon:** `docs/design/EPIS2_CLINICAL_CALM_PREMIUM_PLAN.md`  
**Reglas:** `docs/design/EPIS2_TYPOGRAPHY_AND_AESTHETICS_RULES.md`

| MF | Alcance | Gates | Prohibido |
|----|---------|-------|-----------|
| **MF-AEST-01** | Activar tokens `clinical-calm`; canvas/islands 80/15/5; default visual | `theme:validate`, snapshots | Cambiar flujos SoT |
| **MF-AEST-02** | Censo + ficha dual — jerarquía, spacing MD3, calma editorial | `m3-human-pilot`, E2E censo/ficha | Nuevo registry / comandos |
| **MF-AEST-03** | Modo papel — márgenes, tipografía editorial, watermark | `paper-visual-reference.test.ts` | IA auto-aprobación |
| **MF-AEST-04** | Dark clínico + contraste AAA datos paciente | `clinical-roles.contrast`, V6 | OpenMRS / Carbon |

**Criterio rc4:** Tag `v0.1-demo-rc4` cuando MF-AEST tramo 1 verde **o** signoff estético humano explícito.

---

## 11. Evidencia y reproducibilidad

### 11.1 Arranque Modo A (auditoría manual)

```bash
EPIS2_STACK_SKIP_AI=1 npm run stack:dev
OLLAMA_BASE_URL=http://127.0.0.1:59999
LOCAL_AI_BASE_URL=http://127.0.0.1:59998
VITE_ENABLE_DUAL_CHART_MODES=true
npm run tool:script -- dev:api   # :3001
npm run dev:web                  # :5173
```

Login demo: `medico.demo` / `DEMO-CLAVE-MEDICO`

### 11.2 Gates automatizados

```bash
npm run tool:script -- theme:validate
npm run tool:script -- quality:ux-lab-autopilot
npm run tool:script -- quality:m3-human-pilot
```

### 11.3 Reportes relacionados

| Reporte | Contenido |
|---------|-----------|
| `reports/epis2-ux-lab-human-signoff-2026-06-16.md` | Signoff PASS WITH FIXES |
| `reports/ux-lab-autopilot/run-2026-06-16.md` | Bot GO-CANDIDATE |
| `reports/epis2-m3-human-pilot-2026-06-16.md` | M3 automation GO |
| `reports/archive/2026-06/epis2-entrega-c2-calm-premium-2026-06-11.md` | Entrega tokens Calm (histórico) |

---

## 12. Conclusión de auditoría

EPIS2 posee una **arquitectura estética técnicamente sólida y verificable**: pipeline MTB único, roles clínicos protegidos, gates de contraste y anti-drift, y un design system encapsulado en `@epis2/epis2-ui` con copy español centralizado.

La **arquitectura de experiencia de usuario** cumple el objetivo funcional del programa UX-LAB: un médico demo puede completar el turno sintético en Modo A con señales de confianza claras (demo, borrador, papel, turno).

La **brecha auditada** no es estructural sino **composicional**: la implementación runtime (default `clinical-blue`, jerarquía visual, densidad global) no materializa aún el norte «Clinical Calm Premium» aprobado normativamente pero pendiente de signoff visual de producto.

**Recomendación:** Proceder con tramo **MF-AEST-01…04** bajo congelamiento clínico; mantener `theme:validate` y autopilot UX-LAB como gates de no-regresión; obtener signoff humano visual M3 antes de tag `v0.1-demo-rc4`.

---

*Auditoría generada bajo SDEPIS2 · HEAD `9cf7d44` · Los errores de EPIS no son recuerdos: son gates de EPIS2.*
