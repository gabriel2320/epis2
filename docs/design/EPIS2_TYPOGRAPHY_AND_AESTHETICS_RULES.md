# EPIS2 — Reglas de tipografía y estética

**Estado:** Canon de diseño · **Fase:** THEME-02+ · **Última actualización:** 2026-06-04

Veinte reglas que gobiernan legibilidad clínica y composición visual. La implementación vive en `packages/epis2-ui/src/theme/`; este documento es la fuente de verdad normativa.

**Implementación en código:**

| Artefacto | Ruta |
|-----------|------|
| Roles tipográficos M3 | `typography.ts` |
| Constantes de las 20 reglas | `typography-rules.ts` |
| Movimiento | `motion.ts` |
| Forma y grid | `shape.ts`, `spacing` en `create-epis2-theme.ts` |
| Estados de componente | `components.ts` |
| Contraste clínico | `clinical-roles.ts` + `clinical-roles.contrast.test.ts` |

---

## Tipografía y legibilidad

### 1. Limitar las familias tipográficas

**Regla:** Una sans-serif para la interfaz; monoespaciada solo para código, logs o datos técnicos.

**EPIS2:**

| Capa | Familia | Uso |
|------|---------|-----|
| Display / títulos | Google Sans Text | Login, Centro de Comando, encabezados |
| Cuerpo / controles | Roboto | Formularios, tablas, metadatos |
| Técnica | Roboto Mono | `pre`, `code`, logs, IDs de sistema |

Google Sans Text y Roboto forman el **par sans UI** (misma línea Google Workspace). Roboto Mono es la **única** familia monoespaciada.

```ts
import { epis2DisplayFontFamily, epis2BodyFontFamily, epis2MonoFontFamily } from '@epis2/epis2-ui/theme';
```

---

### 2. Escala tipográfica matemática

**Regla:** Tamaños derivados de una base modular (p. ej. 16px × 1.2), no valores arbitrarios.

**EPIS2:** Base **14px** (contexto clínico denso; ver `EPIS2_THEME_SPEC.md`). Ratio **1.2**:

| Token | px | rem |
|-------|-----|-----|
| labelMedium | 13 | 0.8125 |
| body | 14 | 0.875 |
| headline | 17 | 1.0625 |
| display | 20 | 1.25 |

Piso absoluto: **13px** — prohibido texto por debajo.

```ts
import { epis2TypeScale } from '@epis2/epis2-ui/theme/foundations/typography';
```

---

### 3. Longitud de línea

**Regla:** 45–75 caracteres por línea en bloques de lectura prolongada.

**EPIS2:** `maxWidth: 65ch` en evoluciones, epicrisis, notas y documentación clínica.

```ts
import { epis2ClinicalProseSx } from '@epis2/epis2-ui/theme/foundations/typography';
// <Box sx={epis2ClinicalProseSx}>…</Box>
```

---

### 4. Interlineado contextual

**Regla:** 1.5 en párrafos; 1.2 en encabezados; comprimido en tablas densas.

**EPIS2:**

| Contexto | lineHeight |
|----------|------------|
| bodyLarge / bodyMedium | 1.5 |
| display / headline | 1.2 |
| tablas / grids (`small` density) | ~1.35 |

---

### 5. Figuras tabulares

**Regla:** Números de ancho fijo en métricas, dosis y columnas que cambian.

**EPIS2:**

```ts
import { epis2TabularNumsSx, epis2NumericCellSx } from '@epis2/epis2-ui/theme/foundations/typography';
```

Aplicar en `EpisDataGrid`, KPIs, signos vitales y campos numéricos dinámicos. `MuiCssBaseline` aplica tabular-nums en `code`/`pre`.

---

### 6. Peso para jerarquía

**Regla:** Medium/Semibold en etiquetas; Regular en datos — no escalar solo con `fontSize`.

**EPIS2:** `labelMedium` → 500; `body*` → 400; `display*` / `headline*` → 600. Los datos clínicos no se destacan aumentando tamaño salvo en alertas.

---

### 7. Sin mayúsculas sostenidas

**Regla:** Reservar `UPPERCASE` para acrónimos, chips cortos o botones compactos.

**EPIS2:** `textTransform: 'none'` en `MuiButton`. Copy en español con capitalización de oración. Prohibido títulos de sección en mayúsculas completas.

---

### 8. Alineación lógica

**Regla:** Párrafos a la izquierda; centrado solo en textos cortos; números a la derecha en tablas.

**EPIS2:**

- Prosa clínica: `textAlign: 'left'` (`epis2ClinicalProseSx`).
- Títulos aislados (Login, empty states): centrado permitido.
- Celdas numéricas: `epis2NumericCellSx` (`textAlign: 'right'`).

---

### 9. Tracking por tamaño

**Regla:** Más espaciado en textos pequeños; menos en display.

**EPIS2:**

| Rol | letterSpacing |
|-----|---------------|
| labelMedium (13px) | `0.02em` |
| displayLarge/Medium | `-0.02em` |

---

### 10. Contraste WCAG AA

**Regla:** Texto principal ≥ 4.5:1 con el fondo.

**EPIS2:** Roles MTB (`clinical-blue`) + roles clínicos protegidos. Gate: `clinical-roles.contrast.test.ts` y `theme:validate`. La estética no puede reducir contraste por debajo de AA en texto de lectura.

---

## Estética y composición visual

### 11. Cuadrícula de 8 puntos

**Regla:** Márgenes, rellenos y tamaños en múltiplos de 8.

**EPIS2:** `spacing: 8` (modo comfortable = 8px por unidad MUI). `epis2GridUnit = 8`. **Excepción documentada:** radios de forma usan 2, 4, 6, 8, 10, 12, 16, 24, 28 (`shape.ts`) — los radios pequeños (2–6) sirven chips y controles densos; padding y gaps siguen 8pt.

---

### 12. Ley de proximidad

**Regla:** Elementos relacionados más cerca; grupos separados por más espacio en blanco.

**EPIS2:** Islas clínicas (`island-layout`), secciones de formulario con `gap` consistente, Power Bar separada del canvas. No mezclar acciones de distinto contexto en la misma fila sin separación visual.

---

### 13. Evitar negro puro

**Regla:** No `#000000` en fondos ni texto sobre oscuro.

**EPIS2:** MTB dark usa `#111318`, `#1A1C20`, etc. `epis2ForbiddenColors.pureBlack` — gate manual en revisiones de tema. Texto sobre oscuro: `onSurface` del esquema, no blanco puro salvo `contrastText` calculado.

---

### 14. Regla 60-30-10

**Regla:** 60% tono dominante (fondos), 30% secundario (contenedores/nav), 10% acento (CTA).

**EPIS2:** Aplicado vía roles M3:

| % | Rol M3 | EPIS2 |
|---|--------|-------|
| 60% | `surface` / `background` | Canvas clínico, fondo app |
| 30% | `surfaceContainer` / `surfaceContainerHigh` | Tarjetas, barras, sidebars |
| 10% | `primary` | Botón principal, foco Power Bar |

Acentos clínicos (`draft`, `warning`, `critical`) son semánticos, no decorativos — no compiten con el 10% de marca.

---

### 15. Iconografía uniforme

**Regla:** Mismo grosor de trazo, detalle y estilo (sólido o contorneado).

**EPIS2:** Material Symbols Outlined, peso 400, tamaño coherente con `label`/`title`. Prohibido mezclar icon sets (Font Awesome, SVG sueltos) en la misma vista.

---

### 16. Densidad con propósito

**Regla:** Paneles complejos en contenedores (tarjetas) con padding interno consistente.

**EPIS2:** Centro de Comando = islas; modo tablero = `density: compact` en grids; formularios = `comfortable`. Sin controles sueltos sobre el fondo del canvas.

---

### 17. Fondos en lugar de bordes

**Regla:** Separar secciones con cambio tonal sutil, no líneas en cada elemento.

**EPIS2:** `surfaceContainer` vs `surface`; `divider` / `outlineVariant` solo donde la separación semántica lo exige (tablas, listas). Evitar `border: 1px` en cada tarjeta anidada.

---

### 18. Estados de interacción claros

**Regla:** Hover, Active, Disabled y Error visualmente distintos e inmediatos.

**EPIS2:** Overrides en `components.ts` — `MuiButton`, `MuiTextField`, `MuiChip`, etc. Estados de error usan `error` / `onErrorContainer` sin animación expresiva. Disabled: opacidad + `pointer-events: none`.

---

### 19. Elevación tonal

**Regla:** Superposiciones (modal, menú, drawer) aclaran fondo; no solo sombras pesadas.

**EPIS2:** `surfaceContainerHighest` / `surfaceBright` en overlays MTB. Sombras MUI suaves (`elevation` baja). Modales y menús: fondo más claro que el canvas, sombra ligera complementaria.

---

### 20. Animaciones funcionales

**Regla:** 150–300ms; movimiento explica origen, no decora.

**EPIS2:**

```ts
epis2InteractionDuration = { min: 150, max: 300 }
epis2Motion.duration = { instant: 80, short: 120, medium: 180, long: 260 }
```

- `instant`/`short`: micro-feedback (80–120ms) — por debajo del rango solo para affordances mínimos.
- `medium`/`long`: transiciones de panel y foco (180–260ms) — dentro de 150–300ms.
- `prefers-reduced-motion`: transiciones desactivadas (`motion.ts`, `buildEpis2Components`).

**Prohibido:** animaciones en alertas críticas, aprobación humana o errores de seguridad clínica.

---

## Checklist de revisión (PR / QA)

- [ ] ¿Solo sans UI + mono técnica?
- [ ] ¿Tamaños en escala 14px × 1.2 (mín. 13px)?
- [ ] ¿Prosa clínica ≤ 65ch?
- [ ] ¿Números dinámicos con `tabular-nums`?
- [ ] ¿Jerarquía por peso, no solo tamaño?
- [ ] ¿Sin MAYÚSCULAS en bloques de lectura?
- [ ] ¿Contraste AA en texto nuevo?
- [ ] ¿Espaciado en múltiplos de 8?
- [ ] ¿Sin `#000` en tema?
- [ ] ¿Estados hover/disabled/error definidos?
- [ ] ¿Transiciones ≤ 300ms y respetan reduced-motion?

---

## Referencias

- `EPIS2_MATERIAL_DESIGN_ANTI_PATTERNS.md` — 20 prácticas prohibidas (complemento negativo)
- `EPIS2_MATERIAL3_CLINICAL_EXPERIENCE.md` — expresividad por contexto
- `EPIS2_THEME_SPEC.md` — tokens y preferencias
- `EPIS2_THEME_QA_CHECKLIST.md` — gates de tema
