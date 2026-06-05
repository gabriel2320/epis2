# EPIS2 — Plan de adopción Material 3 Clinical

**Estado:** M3-00…M3-09 **completado** (signoff 2026-06-05) · **Siguiente frontera producto:** piloto humano (`PILOT-HUMAN`)

---

## Secuencia

```text
MUI-01…10  Capacidades React + MUI X + wrappers clínicos     ← completado
M3-00      Auditoría y baseline visual                        ← completado
M3-01      Tokens y roles M3                                  ← completado
M3-02      Generador createEpis2Theme + CSS variables         ← completado
M3-03      Primitivos M3 (filled / tonal / chips / feedback)    ← completado
M3-04      Login y Centro de Comando (Expressive controlado)    ← completado
M3-05      Workspaces clínicos (Standard documento)           ← completado
M3-06      Layout adaptativo                                  ← completado
M3-07      Modo tablero adaptativo                            ← completado
M3-08      Personalización controlada                         ← completado
M3-09      QA humano, accesibilidad y CI anti-deriva M3       ← completado
```

Post-M3: lazy barrels MUI X, modo oscuro piloto, `qa:bundle-analyze` — ver `reports/epis2-m3-09-qa-signoff.md`.

**Siguiente frontera layout clínico:**

```text
LAYOUT-01  Two-pane Enfoque ↔ Contexto (evolución, epicrisis)   ← completado
LAYOUT-02  Panel consulta + inserción chip                      ← completado
LAYOUT-03  IA invisible + resumen periodo bajo demanda          ← completado
LAYOUT-04  Drag & drop + blueprints adicionales
```

---

## M3-00 — Auditoría y baseline

**Entregables:**

- Capturas o inventario de pantallas actuales (Login, Comando, formularios, tablero, catálogo).
- Informe de ruido visual: elementos que compiten con acción primaria.
- Detección de estilos múltiples (inline, borderRadius distintos, colores fuera de palette).
- Componentes sin patrón M3 (lista en catálogo vs. uso real).
- Métrica cualitativa: comprensión del Centro de Comando en ≤3 s (protocolo M3-09).

**Artefacto:** `reports/epis2-m3-00-baseline-audit.md`

**Gates:** revisión manual; no cambios de tema en producto aún.

---

## M3-01 — Tokens y roles

**Depende de:** M3-00

**Entregables en `packages/epis2-ui/src/theme/`:**

- `color-roles.ts` — mapeo roles M3 → MUI palette + CSS vars
- `clinical-roles.ts` — draft, ai, approved, warning, critical (inmutables)
- `shape.ts` — escala extraSmall…full
- `motion.ts` — duration + easing + `prefers-reduced-motion`
- `typography.ts` — roles display/headline/title/body/label (alias de variantes MUI)
- Actualizar `EPIS2_THEME_SPEC.md` con tabla de roles

**Caso clínico:** ninguno; refactor visual sin cambio de flujo.

**Tests:** contraste mínimo WCAG AA en roles críticos (script o checklist).

---

## M3-02 — Tema EPIS2 (`createEpis2Theme`)

**Depende de:** M3-01

**Entregables:**

- `create-epis2-theme.ts` — único generador (reemplaza `createTheme` directo en `theme.ts`)
- Opciones: `mode`, `accent`, `density`, `contrast`, `motion`
- CSS variables para acento dinámico sin tocar roles clínicos
- Modo oscuro activo (piloto); roles clínicos inmutables en ambos modos
- `Epis2ThemeProvider` acepta preferencias de usuario (stub M3-08)

**Gate M3-G01:** un solo generador de tema en monorepo.

---

## M3-03 — Primitivos M3

**Depende de:** M3-02

**Entregables:**

- `EpisButton` — variants filled / tonal / text / outlined alineados M3
- Chips — assist, filter, input, choice
- `EpisSnackbar`, estados loading/empty/error unificados
- App bars mínimas (`EpisTopAppBar` o evolución shells existentes)
- Sección M3 en `/dev/ui-catalog`

**Caso clínico:** catálogo + sustitución gradual en primitivos existentes.

---

## M3-04 — Login y Centro de Comando

**Depende de:** M3-03 · **Re-skin de:** MUI-03

**Entregables:**

- Login: superficie expresiva, Display, transición al comando
- Comando: Search/Power Bar como núcleo, top bar mínima, sugerencias assist chips
- Movimiento expressive solo en foco Power Bar y aparición de sugerencias
- Una acción primaria visible por viewport

**Tests:** golden journey comando; prueba 3 segundos (M3-09 protocol).

---

## M3-05 — Workspaces clínicos

**Depende de:** M3-03 · **Re-skin de:** MUI-04

**Entregables:**

- Canvas tipo documento (shape extraLarge, tipografía body-first)
- Formularios M3 Standard — sin animación decorative en error/aprobación
- IA contextual + borrador + safety bar con estados multi-indicador
- Paneles fuentes/historial colapsados por defecto

---

## M3-06 — Diseño adaptativo

**Depende de:** M3-04, M3-05

**Entregables:**

- Breakpoints EPIS2 documentados en `breakpoints.ts`
- Layouts compacto / medio / expandido para Comando y ficha clínica
- Panel secundario bajo demanda (una fuente de verdad a la vez)
- Validador manual: cada ruta principal probada 360px / 768px / 1280px

**Gate M3-G07:** ruta sin layout adaptativo documentado → falla revisión.

---

## M3-07 — Modo tablero adaptativo

**Depende de:** M3-06 · **Re-skin de:** MUI-09

**Entregables:**

- `EpisDashboardShell` con tokens M3 surface/container
- Widgets solo contextuales; filter chips para filtros
- Retorno al comando siempre visible
- Sin competir visualmente con home = comando

---

## M3-08 — Personalización controlada

**Depende de:** M3-02

**Entregables:**

- Preferencias: tema claro/oscuro/sistema, acento, densidad, texto, contraste, movimiento
- Persistencia local (sin alterar semántica clínica)
- UI de ajustes en área no clínica o perfil
- Tests: acento no modifica `clinical-roles`

---

## M3-09 — QA humano, accesibilidad y CI

**Depende de:** M3-04…M3-08 · **Absorbe:** MUI-11

**Entregables:**

- Protocolo prueba 3 segundos (Comando)
- Checklist teclado + lector de pantalla en flujos críticos
- Contraste y jornada prolongada (formularios)
- ESLint `no-restricted-imports` `@mui/*` fuera de epis2-ui (si no activo)
- Bundle analyze + presupuesto por chunk (grid, charts, scheduler subpath)
- Validador `no-mui-premium-without-license` (desde LIC log)
- Gates M3 en `architecture:validate` (roadmap incremental)

**Artefacto:** `reports/epis2-m3-09-qa-signoff.md`

---

## Matriz dependencia → fase

| Necesidad | Fase M3 | Bloqueante |
|-----------|---------|------------|
| Roles color M3 | M3-01 | M3-00 |
| Acento dinámico | M3-02 | Roles clínicos definidos |
| Expressive Comando | M3-04 | Primitivos M3 |
| Documento clínico | M3-05 | Primitivos M3 |
| Panel contextual | M3-06 | Shells clínicos |
| Tablero secundario | M3-07 | Adaptación |
| Bundle / CI | M3-09 | Tema estable |

---

## Convivencia con MUI X

MUI X (Data Grid, Charts, Date Pickers, Tree, Scheduler spike) **permanece** bajo reglas de `MUI_X_ADOPTION_PLAN.md` y `MUI_LICENSING_DECISION_LOG.md`. M3 gobierna **apariencia y comportamiento expresivo**; MUI X gobierna **capacidades de datos**.

---

## Referencias

- `docs/design/EPIS2_MATERIAL3_CLINICAL_EXPERIENCE.md`
- `docs/quality/M3_ANTI_DRIFT_GATES.md`
- `docs/quality/MUI_ANTI_DRIFT_GATES.md`
- `reports/epis2-m3-plan-rebaseline.md`
