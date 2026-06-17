# EPIS2 — Plan visual modo tradicional MD3 (forma cuadrada · 8 paletas · contraste)

**Versión:** 1.0 · **Fecha:** 2026-06-11  
**Programa:** PROG-DUAL-CHART (ficha electrónica) + Entrega C-2 (PROG-CALM-PREMIUM)  
**Canon base:** [EPIS2_DUAL_CHART_VISUAL_CANON.md](./EPIS2_DUAL_CHART_VISUAL_CANON.md) · [EPIS2_CLINICAL_DESIGN_SYSTEM_M3.md](./EPIS2_CLINICAL_DESIGN_SYSTEM_M3.md)

> **Decisión:** El **modo ficha electrónica (traditional)** sigue Material Design 3 en tokens, tipografía, estados y roles de color, pero adopta un **perfil de forma institucional cuadrada** (redondeo leve). La **barra de comandos** es transversal (Ctrl+K), no un modo visual.

---

## 1. Referencias oficiales Material Design 3

| Tema | URL | Qué extraer |
|------|-----|-------------|
| Shape — principios | [m3.material.io/styles/shape](https://m3.material.io/styles/shape) | Escala semántica; tensión cuadrado/redondo; M3 Expressive (may 2025) |
| Shape — overview | [m3.material.io/styles/shape/overview-principles](https://m3.material.io/styles/shape/overview-principles) | No asignar significado semántico rígido a una forma |
| Color — roles | [m3.material.io/styles/color/roles](https://m3.material.io/styles/color/roles) | primary, on-primary, surface-container*, outline |
| Color — contraste | [m3.material.io/foundations/designing/color-contrast](https://m3.material.io/foundations/designing/color-contrast) | AA/AAA; contraste usuario (standard/medium/high) |
| Color — recursos | [m3.material.io/styles/color/resources](https://m3.material.io/styles/color/resources) | Tonal palettes · MTB |
| Foundations | [m3.material.io/foundations](https://m3.material.io/foundations) | Design tokens · layout · estados |
| Compose M3 | [developer.android.com/.../material3](https://developer.android.com/develop/ui/compose/designsystems/material3) | dynamic color · contraste automático tonal |
| Figma M3 Kit | [Figma Community 1035203688168086460](https://www.figma.com/community/file/1035203688168086460/material-3-design-kit) | Componentes · variables · 12 temas en UI Kit |
| MTB plugin | [Material Theme Builder](https://www.figma.com/community/plugin/1035499668921443566/material-theme-builder) | Export JSON → `source/*.material-theme.json` |

### 1.1 Mapeo MD3 oficial → EPIS2 traditional (forma)

MD3 define escala hasta 48dp y píldoras (`full`). **EPIS2 traditional comprime la escala** para densidad clínica e institucional:

| Token MD3 (dp) | Valor oficial | **EPIS2 traditional (px)** | Uso ficha electrónica |
|----------------|---------------|----------------------------|------------------------|
| `corner-none` | 0 | **0** (`epis2Shape.none`) | Tablas MAR, bordes de panel |
| `corner-extra-small` | 4 | **2–4** | TextField, celdas compactas |
| `corner-small` | 8 | **4** | Chips, badges |
| `corner-medium` | 12 | **6** | Tarjetas secundarias |
| `corner-large` | 16–20 | **8** (`island`, `squircle`, `pill`) | Islas, Paper, botones |
| `corner-extra-large` | 28–32 | **10** (`extraLarge`) | Diálogos |
| `corner-full` | 100% | **8** (no píldora en EMR) | Barra comando: rectángulo redondeado leve, no 28–32px |

**Implementación actual:** `packages/epis2-ui/src/theme/shape.ts` — ya alineado.  
**Conflicto a resolver:** `EPIS2_CLINICAL_CALM_PREMIUM_PLAN.md` propone 20–28px — **no aplicar** a modo traditional; reservar radii mayores solo a superficies de marketing/comando deprecado o a modo papel (documento).

### 1.2 Principio MD3 aplicado

> «Usar tensión cuadrado + redondeo leve» — [overview-principles](https://m3.material.io/styles/shape/overview-principles): combinación de formas rectas y esquinas suaves para jerarquía sin decoración.

---

## 2. Benchmark — sitios y productos de referencia

| Referencia | Por qué | Ideas para EPIS2 traditional |
|------------|---------|------------------------------|
| **Google Workspace** (Gmail, Drive, Calendar) | MD3 real en producción · barras de búsqueda · superficies tonales | Barra comando tipo Workspace; 80% neutros; foco en contenido |
| **Google Health / Workspace healthcare** | Flujos institucionales · compliance | Jerarquía sobria; sin neón; IA secundaria |
| **Material Design 3 site** | Canon vivo | Tokens, motion, shape library |
| **Cliniva (Angular Material 3)** | HMS template M3 | Tablas clínicas, light/dark, densidad hospital |
| **Android Health Connect / FHIR UIs** | Datos clínicos densos | Filas tabulares, chips de estado |
| **Figma M3 Design Kit** (~1.5M usuarios) | Componentes con variables | Validar corner tokens, contrast pairs, dark schemes |

**Anti-referencias (no copiar):** dashboards Excel genéricos · gradientes decorativos · cards con sombra pesada · OpenMRS/O3.

---

## 3. Figma — recursos y uso en EPIS2

| Recurso | Acción |
|---------|--------|
| **Archivo equipo (activo MCP)** | [`Material-3-Design-Kit--Community-`](https://www.figma.com/design/kzxDRjPF9UdQGr5tZNuKK0/Material-3-Design-Kit--Community-?node-id=11-1833) · `fileKey=kzxDRjPF9UdQGr5tZNuKK0` |
| [Material 3 Design Kit (community)](https://www.figma.com/community/file/1035203688168086460) | Origen upstream · v1.25 (may 2026) |
| [M3 Expressive shape library](https://m3.material.io/styles/shape) | Referencia visual; **no** importar radii 28–48dp a traditional |
| Material Theme Builder | Generar/validar 8º perfil `clinical-calm` |
| EPIS2 Storybook `:6006` | Paridad código ↔ Figma para `EpisClinicalSummaryCard`, shell dual |

**Nota sesión 2026-06-11:** el archivo community no es accesible vía API hasta copiarlo al equipo. Tras duplicar, usar `get_libraries` + `search_design_system` con `query: "corner"` / `"surface container"`.

---

## 4. Sistema de color — 8 modos + oscuro + monocromo + contraste

### 4.1 Matriz de modos (8 paletas acento)

Cada perfil = par **light + dark** generado por MTB. Roles clínicos (`clinical.critical`, etc.) **inmutables** entre perfiles.

| # | themeId | Nombre | Seed | Estado | Uso clínico |
|---|---------|--------|------|--------|-------------|
| 1 | `clinical-blue` | Azul clínico | `#1E6FD6` | ✓ | Default hospital / UCI |
| 2 | `calm-teal` | Verde azulado calmado | `#006A6A` | ✓ | Enfermería / continuidad |
| 3 | `clinical-calm` | **Petróleo calm premium** | `#0B5C66` | **pendiente** | Ficha tradicional post-signoff |
| 4 | `ocean-depth` | Azul océano | `#0C4A6E` | ✓ | Especialidades / imagen |
| 5 | `sage-clinical` | Verde salvia | `#28644A` | ✓ | Ambulatorio / rehabilitación |
| 6 | `warm-linen` | Lino cálido | `#78716C` | ✓ | Lectura prolongada |
| 7 | `slate-professional` | Gris pizarra | `#475569` | ✓ | Admin / auditoría |
| 8 | `monochrome-gray` | **Blanco y negro** | `#171717` | ✓ | Alto enfoque datos / impresión pantalla |

**Gap actual:** 7 perfiles en registry; falta **`clinical-calm`** (8º). `monochrome-gray` ya existe pero no estaba en README `source/` — documentar.

### 4.2 Modos de apariencia (ejes ortogonales)

```text
Perfil color (8)  ×  Modo luminancia (light | dark)  ×  Contraste (standard | high)
```

| Eje | Opción | Implementación |
|-----|--------|----------------|
| Paleta | 8 themeId | `MATERIAL_THEME_SCHEMES` · `/preferencias-apariencia` |
| Luminancia | light / dark | `Epis2ThemeOptions.mode` · `prefers-color-scheme` |
| Contraste | standard / high | `contrast: 'high'` — refuerzo `onSurface`, bordes `outline` |
| Densidad | comfortable / compact | Traditional EMR default: **compact** en tablas |
| Motion | standard / reduced | `prefers-reduced-motion` |

### 4.3 Contraste y encuadre (buenas prácticas)

| Regla | Especificación | Gate |
|-------|----------------|------|
| Texto identidad paciente | `onSurface` sobre `surface` ≥ **7:1** | `theme:validate` |
| Botón primario | `onPrimary` sobre `primary` ≥ **4.5:1** | MTB export |
| Datos críticos | icono + texto + color | `clinical-roles.contrast.test.ts` |
| Encuadre islas | max-width + padding 24px; grilla 8dp | `epis2PageIslandSx` |
| Regla 60-30-10 | 60% surface · 30% containers · 10% primary | revisión visual |
| Bordes > sombras | `outlineVariant` 1px; `boxShadow: none` en grids | `components.ts` MuiPaper |

### 4.4 Modo monocromo (blanco y negro)

`monochrome-gray`: acentos en escala neutral; roles clínicos conservan matiz mínimo para accesibilidad. Validar en traditional que chips críticos no dependan solo del hue primary.

---

## 5. Modo tradicional — anatomía y barra de comando

```text
┌ Header institucional (#0B2540) ─────────────────────────────┐
├ Banda paciente (identidad · alergias · estado legal) ───────┤
├ Barra clínica: [Electrónica|Papel] · acciones · Ctrl+K ─────┤
├ Nav │ Contenido EMR denso      │ Panel contexto/IA ─────────┤
├ Footer: autoguardado · estado legal ────────────────────────┤
└─────────────────────────────────────────────────────────────┘
```

| Zona | Forma | Color |
|------|-------|-------|
| Shell fondo | cuadrado | `#EEF3F7` (`epis2TraditionalChartTokens.shellBg`) |
| Tarjetas / islas | radius **8px** | `surface` + borde `outlineVariant` |
| Tablas medicación | radius **0–4px** | zebra sutil `surfaceContainerLow` |
| Barra comando (capa 3) | radius **8px** (no 28px) | `surfaceContainerHigh` + borde |
| Ctrl+K palette | radius **8–10px** | elevación tonal nivel 3 |

**Barra siempre presente:** visible en censo, ficha electrónica y ficha papel; misma altura (52–64px) y token de borde en los tres contextos (Entrega C-2.3).

---

## 6. Plan por etapas (evaluar · revisar · mejorar · seguir)

Cada etapa = 1 sesión agente manual. Nomenclatura SDEPIS2.

### Etapa E1 — Evaluación baseline (Bloque 0)

| Paso | Acción | Salida |
|------|--------|--------|
| E1.1 | Auditar `shape.ts` vs pantallas `TraditionalEhrLayout` | Matriz componente → radio |
| E1.2 | Auditar 7 temas + gaps light/dark/contrast | Tabla contrast AA |
| E1.3 | Capturas traditional light/dark × 3 perfiles | `reports/m3-visual-evidence/traditional/` |
| E1.4 | Duplicar Figma M3 Kit al workspace | Librería publicada |

**Agentes:** `gate-runner` (lectura) · humano  
**Gates:** `npm run check` · `theme:validate` · `clinical-roles.contrast`

---

### Etapa E2 — Activación y revisión shell (Entrega C-4)

| Paso | Acción |
|------|--------|
| E2.1 | Flag `VITE_ENABLE_DUAL_CHART_MODES=true` |
| E2.2 | Evaluar cuatro capas + switch traditional/paper |
| E2.3 | Verificar barra clínica + Ctrl+K en ambos modos |
| E2.4 | E2E `dual-chart-modes` |

**Agentes:** `layers-integrator` → `golden-guardian` → `gate-runner`

---

### Etapa E3 — Forma cuadrada traditional (mejora)

| Paso | Archivo | Cambio |
|------|---------|--------|
| E3.1 | `shape.ts` | Documentar perfil `traditional` vs `calm` (sin ampliar radii EMR) |
| E3.2 | `components.ts` | Chips EMR: `borderRadius: 4` en ficha; mantener touch 48px |
| E3.3 | `chart-modes-tokens.ts` | Alinear `borderRadius` papel (2px preview / 0 print) |
| E3.4 | `island-layout.ts` | Confirmar `island: 8` en traditional |
| E3.5 | Storybook | Stories traditional light/dark × forma cuadrada ✓ `Ficha/Forma traditional E3.5` |

**Criterio Done:** ningún componente de ficha traditional con radius > 10px salvo excepción documentada (dialog).

**Agentes:** `layers-integrator` → `m3-guardian` → `gate-runner`

---

### Etapa E4 — Octava paleta + contraste (mejora color)

| Paso | Acción |
|------|--------|
| E4.1 | Crear `clinical-calm.material-theme.json` (seed `#0B5C66`) |
| E4.2 | `npm run theme:generate` → `generated/` |
| E4.3 | Registrar en `material-theme-registry.ts` + `Epis2ApprovedThemeId` |
| E4.4 | UI `/preferencias-apariencia` — 8 tarjetas de preview |
| E4.5 | Validar dark + `contrast: high` en los 8 perfiles |
| E4.6 | Actualizar `EPIS2_CLINICAL_DESIGN_SYSTEM_M3.md` §1 (8 gamas) |

**Agentes:** `layers-integrator` → `gate-runner` · **no** `ollama-clinical`

**Gates:** `theme:validate` · `clinical-roles.contrast` · `storybook:ui:build`

---

### Etapa E5 — Barra comando unificada (Entrega C-2.3)

| Paso | Acción |
|------|--------|
| E5.1 | Unificar `EpisUniversalCommandBar` en censo + capa 3 |
| E5.2 | Spec: 56–64px alto · radius 8px · borde `outlineVariant` |
| E5.3 | Icono IA `tertiary` 20px · placeholder `onSurfaceVariant` |
| E5.4 | E2E `ux-g02-command-first` + manual Ctrl+K en paper |

**Agentes:** `layers-integrator` → `golden-guardian`

---

### Etapa E6 — Signoff visual integrado (revisar)

| Paso | Acción |
|------|--------|
| E6.1 | Matriz 8 paletas × light/dark × traditional |
| E6.2 | Checklist encuadre (padding, max-width, jerarquía P0–P3) |
| E6.3 | Veredicto GO/NO-GO Calm + traditional |
| E6.4 | Actualizar tablero Entrega C-2 |

**Agente:** humano + opcional OpenClaw `ux` read-only

---

### Etapa E7 — Seguir (Figma + Code Connect opcional)

| Paso | Acción |
|------|--------|
| E7.1 | Pantallas Figma traditional/paper alineadas a código |
| E7.2 | Variables Figma ↔ tokens `epis2Shape` + MTB |
| E7.3 | `.figma.ts` Code Connect para shell + barra |

**Agentes:** diseño humano · `figma-generate-design` skill cuando fileKey local exista

---

## 7. Agentes — uso por etapa

| Etapa | Primario | Secundario | Evitar |
|-------|----------|------------|--------|
| E1 Evaluación | `gate-runner` | — | `dev:auto:*` |
| E2 C-4 shell | `layers-integrator` | `golden-guardian` | OpenClaw patch |
| E3 Forma | `m3-guardian` | `layers-integrator` | Ollama write sin revisión |
| E4 Color 8º | `layers-integrator` | `gate-runner` | Mezclar roles clínicos |
| E5 Barra | `layers-integrator` | `golden-guardian` | Refactor masivo modos legacy |
| E6 Signoff | humano | OpenClaw `ux` | auto-dev |
| E7 Figma | humano + Figma MCP | — | — |

**Arranque:** `npm run dev:session` · declarar Etapa Ex · Entrega C-n.

---

## 8. Definition of Done (este plan)

- [x] Modo traditional: contenedores EMR con radio ≤ 10px (chips/campos 4px vía `epis2ShapeProfiles`)
- [x] 8 perfiles MTB registrados incl. `clinical-calm` y `monochrome-gray`
- [ ] Light + dark + high contrast validados en los 8 (manual UI)
- [x] Barra comando visible y coherente en censo + traditional + paper (variantes `census-search` / `clinical-chart`)
- [x] Gates: `check` · `theme:validate` · `clinical-roles.contrast` · E2E dual + ux-g02 (parcial)
- [ ] Docs: este plan + `EPIS2_CLINICAL_DESIGN_SYSTEM_M3` §1 actualizado
- [ ] Conflicto Calm Premium 20px resuelto: solo fuera de traditional EMR

---

## 9. Próximo paso

**Etapa E1** (evaluación baseline) → **Etapa E2** (C-4 flag on) en la misma semana si gates OK.

```bash
npm run stack:dev
npm run dev:session
npm run theme:validate
npm run quality:dual-chart-ledger
```

**Cursor:** `@reports/dev-agent-brief.md` + `@reports/dev-agent-prompt-m3-guardian.md` (Etapa E3) o `layers-integrator` (E2/E4/E5).

---

## 10. Enlaces rápidos

- Plan maestro partes: [`reports/archive/2026-06/epis2-plan-maestro-desarrollo-por-partes-2026-06-11.md`](../../reports/archive/2026-06/epis2-plan-maestro-desarrollo-por-partes-2026-06-11.md)
- Shape código: [`packages/epis2-ui/src/theme/shape.ts`](../../packages/epis2-ui/src/theme/shape.ts)
- Perfiles MTB: [`packages/epis2-ui/src/theme/source/`](../../packages/epis2-ui/src/theme/source/)
