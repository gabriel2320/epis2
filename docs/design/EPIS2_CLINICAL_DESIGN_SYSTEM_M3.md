# EPIS2 — Sistema de diseño clínico Material Design 3

**Versión:** 1.0 · **Fecha:** 2026-06-07  
**Alcance:** Ficha médica electrónica command-first · 6 perfiles de color MTB · roles clínicos inmutables  
**Implementación:** `packages/epis2-ui/src/theme/` · selector en `/preferencias-apariencia`

> **Regla de oro:** El acento de marca ocupa ~10% del canvas (botones primarios, chips activos). Los roles clínicos (`draft`, `approved`, `critical`, `warning`, `aiAssistance`) **no** cambian al alternar perfil de color.

---

## 1. Paleta de colores — perfiles MTB (6 gamas)

Cada perfil exporta roles M3 completos (light + dark). Fuente: `source/*.material-theme.json`.

### 1.1 Resumen de perfiles

| Perfil | themeId | Seed | Inspiración clínica | Uso recomendado |
|--------|---------|------|-------------------|-----------------|
| **Azul clínico** | `clinical-blue` | `#1E6FD6` | Confianza, tecnología sanitaria | Default hospital / UCI |
| **Verde azulado calmado** | `calm-teal` | `#006A6A` | Higiene, calma, enfermería | Áreas de cuidados continuos |
| **Gris pizarra profesional** | `slate-professional` | `#475569` | Neutralidad institucional | Admin, auditoría, back-office |
| **Verde salvia clínico** | `sage-clinical` | `#28644A` | Naturaleza, bienestar, rehabilitación | Ambulatorio, salud mental |
| **Azul océano profundo** | `ocean-depth` | `#0C4A6E` | Autoridad serena, especialidades | Quirófano, imagenología |
| **Lino cálido** | `warm-linen` | `#78716C` | Lectura prolongada, baja fatiga | Historias clínicas densas, tablet en cama |

### 1.2 Tokens Primary / Secondary / Tertiary (modo claro)

| Token MD3 | Rol | Clinical Blue | Calm Teal | Slate Pro | Sage | Ocean | Warm Linen |
|-----------|-----|---------------|-----------|-----------|------|-------|------------|
| `primary` | Acción principal (~10%) | `#1E6FD6` | `#006A6A` | `#475569` | `#28644A` | `#0C4A6E` | `#78716C` |
| `onPrimary` | Texto sobre primary | `#FFFFFF` | `#FFFFFF` | `#FFFFFF` | `#FFFFFF` | `#FFFFFF` | `#FFFFFF` |
| `primaryContainer` | Fondo acento suave | `#D4E3FF` | `#B2EBEB` | `#DCE3ED` | `#B8EAD0` | `#C8E6FF` | `#F0EAE4` |
| `onPrimaryContainer` | Texto container | `#00458F` | `#004F4F` | `#2F3A47` | `#0A4A32` | `#003352` | `#4A443F` |
| `secondary` | Acción secundaria | `#535F70` | `#4A6363` | `#5C6470` | `#4F6358` | `#4F6070` | `#635F5B` |
| `tertiary` | Acento terciario | `#6B5778` | `#4B607C` | `#5D5C7A` | `#3F6374` | `#5A5F82` | `#6B5E52` |

### 1.3 Surface — lectura prolongada (modo claro)

| Token MD3 | Rol | Clinical Blue | Warm Linen (ej. fatiga) |
|-----------|-----|---------------|-------------------------|
| `surface` | Canvas base | `#F8F9FF` | `#FFFBF8` |
| `surfaceContainer` | Tarjetas / islas | `#ECEEF5` | `#F4EFEB` |
| `surfaceContainerHigh` | Paneles elevados | `#E6E8F0` | `#EEE9E5` |
| `onSurface` | Texto principal | `#191C20` | `#1C1917` |
| `onSurfaceVariant` | Meta / secundario | `#43474E` | `#494541` |
| `outline` | Bordes | `#73777F` | `#7A7672` |

**Modo oscuro:** todos los perfiles usan superficies `#111318`–`#32353A` (MTB dark EPIS2). Primary invierte a tono claro (ej. `#A6C8FF` en Clinical Blue).

### 1.4 Error y alertas clínicas (inmutables)

Los roles **MD3 error** vienen del esquema MTB. Los roles **clínicos EPIS2** son independientes del perfil de color:

| Token | Rol MD3 / clínico | HEX | Uso |
|-------|-------------------|-----|-----|
| `error` | MD3 error | `#BA1A1A` (light) | Validación formulario |
| `errorContainer` | MD3 | `#FFDAD6` | Fondo error |
| `clinical.critical` | Alerta crítica | `#B42318` | Alergias, contraindicaciones, vitales anómalos |
| `clinical.critical.container` | Fondo crítico | `#FDECEC` | Banner alergia |
| `clinical.warning` | Advertencia | `#9A6700` | Pendientes, revisión farmacia |
| `clinical.warning.container` | Fondo warning | `#FFF4CE` | Chips advisory CDS |
| `clinical.approved` | Aprobado SoT | `#18794E` | Nota firmada, estado aprobado |
| `clinical.draft` | Borrador | `#5B5BD6` | Chip borrador / pendiente |
| `clinical.aiAssistance` | IA orientativa | `#7455A6` | Disclosure IA — nunca SoT |

**Contraste:** gates `clinical-roles.contrast.test.ts` y `theme:validate` — mínimo **AA** texto; objetivo **AAA** en datos críticos del paciente.

---

## 2. Tipografía (MD3 Type Scale)

### 2.1 Familia recomendada

| Prioridad | Familia | Google Fonts | Motivo |
|-----------|---------|--------------|--------|
| **1 (implementada)** | **Google Sans Text + Roboto** | Google Fonts | Par UI/cuerpo al estilo Workspace; legibilidad clínica |
| Alternativa | **Inter** | `Inter` | Legibilidad UI, números tabulares |
| Alternativa | **DM Sans** | `DM Sans` | Geometría moderna, buena en tablet |

Base EPIS2: **14px** cuerpo · mínimo **13px** meta · prosa clínica ≤ **65ch**.

### 2.2 Escala implementada (`epis2TypographyRoles`)

| Rol MD3 | Tamaño | Peso | Uso clínico |
|---------|--------|------|-------------|
| `displayLarge` / `displayMedium` | 20px (1.25rem) | 600 | Centro de Comando — «¿Qué necesitas hacer?» |
| `headlineLarge` | 17px | 600 | Nombre paciente en cabecera |
| `headlineMedium` | 16px | 600 | Título sección (Evolución, Prescripciones) |
| `titleLarge` / `titleMedium` | 16px / 14px | 600 / 500 | Subtítulos tarjetas, columnas tabla |
| `bodyLarge` / `bodyMedium` | 14px | 400 | Notas, plan, instrucciones |
| `labelLarge` / `labelMedium` | 14px / 13px | 500 | Labels formulario, chips estado |

### 2.3 Jerarquía datos críticos vs secundarios

| Nivel | Rol tipográfico | Ejemplo | Tratamiento |
|-------|-----------------|---------|-------------|
| **P0 — Identidad** | `headlineLarge` + `onSurface` | Carmen Soto · DEMO-001 | Una línea; badge DEMO aparte |
| **P1 — Clínico activo** | `titleMedium` + semántica | Diagnóstico principal, alergia | Color rol clínico + icono |
| **P2 — Contenido** | `bodyLarge` | Nota evolución, dosis | 65ch max en bloques largos |
| **P3 — Meta** | `bodyMedium` + `onSurfaceVariant` | Fecha registro, autor, versión | Nunca compite con P0 |

**Alto contraste (THEME-05):** `body1`/`body2` peso 500 — activable en preferencias.

---

## 3. Mejores prácticas UI/UX clínica

### 3.1 Carga cognitiva y espacio

- **Regla 60-30-10:** 60% surface neutro · 30% containers/bordes · 10% primary (botón Continuar, chip activo).
- **Densidad:** `comfortable` (spacing 8) default · `compact` (7) solo tablas MAR/censo con gate de contraste.
- **Islas clínicas:** `epis2PageIslandSx` — max-width + padding generoso; nunca llenar 100% con campos.
- **Progressive disclosure:** historial paciente bajo demanda (two-pane); IA colapsada por defecto en ficha.
- **Una acción primaria por viewport** (M3-G13): un solo `EpisButton` filled dominante.

### 3.2 Accesibilidad WCAG

| Combinación | Ratio objetivo | Gate |
|-------------|----------------|------|
| `onSurface` sobre `surface` | ≥ 7:1 (AAA) | `theme:validate` |
| `onPrimary` sobre `primary` | ≥ 4.5:1 (AA) | MTB export |
| `clinical.critical.onMain` sobre `critical.main` | ≥ 4.5:1 | `clinical-roles.contrast` |
| Texto cuerpo mínimo | 14px / 13px meta | `typography-rules.test` |

Estados críticos: **icono + texto + color** — nunca solo color (M3-G03).

### 3.3 Elevación tonal (THEME-06)

| Nivel | Uso EPIS2 | Implementación |
|-------|-----------|----------------|
| 0 | Canvas Comando, fondo ficha | `surface` / `background.default` |
| 1 | Tarjetas borrador, panel paciente | `surfaceContainer` + borde `outlineVariant` |
| 2 | Modal aprobación, menú comando | `surfaceContainerHigh` |
| 3 | Overlay / scrim | `scrim` 32–40% — sin sombras decorativas |

**Prohibido:** `boxShadow` pesado en BrandMark, grids clínicos, charts (anti-patrón §1).

---

## 4. Componentes clave — especificaciones

### 4.1 Banner / cabecera del paciente

| Elemento | Token / rol | Directriz |
|----------|-------------|-----------|
| Fondo | `surfaceContainerHigh` | Full-width; no primary.main |
| Nombre | `headlineLarge` + `onSurface` | Truncar con tooltip si > 40 caracteres |
| ID / RUT demo | `labelMedium` + `onSurfaceVariant` | Chip DEMO/SINTÉTICO obligatorio |
| Alertas críticas | `clinical.critical.container` | Máx. 2 visibles; resto en panel expandible |
| Alertas warning | `clinical.warning.container` | Advisory CDS — no bloquean flujo |
| Acciones | `EpisButton` text/ outlined | Ficha, preferencias — no compiten con Comando |

**Layout:** fila 1 identidad · fila 2 alertas (si hay) · sin más de 72px altura fija sin expandir.

### 4.2 Tabla prescripciones / medicamentos

| Columna | Tipografía | Color |
|---------|------------|-------|
| Medicamento | `titleMedium` | `onSurface` |
| Dosis / vía | `bodyMedium` | `onSurface` |
| Frecuencia | `bodyMedium` | `onSurfaceVariant` |
| Estado (activo/suspendido) | `labelLarge` chip | `approved` / `warning` |
| Interacción CDS | icono + `labelMedium` | `clinical.warning` — fila no bloqueada |

- **Densidad:** fila 48px comfortable · 40px compact.
- **Acción rápida:** un botón icon `outlined` por fila (administrar / validar); acción masiva prohibida.
- **Empty:** mensaje + CTA comando «reconcilia medicamentos» — no tabla vacía muda.

### 4.3 Línea de tiempo de evolución

| Elemento | Tratamiento |
|----------|-------------|
| Eje temporal | `outlineVariant` vertical 2px — sin decoración |
| Nodo evento | círculo 8px `primary` aprobado · `clinical.draft` borrador |
| Fecha/hora | `labelMedium` + `onSurfaceVariant` — alineado izquierda eje |
| Título evento | `titleMedium` — tipo nota (evolución, epicrisis) |
| Extracto | `bodyMedium` 2 líneas max + «ver más» |
| Estado | chip `EpisDraftStatus` — roles clínicos fijos |

**Scroll:** virtualizado si > 50 eventos; agrupación por día con `headlineMedium` sticky.

---

## 5. Selección de perfil en producto

```text
/preferencias-apariencia → 6 chips MTB → aplicación instantánea (localStorage)
```

| accent (código) | themeId |
|-----------------|---------|
| `clinicalBlue` | `clinical-blue` |
| `tealBlue` | `calm-teal` |
| `slateProfessional` | `slate-professional` |
| `sageClinical` | `sage-clinical` |
| `oceanDepth` | `ocean-depth` |
| `warmLinen` | `warm-linen` |

Regenerar TS tras editar JSON: `npm run theme:generate` · validar: `npm run theme:validate`.

---

## 6. Referencias

- `EPIS2_MATERIAL3_CLINICAL_EXPERIENCE.md` — Standard vs Expressive
- `EPIS2_TYPOGRAPHY_AND_AESTHETICS_RULES.md` — 20 reglas
- `EPIS2_M3_SYMMETRY_AND_FRAMING.md` — cuadrícula 8dp, formularios, botones, encuadre
- `EPIS2_MATERIAL_DESIGN_ANTI_PATTERNS.md` — 20 prohibidos
- `M3_ANTI_DRIFT_GATES.md` — M3-G01…G15
- `M3_VISUAL_SIGNOFF_STEPS.md` — pasos V1–V6

**Frase guía:** *Material 3 humaniza; EPIS2 no negocia precisión clínica por decoración.*
