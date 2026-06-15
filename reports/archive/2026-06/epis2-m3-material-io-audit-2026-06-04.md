# EPIS2 — Auditoría Material Design 3 (m3.material.io)

**Fecha:** 2026-06-04 · **Referencia:** [Material Design 3 — Foundations](https://m3.material.io/foundations)  
**Alcance:** Tema (`packages/epis2-ui/src/theme/`), primitivos, pantallas piloto command-first  
**Canon EPIS2:** `docs/design/EPIS2_CLINICAL_DESIGN_SYSTEM_M3.md`, `docs/quality/M3_ANTI_DRIFT_GATES.md`

---

## Veredicto

| Dimensión | Nivel | Comentario |
|-----------|-------|------------|
| **Design tokens / color roles** | ✅ Alto | 6 perfiles MTB, roles `on*` validados, roles clínicos inmutables |
| **Accesibilidad (contraste, motion)** | ✅ Alto | `theme:validate` AA/AAA; `prefers-reduced-motion` en tema |
| **Layout y densidad** | ✅ Alto | Grid 8dp, touch 48dp en botones, formularios Outlined únicos |
| **Tipografía M3** | ⚠️ Medio | Escala comprimida clínica (13–20px); deriva doc vs código (Inter vs Google Sans/Roboto) |
| **Forma y elevación** | ⚠️ Medio-alto | Elevación tonal alineada a EPIS2; esquinas más cuadradas que M3 Expressive |
| **Estados de interacción** | ⚠️ Medio | Focus en inputs; capas de estado M3 incompletas en icon buttons |
| **Componentes M3** | ⚠️ Medio | `EpisButton` tonal no usa `primaryContainer`; `EpisIconButton` sin 48×48 dp |
| **Superficies admin/dev** | 🔶 Bajo impacto | `Paper outlined` solo en admin — fuera piloto clínico |

**Conclusión:** EPIS2 cumple las recomendaciones M3 **críticas para software clínico** (tokens, contraste, una acción primaria, sin decoración semántica, motion accesible). Las desviaciones restantes son **adaptaciones documentadas** (escala tipográfica densa, elevación tonal) o **deuda menor** en primitivos secundarios.

---

## Metodología

1. Revisión de foundations M3: [Design tokens](https://m3.material.io/foundations/design-tokens/overview), [Accessibility](https://m3.material.io/foundations/accessibility/overview), [Layout](https://m3.material.io/foundations/layout/understanding-layout), [Interaction states](https://m3.material.io/foundations/interaction/states/overview).
2. Gates automatizados ejecutados en esta sesión:

```bash
npm run theme:validate      # OK — 8 validadores
npm run quality:m3-signoff  # OK — 30 tests M3
node scripts/architecture/single-epis2-theme.mjs  # M3-G01 OK
```

3. Revisión estática: primitivos, `EpisWorkspaceSection`, auth gateway, admin residual.

---

## Alineación por foundation M3

### 1. Design tokens y color ([Customizing Material](https://m3.material.io/foundations/customization))

| Recomendación M3 | EPIS2 | Estado |
|------------------|-------|--------|
| Roles semánticos (`primary`, `onPrimary`, `surface`, `onSurface`, containers) | MTB → `paletteFromMaterialScheme` + `epis2.surfaces` | ✅ |
| Tokens derivados de seed (Material Theme Builder) | 6 perfiles en `theme/generated/` | ✅ |
| Personalización sin romper accesibilidad | `theme:validate` + `clinical-roles.contrast.test.ts` | ✅ |
| Regla 60-30-10 (superficie vs acento) | Documentada en `EPIS2_CLINICAL_DESIGN_SYSTEM_M3.md` §3.1 | ✅ |

**Fortaleza:** un solo generador (`createEpis2Theme`, M3-G01) y acentos que **no alteran** roles clínicos (`create-epis2-theme.contrast.test.ts`).

### 2. Tipografía ([Type scale](https://m3.material.io/styles/typography/type-scale-tokens))

| Recomendación M3 | EPIS2 | Estado |
|------------------|-------|--------|
| Roles display / headline / title / body / label | `epis2TypographyRoles` + `EpisM3Text` | ✅ parcial |
| Legibilidad en UI densas | Base 14px, piso 13px (`labelMedium`) | ✅ clínico |
| Familia coherente | Google Sans Text + Roboto + Roboto Mono en código | ⚠️ doc dice **Inter** |
| `bodySmall` / `labelSmall` (<12px) | Omitidos a propósito (piso 13px) | ✅ accesibilidad > spec literal |

**Hallazgo doc:** `EPIS2_CLINICAL_DESIGN_SYSTEM_M3.md` §2.1 lista Inter como implementada; `typography.ts` usa Google Sans Text / Roboto. **Acción:** sincronizar documentación.

**Hallazgo UI:** `EpisWorkspaceSection` usa `<h2>` con estilos inline (14px) en lugar de `EpisM3Text role="headlineMedium"` — jerarquía semántica correcta, token tipográfico inconsistente.

### 3. Layout ([Understanding layout](https://m3.material.io/foundations/layout/understanding-layout))

| Recomendación M3 | EPIS2 | Estado |
|------------------|-------|--------|
| Grid 8dp | `epis2M3Spacing`, `epis2GridUnit = 8` | ✅ |
| Área táctil mínima 48×48 dp | `epis2M3TouchTargetMinPx` en `MuiButton` | ✅ botones |
| Formularios proporcionales | Grid 12 columnas `epis2M3FormGridSx` | ✅ |
| Adaptación compacto/expandido | Breakpoints + dock + split pane | ✅ M3-G07 |

**Gap:** `EpisIconButton` delega en MUI default (~40×40 dp) — **por debajo** del mínimo M3 de 48 dp para targets táctiles.

### 4. Shape ([Shape scale](https://m3.material.io/styles/shape/shape-scale-tokens))

| Recomendación M3 | EPIS2 | Estado |
|------------------|-------|--------|
| Escala extra-small → full | `epis2Shape` 2–16px + `full: 9999` | ⚠️ más cuadrado que M3 default |
| Corner consistente por componente | `squircle: 8`, `floating: 16` (dock/auth) | ✅ intencional |

EPIS2 prioriza **lectura clínica densa** sobre expresividad M3 (esquinas 8px vs 12–16px en componentes M3 estándar). Coherente con anti-patrón §3 (sin saturación decorativa).

### 5. Elevación ([Elevation](https://m3.material.io/styles/elevation/overview))

| Recomendación M3 | EPIS2 | Estado |
|------------------|-------|--------|
| Superficies por tono, no solo sombra | `epis2TonalContainerSx`, `Paper elevation: 0` | ✅ |
| Sombras en overlays críticos | Dock flotante + auth: excepción documentada (`floatingDockShadow`) | ⚠️ aceptada |

Alineado con [EPIS2 anti-patrón §1](docs/design/EPIS2_MATERIAL_DESIGN_ANTI_PATTERNS.md) — sombras pesadas prohibidas en clínico.

### 6. Motion ([Motion](https://m3.material.io/styles/motion/overview))

| Recomendación M3 | EPIS2 | Estado |
|------------------|-------|--------|
| Duraciones estándar (100–300ms) | `epis2Motion.duration` 80–260ms | ✅ |
| Respeto `prefers-reduced-motion` | `buildEpis2Components('reduced')`, `prefersReducedMotion()` | ✅ |
| Sin motion expressive en crítico | M3-G06 — revisión manual; tokens estándar only | ✅ |

### 7. Interaction states ([States](https://m3.material.io/foundations/interaction/states/overview))

| Recomendación M3 | EPIS2 | Estado |
|------------------|-------|--------|
| Hover / focus / pressed / disabled | MUI defaults + focus outline inputs (`2px` on `text.primary`) | ⚠️ parcial |
| State layers (opacidad sobre superficie) | No implementado como capa explícita en chips/icon buttons | ⚠️ |
| Estados críticos multi-indicador | Icono + texto + color en alertas clínicas (M3-G08) | ✅ |

**Inputs:** focus con borde 2px alineado a M3 outlined fields. **Icon buttons:** sin `focusVisible` reforzado ni 48dp.

### 8. Accessibility ([Accessibility](https://m3.material.io/foundations/accessibility/overview))

| Recomendación M3 | EPIS2 | Estado |
|------------------|-------|--------|
| Contraste texto ≥ 4.5:1 (AA) | `validate-theme-contrast`, roles clínicos 4.5:1+ | ✅ |
| Objetivo AAA en datos críticos | Documentado; alto contraste opcional en preferencias | ✅ |
| Touch targets | Botones 48dp; icon buttons pendientes | ⚠️ |
| Copy localizado | M3-G09 `spanish-visible-copy` | ✅ |

---

## Componentes clave vs spec M3

### Buttons ([Buttons](https://m3.material.io/components/buttons/overview))

| Variante M3 | EPIS2 | Estado |
|-------------|-------|--------|
| Filled | `appearance="filled"` → contained primary | ✅ |
| Outlined | `appearance="outlined"` | ✅ |
| Text | `appearance="text"` | ✅ |
| Tonal | `appearance="tonal"` | ⚠️ usa `primary.main` como filled, no `primaryContainer` |
| Elevated | No expuesto | ✅ omitido (anti-patrón sombras) |

`EpisClinicalFormActionBar`: **una** filled (Guardar) + outlined (Firmar) + overflow — cumple [M3-G13](docs/quality/M3_ANTI_DRIFT_GATES.md) y UX-G03.

### Text fields ([Text fields](https://m3.material.io/components/text-fields/overview))

- Solo **Outlined** en formularios clínicos (`MuiTextField defaultProps`).
- Altura mínima 48dp, sin animación de label (reduce carga cognitiva).
- ✅ Alineado a anti-patrón §6.

### Auth gateway (`EpisAuthScreen`)

- Superficie única flotante, corner `floating: 16px`.
- Tratamiento **Expressive** M3 permitido en frontera de sesión (no en flujo clínico crítico).
- ✅ LAYOUT-G12 sin marcos anidados.

### Workspace plano (`EpisWorkspaceSection`)

- Sustituye `Paper outlined` por sección plana + `background.default`.
- ✅ Anti-patrón §5 (tarjetas anidadas) en piloto clínico.
- ⚠️ Título de sección debería usar token `headlineMedium` vía `EpisM3Text`.

---

## Matriz gates M3-G01…G15

| ID | Criterio | Resultado auditoría |
|----|----------|---------------------|
| M3-G01 | Un generador de tema | ✅ `createEpis2Theme` único |
| M3-G02 | Roles clínicos inmutables | ✅ tests contrast + tema |
| M3-G03 | Sin decoración semántica | ✅ gates + revisión piloto |
| M3-G04 | Sin info no solicitada | ✅ progressive disclosure ficha |
| M3-G05 | Home = Comando | ✅ |
| M3-G06 | Sin expressive en crítico | ✅ |
| M3-G07 | Layout adaptativo | ✅ dock compact, split pane |
| M3-G08 | Multi-indicador crítico | ✅ alertas clínicas |
| M3-G09 | Copy español | ✅ |
| M3-G10 | loading/error/empty | ✅ widgets + listas piloto |
| M3-G11 | Sin `@mui/*` en web | ✅ grep limpio |
| M3-G12 | Identidad EPIS2 | ✅ contexto clínico, no demo Google |
| M3-G13 | Una acción primaria | ✅ form action bar, login |
| M3-G14 | Personalización ≠ seguridad | ✅ E2E preferencias |
| M3-G15 | Tablero secundario | ✅ enlace volver al Comando |

---

## Hallazgos priorizados (remedio)

### P1 — Primitivos M3 (rápido, alto impacto accesibilidad)

1. **`EpisIconButton`:** ✅ `minWidth/minHeight: 48` (sesión 2026-06-04).
2. **`EpisButton` tonal:** ✅ mapea a `primaryContainer` / `onPrimaryContainer` vía `primary.light` + `primary.dark`.
3. **`EpisWorkspaceSection`:** ✅ título con `EpisM3Text role="headlineMedium"`.
4. **Documentación:** ✅ §2.1 familias tipográficas sincronizada con código.

### P3 — Admin / deuda visual

5. **`AdminConsolePage` / `BlueprintStudioPanel`:** migrar a `EpisWorkspaceSection` o layout admin plano (9× `Paper outlined` residual).
6. **`BlueprintStudioPanel`:** `fontSize: 0.75rem` (12px) en preview — por debajo del piso clínico 13px; restringir a dev-only o subir a 13px.

### P4 — State layers (opcional, fase M3-10)

7. Implementar state layers M3 (`hover: opacity 0.08`, `focus: 0.12`, `pressed: 0.12`) en `EpisChip`, `EpisIconButton`, list items — hoy depende de MUI defaults.

---

## Gates técnicos (sesión)

| Gate | Resultado |
|------|-----------|
| `npm run theme:validate` | OK |
| `npm run quality:m3-signoff` | OK — 30 tests |
| M3-G01 script | OK |
| `npm run check` | OK (sesión previa) |
| `npm run test` | OK — 508 tests (sesión previa) |

---

## Próximo paso recomendado

1. **Remediar P1** (IconButton + tonal) en un PR pequeño con test de touch target.
2. Ejecutar **`npm run quality:m3-human-pilot`** si se necesita evidencia E2E V1–V6 post-cambio.
3. Mantener checklist humano opcional: `docs/quality/M3_VISUAL_SIGNOFF_STEPS.md`.

---

*Material 3 humaniza; EPIS2 no negocia precisión clínica por decoración.* — `M3_ANTI_DRIFT_GATES.md`
