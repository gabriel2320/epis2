# EPIS2 — Pasos visuales de signoff (Material Design 3)

**Uso:** MF-178, PILOT_DEMO_CHECKLIST pasos 10–13, revisión humana post-automatización.  
**Canon M3:** este documento **no redefine** tokens; aplica las normas ya documentadas.

---

## Documentos normativos (obligatorios)

| Documento | Aplica a |
|-----------|----------|
| [`EPIS2_MATERIAL3_CLINICAL_EXPERIENCE.md`](../design/EPIS2_MATERIAL3_CLINICAL_EXPERIENCE.md) | Standard vs Expressive, roles M3, layout adaptativo |
| [`EPIS2_TYPOGRAPHY_AND_AESTHETICS_RULES.md`](../design/EPIS2_TYPOGRAPHY_AND_AESTHETICS_RULES.md) | 20 reglas tipográficas y composición |
| [`EPIS2_MATERIAL_DESIGN_ANTI_PATTERNS.md`](../design/EPIS2_MATERIAL_DESIGN_ANTI_PATTERNS.md) | 20 prácticas prohibidas |
| [`EPIS2_THEME_QA_CHECKLIST.md`](../design/EPIS2_THEME_QA_CHECKLIST.md) | THEME-05…07, manual 15 min |
| [`M3_ANTI_DRIFT_GATES.md`](M3_ANTI_DRIFT_GATES.md) | M3-G01…G15 |
| [`EPIS2_CLINICAL_TWO_PANE_LAYOUT.md`](../design/EPIS2_CLINICAL_TWO_PANE_LAYOUT.md) | Two-pane evolución/epicrisis |

**Gates automáticos previos al recorrido visual:**

```bash
npm run quality:m3-signoff
```

---

## Paso V1 — Preferencias y paletas MTB (THEME-07)

**Ruta:** `/preferencias-apariencia`  
**Norma:** M3-G02, M3-G14, anti-patrón §9 (switch instantáneo), regla 60-30-10.

| Verificar | Criterio M3 |
|-----------|-------------|
| Clinical Blue | Acento ~10%; canvas `surface` / `surfaceContainer` dominan |
| Calm Teal | Mismo tratamiento; roles clínicos **sin cambio** |
| Cambio instantáneo | Sin botón «Guardar»; tokens aplican al togglear |
| Roles clínicos | `draft`, `approved`, `critical`, `warning` legibles e inmutables en chips de estado |

**Falla si:** primario al 100% como fondo de página; personalización altera semántica clínica.

---

## Paso V2 — Modo oscuro y «Seguir sistema» (THEME-05)

**Rutas:** `/comando`, `/espacio/evolucion` (paciente demo activo)  
**Norma:** MTB dark (`#111318`, `#1A1C20`), `onSurface`, anti-patrón §2 (duplas rotas), M3-G08.

| Verificar | Criterio M3 |
|-----------|-------------|
| Comando | Display/Headline legibles; Power Bar con contraste AA |
| Formulario evolución | **M3 Standard** — campos Outlined únicamente; body/label legibles |
| Seguir sistema | Respeta OS light/dark sin romper roles clínicos |
| Estados críticos | Icono + texto + color (no solo color) en alertas y borrador |

**Falla si:** texto `text.primary` sobre `primary.main`; pure black `#000`; sombras pesadas en grid.

---

## Paso V3 — Alto contraste (THEME-05)

**Rutas:** mismas que V2 tras activar alto contraste en preferencias  
**Norma:** tipografía reforzada; M3-G02; checklist tipografía §contraste AA.

| Verificar | Criterio M3 |
|-----------|-------------|
| Cuerpo clínico | Peso/contraste reforzado; prosa ≤ 65ch en bloques largos |
| Roles clínicos | draft / aprobado / crítico / advertencia **intactos** |
| Una acción primaria | M3-G13 — un solo filled dominante por viewport |
| Sin decoración semántica | M3-G03 — error/success no usados como adorno |

---

## Paso V4 — Catálogo visual dev (THEME-07)

**Ruta:** `/desarrollo/catalogo-visual` (solo dev / flag explícito)  
**Norma:** THEME-06 elevación tonal; anti-patrón §1 (sombras); M3-G12.

| Verificar | Criterio M3 |
|-----------|-------------|
| Paleta MTB | Roles M3 mapeados (`primaryContainer`, `surfaceContainer*`) |
| Roles clínicos | Panel dedicado; no mezclados con acento de marca |
| Elevación | Tonal, no `boxShadow` decorativo en BrandMark/charts/grids |
| Enlace producción | **No** enlazado desde shell clínico (gate dev-catalog) |

---

## Paso V5 — Recorrido clínico M3 Standard (15 min manual)

**Norma:** [`EPIS2_THEME_QA_CHECKLIST.md`](../design/EPIS2_THEME_QA_CHECKLIST.md) §Manual + M3-G04/G06/G10.

| Pantalla | Tratamiento M3 | Verificar |
|----------|----------------|-----------|
| Login | Expressive controlado | Una acción filled; sin dashboard embebido |
| Centro de Comando | Search + Display | Power Bar dominante; tablero secundario |
| Evolución | Standard + two-pane | Historial bajo demanda; IA discreta |
| Aprobación borrador | Standard | Sin motion expressive; confirmación humana visible |

**Falla si:** información no solicitada en canvas; animación expressive en error/aprobación; FAB visible; copy «Ollama» en UI clínica.

---

## Paso V6 — Offline y estados (MF-178)

**Norma:** widgets `offline`; banner global; M3-G10.

| Verificar | Criterio M3 |
|-----------|-------------|
| Banner offline | Visible en shell; no oculta safety bar |
| Widgets | Estado `offline` sin crash; vacío/carga/error definidos |
| Reduced motion | OS `prefers-reduced-motion: reduce` — transiciones mínimas |

---

## Registro de signoff visual

| Campo | Valor |
|-------|--------|
| Revisor | |
| Fecha | |
| Entorno | local staging / demo |
| V1–V6 | [ ] PASS / [ ] FAIL (anotar paso) |
| Resultado | GO DEMO / PASS WITH FIXES / BLOCKED |
| Evidencia | capturas opcionales en `reports/` |

---

## Frase guía

> Material 3 humaniza; EPIS2 no negocia precisión clínica por decoración.  
> — `M3_ANTI_DRIFT_GATES.md`
