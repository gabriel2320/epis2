# EPIS2 — 20 anti-patrones Material Design (prohibidos)

**Estado:** Canon de diseño · **Fase:** THEME-05+ · **Última actualización:** 2026-06-05

Prácticas que **nunca** deben aparecer en EPIS2. Complementan las [20 reglas positivas](EPIS2_TYPOGRAPHY_AND_AESTHETICS_RULES.md). En revisión de PR: si aparece un anti-patrón, el cambio se rechaza o se corrige antes de merge.

**Gates relacionados:** `no-direct-mui-imports`, `single-epis2-theme`, `clinical-roles.contrast.test.ts`, `M3_ANTI_DRIFT_GATES.md`, checklist manual en `EPIS2_THEME_QA_CHECKLIST.md`.

---

## Color y contraste

### 1. Sombras pesadas

**Prohibido:** `box-shadow` intensas, `elevation` alta decorativa, sombras negras opacas en tarjetas y grids.

**EPIS2:** Elevación tonal — `surfaceContainer` vs `surface`; sombras MUI mínimas (`buildEpis2Shadows`). `EpisDataGrid` usa borde sutil, no sombra proyectada.

### 2. Romper duplas de color

**Prohibido:** Texto `text.primary` sobre `primary.main`, íconos sin `onPrimary` / `onSurface` / `onError`.

**EPIS2:** Roles M3 + MTB (`onPrimary`, `onSurface`, `onError`). Gate: `theme:validate` y contraste clínico.

### 3. Paletas saturadas en grandes superficies

**Prohibido:** Marca primaria al 100% como fondo de página, sidebar o canvas clínico.

**EPIS2:** Regla 60-30-10 — `surface` / `surfaceContainer` dominan; `primary` solo acento (~10%).

### 4. Colores semánticos como decoración

**Prohibido:** `error` / `success` / `warning` en botones estéticos, chips decorativos o fondos de sección sin significado.

**EPIS2:** Roles clínicos protegidos (`draft`, `approved`, `critical`, `warning`) — solo contexto semántico. No competir con CTA de marca.

---

## Componentes y contenedores

### 5. Tarjetas anidadas

**Prohibido:** `Card` / `Paper` / isla dentro de otra isla con el mismo tratamiento visual.

**EPIS2:** Una isla por contexto (`epis2IslandSx`). Secciones internas con `Stack` + espaciado, no segunda tarjeta.

### 6. Mezclar estilos de campos

**Prohibido:** `Filled` y `Outlined` en el mismo formulario.

**EPIS2:** Solo **Outlined** en formularios clínicos (`EpisTextField`, `EpisClinicalField`). Sin variante filled en flujos de captura.

### 7. Snackbars sobrecargados

**Prohibido:** Múltiples acciones, párrafos largos, confirmaciones críticas en Snackbar.

**EPIS2:** Usar `EpisAlert` en contexto o diálogo de confirmación. Snackbar (si se adopta): una acción corta máximo.

### 8. Abuso del FAB

**Prohibido:** Más de un FAB por pantalla; FAB para destructivo o secundario.

**EPIS2:** Home = Power Bar / Centro de Comando. Sin FAB en flujos clínicos; acciones en barra o botones contextuales.

### 9. Switch sin efecto inmediato

**Prohibido:** `Switch` que requiere «Guardar» para aplicar.

**EPIS2:** Preferencias de tema aplican al instante (`EpisAppearancePreferencesPanel`). Confirmaciones → checkbox + botón o diálogo.

---

## Tipografía e iconografía

### 10. Mezcla caótica de familias

**Prohibido:** Tercera familia sans decorativa; fuentes arbitrarias por pantalla.

**EPIS2:** Google Sans Text + Roboto (par UI) + Roboto Mono (técnica). Ver `EPIS2_TYPOGRAPHY_AND_AESTHETICS_RULES.md` §1.

### 11. Mezcla de estilos de iconos

**Prohibido:** Filled + Outlined + Two-tone en la misma vista.

**EPIS2:** Material Symbols **Outlined**, peso 400, tamaño coherente con rol tipográfico.

### 12. Texto centrado en bloques largos

**Prohibido:** Párrafos >3 líneas centrados (evolución, epicrisis, ayuda).

**EPIS2:** `epis2ClinicalProseSx` — `textAlign: left`, `maxWidth: 65ch`.

### 13. Tamaños de fuente arbitrarios

**Prohibido:** `fontSize: 15px`, `11px`, estilos inline fuera de escala.

**EPIS2:** Roles M3 (`epis2TypographyRoles`), base 14px × 1.2, piso 13px.

---

## Espaciado, layout y densidad

### 14. Ignorar cuadrícula 8px

**Prohibido:** `padding: 5px`, `margin: 13px`, `gap: 21px` sin justificación documentada.

**EPIS2:** `spacing: 8` (comfortable) / `7` (compact); `epis2GridUnit = 8`. Excepción: radios 2–6 en controles densos (`shape.ts`).

### 15. Áreas táctiles < 48dp

**Prohibido:** Iconos o enlaces con hit target < 48×48px en controles primarios.

**EPIS2:** `epis2BarLayout.inputMinHeight` ≥ 48px; `EpisIconButton` `size="small"` solo en barras con espaciado; acciones críticas en botones con área completa.

### 16. Densidad incorrecta por contexto

**Prohibido:** Tabla compacta en formulario conversacional; formulario «aireado» en grid de auditoría.

**EPIS2:** `comfortable` en formularios/comando; `compact` en `EpisDataGrid` y modo tablero; selector en preferencias.

---

## Movimiento e interacción

### 17. Animaciones lentas o decorativas

**Prohibido:** Transiciones > 300ms, bounce decorativo, animaciones en alertas críticas.

**EPIS2:** `epis2Motion` 80–260ms; `epis2InteractionDuration.max = 300`. `prefers-reduced-motion` obligatorio.

### 18. Sin retroalimentación visual

**Prohibido:** Botones/enlaces sin hover, active, disabled, error.

**EPIS2:** Overrides en `components.ts`. Estados de error con rol `error`, sin animación expresiva.

### 19. Movimiento abrupto (teletransporte)

**Prohibido:** Paneles que aparecen sin transición de origen; cambios de layout sin continuidad.

**EPIS2:** Transiciones en drawer/modal/foco Power Bar; `motionTransition()` con easing M3.

---

## Navegación

### 20. Ocultar navegación principal sin contexto

**Prohibido:** Hamburger como única navegación en escritorio; ocultar «Volver al Centro de Comando».

**EPIS2:** Home = `/comando` (Power Bar). Shell clínico con enlace explícito al Comando. Tablero secundario con «Volver al Centro de Comando» (gate M3-G15).

---

## Checklist rápido (PR)

- [ ] ¿Sin sombras pesadas en superficies nuevas?
- [ ] ¿Duplas on-surface / on-primary respetadas?
- [ ] ¿Semánticos solo con significado clínico?
- [ ] ¿Sin cards dentro de cards?
- [ ] ¿Un solo estilo de campo (outlined)?
- [ ] ¿≤2 familias tipográficas + mono técnica?
- [ ] ¿Iconos outlined uniformes?
- [ ] ¿Espaciado múltiplo de 8?
- [ ] ¿Hit targets ≥ 48px en acciones táctiles?
- [ ] ¿Densidad acorde al contexto?
- [ ] ¿Transiciones ≤ 300ms?
- [ ] ¿Estados hover/disabled/error?
- [ ] ¿Comando siempre alcanzable?

---

## Referencias

- `EPIS2_TYPOGRAPHY_AND_AESTHETICS_RULES.md`
- `EPIS2_MATERIAL3_CLINICAL_EXPERIENCE.md`
- `EPIS2_THEME_PERSONALIZATION.md`
- `docs/quality/M3_ANTI_DRIFT_GATES.md`
