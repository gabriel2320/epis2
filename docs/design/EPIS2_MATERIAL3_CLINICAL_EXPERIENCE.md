# EPIS2 Material 3 Clinical Experience

**Sistema:** `EPIS2 Material 3 Clinical` · **Fase activa:** M3-00 (rebaseline) · **Última actualización:** 2026-06-04

---

## Identidad del sistema visual

```text
Material 3        → lenguaje visual (roles, forma, movimiento, adaptación)
Material UI       → base React (MUI 6 + MUI X bajo demanda)
@epis2/epis2-ui   → implementación clínica EPIS2
```

**Perfiles de color (6 gamas MTB):** `docs/design/EPIS2_CLINICAL_DESIGN_SYSTEM_M3.md`

**Conciliación olas × M3 adaptativo:** [`EPIS2_CLINICAL_MATERIAL3_CONCILIATION.md`](./EPIS2_CLINICAL_MATERIAL3_CONCILIATION.md) — sistema **ECM3**, navegación 6 áreas ↔ 5 workspaces, gate M3-UI por ola.

### Principio rector

```text
Material 3 humaniza la experiencia.
EPIS2 conserva la precisión y seguridad clínica.
```

### Expresividad controlada

| Contexto | Tratamiento |
|----------|-------------|
| Login | Expresivo y acogedor |
| Centro de Comando | Expresivo, limpio y enfocado |
| Estados vacíos | Expresivo moderado |
| Búsqueda de paciente | Sobrio y preciso |
| Formularios clínicos | M3 Standard |
| Evolución y epicrisis | M3 Standard, tipo documento |
| Alertas y aprobación | Sobrio, estable y explícito |
| Tablas y auditoría | Denso y funcional |
| Modo tablero | Adaptativo, sin dominar la experiencia |

**Prohibido:** formas, colores o animaciones expresivas en errores críticos, alertas clínicas, aprobación humana o acciones peligrosas.

---

## Consideración técnica (MUI ≠ M3 nativo)

Material UI para React implementa **Material Design 2** como base; no hay paridad 1:1 con Material 3. EPIS2 interpretará M3 mediante:

- tema propio (`createEpis2Theme`);
- variables CSS (`cssVariables: true`, ya activo en `epis2Theme`);
- tokens de roles M3 mapeados a palette MUI;
- overrides de componentes en `packages/epis2-ui/src/theme/`;
- primitivos EPIS2 que encapsulan patrones M3 (filled / tonal / text, chips, search).

Referencias:

- [Material Design 3](https://m3.material.io/)
- [Material UI — Overview](https://mui.com/material-ui/getting-started/)
- [MUI CSS theme variables](https://mui.com/material-ui/customization/css-theme-variables/overview/)

---

## 1. Fundamentos M3 → EPIS2

### Color: roles, no valores sueltos

Usar roles M3 (estáticos o con acento dinámico controlado):

```text
primary / onPrimary / primaryContainer / onPrimaryContainer
secondary / onSecondary / secondaryContainer / onSecondaryContainer
surface / surfaceContainer / surfaceContainerHigh
onSurface / onSurfaceVariant
outline / outlineVariant
error / onError / errorContainer / onErrorContainer
```

**Roles clínicos protegidos** (no modificables por personalización de acento):

| Rol | Uso | Referencia light |
|-----|-----|------------------|
| `draft` | Borrador local | `#5B5BD6` / container `#EEEEFF` |
| `aiAssistance` | Asistencia IA | `#7455A6` / container `#F3EDFF` |
| `approved` | Aprobación humana | `#18794E` / container `#E8F5EE` |
| `warning` | CDS moderado | `#9A6700` / container `#FFF4CE` |
| `critical` | Seguridad / bloqueo | `#B42318` / container `#FDECEC` |

Implementación objetivo: `packages/epis2-ui/src/theme/clinical-roles.ts`.

### Color dinámico controlado

Acentos permitidos (modifican primario, foco, navegación seleccionada, chips activos, decoración menor):

- azul clínico (default EPIS2);
- azul petróleo;
- verde calmado;
- violeta sobrio;
- neutro.

**Nunca** modificar con acento: error, crítico, advertencia, aprobación, borrador, contraste mínimo, alertas de seguridad.

### Forma

**Decisión (2026-06-09):** EPIS2 usa una **escala comprimida clínica** — la mitad de los valores
de referencia M3 (4/8/12/16/28). Razón: densidad de datos clínicos y estética de esquinas casi
cuadradas; los overlays flotantes (`floating: 16`) conservan el extraLarge M3. Esta tabla refleja
el código real (`shape.ts` es la verdad):

```ts
// packages/epis2-ui/src/theme/shape.ts (implementado)
const epis2Shape = {
  none: 0,        // tablas densas, documentos print
  extraSmall: 2,
  small: 4,
  medium: 6,
  large: 8,       // = borderRadius base MUI
  extraLarge: 10,
  island: 8,      // isla de contenido principal
  squircle: 8,    // botones y controles
  pill: 8,        // power bar y chips — rectángulo redondeado, no píldora
  floating: 16,   // dock flotante / overlays MD3
  full: 9999,
};
```

| Componente | Forma |
|------------|------:|
| Power Bar | `full` |
| Chips de comandos | `full` |
| Botones principales | `large` |
| Inputs | `medium` |
| Formularios / canvas clínico | `large` / `extraLarge` |
| Diálogos | `extraLarge` |
| Tablas / grids | `small` |
| Alertas críticas | `medium` |

Reglas: formas grandes = espacios de trabajo; formas pequeñas = datos densos; sin shape morph en elementos críticos.

### Tipografía (cinco roles M3)

| Rol M3 | Uso EPIS2 |
|--------|-----------|
| Display | Pregunta principal (Login, Centro de Comando) |
| Headline | Título de página clínica |
| Title | Secciones y actividades |
| Body | Contenido clínico y formularios |
| Label | Campos, botones, estados, metadatos |

Reglas: Display solo Login y Comando; formularios usan title/body/label; sin MAYÚSCULAS completas; documentos clínicos priorizan lectura prolongada; copy visible en español.

**Decisión (2026-06-09) — compresión tipográfica clínica:** EPIS2 implementa **10 de los 15 roles M3**
(sin variantes Small) sobre base 14px con piso legible de 13px (`labelMedium`). No es deuda: la escala
M3 canónica (display 57px) está diseñada para marketing/móvil, no para densidad clínica. Si un caso
exige una variante Small, se añade el rol — no se baja del piso de 13px.

**Canon extendido (20 reglas):** `EPIS2_TYPOGRAPHY_AND_AESTHETICS_RULES.md` — escala modular, prosa `65ch`, tabular-nums, grid 8pt, 60-30-10, estados y movimiento. Tokens en `typography-rules.ts`.

**Anti-patrones (20 prohibidos):** `EPIS2_MATERIAL_DESIGN_ANTI_PATTERNS.md` — sombras pesadas, duplas rotas, cards anidadas, FAB abusivo, animaciones >300ms, etc.

### Movimiento

```text
M3 Standard  → formularios, documentos, aprobación, errores, alertas, navegación clínica
M3 Expressive controlado → login, foco Power Bar, sugerencias, nueva actividad, empty states
```

Tokens implementados en `packages/epis2-ui/src/theme/motion.ts`:

```ts
duration: { instant: 80, short: 120, medium: 180, long: 260 }
easing: {
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
  emphasized: 'cubic-bezier(0.05, 0.7, 0.1, 1)',          // M3 emphasized-decelerate
  emphasizedAccelerate: 'cubic-bezier(0.3, 0, 0.8, 0.15)', // M3 emphasized-accelerate
  exit: 'cubic-bezier(0.4, 0, 1, 1)',
}
```

Respetar `prefers-reduced-motion` siempre.

### Estados (state layers M3)

Feedback de interacción con **el color del contenido**, no negro fijo ni `filter: brightness`:

```ts
// motion.ts — epis2StateLayerOpacity / epis2StateLayer(container, layer, state)
hover: 0.08 · focus: 0.10 · pressed: 0.10 · dragged: 0.16
```

`palette.action.*` queda alineado a estos valores en `createEpis2Theme`. Para superficies custom
usar `epis2StateLayer()` (color-mix), nunca opacidades ad-hoc. Foco visible universal:
`*:focus-visible` 2px (3px en alto contraste) — WCAG 2.4.7.

---

## 2. Diseño adaptativo

Material 3 distingue **adaptación** (cambio de layout por contexto) de **responsive** (solo escala).

### Centro de Comando

| Breakpoint | Layout |
|------------|--------|
| Compacto | Header mínimo · Power Bar · chips scroll · resultado en una columna |
| Medio | Power Bar central · contexto paciente · resultado debajo |
| Expandido | Power Bar central · canvas principal · panel contextual bajo demanda |

El espacio extra **no** se llena con widgets automáticos.

### Páginas clínicas (expandido)

```text
Canvas clínico principal + panel secundario solicitado
```

Ejemplos de panel: fuentes, medicamentos, resultados recientes, datos faltantes. Nunca los cuatro a la vez sin solicitud explícita.

**Two-pane (LAYOUT-01+):** En evolución y epicrisis, el patrón canónico M3 *Two-pane* separa **consulta** (izquierda, `surfaceContainerLow`) de **acción** (derecha, `surfaceContainerLowest`). Por defecto solo el lienzo de escritura; el historial se invoca con «Consultar historial». Especificación completa: `EPIS2_CLINICAL_TWO_PANE_LAYOUT.md`.

---

## 3. Experiencia por área

### Login

- Superficie central grande, `extraLarge`, container suave.
- Jerarquía tipográfica clara; acción principal filled.
- Transición corta al Centro de Comando.
- Solo: EPIS2 · Inteligencia clínica local · usuario · contraseña · ingresar.
- Sin ilustraciones grandes, dashboards ni detalle técnico.

### Centro de Comando

Patrón M3 **Search** como núcleo (Power Bar).

```text
Top app bar mínima
Contexto discreto
Pregunta principal (Display)
Power Bar
Sugerencias (assist chips)
Área de respuesta
Acceso discreto a modo tablero
```

Acciones que compiten visualmente: escribir comando · buscar paciente · abrir tablero. Nada más.

### Páginas clínicas

```text
Top app bar clínica mínima
Contexto del paciente
Estado de borrador
Canvas / formulario (tipo documento)
Asistencia IA contextual
Barra de seguridad
Acciones humanas
```

Fuentes, auditoría e historial colapsados por defecto.

### Modo tablero (secundario)

```text
Top app bar · tabs (Mi trabajo / Paciente / Servicio / Calidad)
Filtros contextuales · widgets solicitados
Volver al Centro de Comando (obligatorio)
```

Widgets por relevancia, rol y elección — no por disponibilidad técnica.

---

## 4. Patrones de componente M3

| Necesidad | Patrón M3 | Wrapper EPIS2 |
|-----------|-----------|---------------|
| Acción principal | Filled button | `EpisButton` variant filled |
| Acción secundaria | Tonal button | `EpisButton` tonal (M3-03) |
| Acción discreta | Text button | `EpisButton` text |
| Irreversible | Diálogo + acción explícita | `EpisDialog` + confirmación |
| Comandos rápidos | Assist chips | `EpisCommandSuggestions` |
| Filtros | Filter chips | chips dashboard (M3-07) |
| Power Bar | Search | `EpisCommandBar` |
| Borrador | Badge / chip semántico | `EpisDraftStatus` |
| Feedback temporal | Snackbar | `EpisSnackbar` (M3-03) |
| Advertencia persistente | Banner / alert | `EpisAlert`, `EpisSafetyBanner` |
| Formularios largos | Secciones + expansión | `EpisClinicalForm` |

No usar FAB como sustituto del Centro de Comando.

---

## 5. Estados accesibles

Un estado crítico combina **al menos dos** indicadores: color + icono, color + texto, icono + texto, forma + texto.

Ejemplo correcto: `[icono bloqueo] Acción bloqueada por seguridad`  
Incorrecto: solo borde rojo.

---

## 6. Personalización permitida

**Permitido:** claro / oscuro / sistema · acento aprobado · densidad · tamaño texto · contraste · movimiento reducido · accesos frecuentes.

**Prohibido:** cambiar colores críticos · ocultar safety bar · modificar permisos · ocultar advertencias · alterar jerarquías clínicas · reemplazar textos de seguridad · dashboard como home.

---

## 7. Arquitectura de implementación

```text
packages/epis2-ui/
├─ theme/
│  ├─ color-roles.ts          # M3-01
│  ├─ clinical-roles.ts       # M3-01
│  ├─ typography.ts           # evolución a roles M3
│  ├─ shape.ts                # M3-01
│  ├─ motion.ts               # M3-01
│  ├─ breakpoints.ts
│  ├─ component-overrides.ts  # ← components.ts actual
│  └─ create-epis2-theme.ts   # M3-02
├─ primitives/
├─ command/
├─ clinical/
├─ dashboard/
├─ feedback/
└─ accessibility/
```

API objetivo del generador:

```ts
createEpis2Theme({
  mode: 'light',
  accent: 'clinicalBlue',
  density: 'comfortable',
  contrast: 'standard',
  motion: 'standard',
});
```

Un solo `Epis2ThemeProvider`, un solo generador, variables CSS para preferencias antes del paint.

---

## 8. Relación con trabajo MUI completado

| Completado (MUI) | Rol en M3 |
|------------------|-----------|
| MUI-01 Core + tema | Baseline; migrar tokens a roles M3 (M3-01–02) |
| MUI-02 Catálogo `/dev/ui-catalog` | Ampliar con secciones M3 (M3-03) |
| MUI-03 Login + Comando | Re-skin M3 Expressive (M3-04) |
| MUI-04 Formularios | M3 Standard documento (M3-05) |
| MUI-05–08 Grids, pickers, charts, tree | Mantener; densidad/adaptación (M3-06–07) |
| MUI-09 Dashboard shell | Adaptativo secundario (M3-07) |
| MUI-10 Scheduler spike | Sin integración clínica hasta LIC-007 |
| MUI-11 (planificado) | Absorbido en M3-01 (bundle/tokens) + M3-09 (QA/CI) |

---

## 9. Resultado esperado

EPIS2 debe sentirse:

```text
personal sin ser informal
expresivo sin distraer
adaptativo sin llenarse de paneles
moderno sin perder precisión
inteligente sin quitar control humano
```

> **Usar Material 3 para hacer EPIS2 más fácil de comprender y operar, no simplemente más decorativo.**

---

## Impresión clínica (frontera M3)

M3 gobierna **pantalla**. Los documentos imprimibles y PDF siguen una norma aparte: transformación a documento plano, formatos Carta/A5, sin captura de UI interactiva.

**Norma canónica:** `docs/design/EPIS2_PRINTABLE_CLINICAL_DOCUMENTS_NORM.md`

---

## Referencias

- `docs/design/EPIS2_PRINTABLE_CLINICAL_DOCUMENTS_NORM.md` — norma gráfica y técnica impresión/PDF Chile
- `docs/design/M3_ADOPTION_PLAN.md` — roadmap ejecutable M3-00…M3-09
- `docs/design/EPIS2_THEME_SPEC.md` — tokens actuales (evolución → M3)
- `docs/quality/M3_ANTI_DRIFT_GATES.md` — gates permanentes
- `docs/design/MUI_X_ADOPTION_PLAN.md` — capacidades MUI X (capa técnica)
- `reports/epis2-m3-plan-rebaseline.md` — resumen del replan
