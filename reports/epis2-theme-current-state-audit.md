# EPIS2 — Auditoría del sistema de temas (pre THEME-01)

**Fecha:** 2026-06-05  
**Fase:** EPIS2-THEME-01 — Material Theme Builder Integration  
**Alcance:** Auditoría sin refactor masivo de UI.

---

## 1. Resumen ejecutivo

| Veredicto | Detalle |
|-----------|---------|
| Tema canónico | **Uno** — `createEpis2Theme()` en `packages/epis2-ui/src/theme/create-epis2-theme.ts` |
| ThemeProvider | **Uno** — `Epis2ThemeProvider` en `apps/web/src/main.tsx` |
| Duplicidades | **Ninguna** crítica — gate `single-epis2-theme` verde |
| Modo oscuro | **Activo** — toggle + localStorage |
| MTB integrado | **No** (pre THEME-01) — acentos manuales en `color-roles.ts` |

**Estrategia:** pipeline MTB → `generated/` sin segundo generador; convergencia gradual en THEME-02+.

---

## 2. Tema canónico actual

| Pieza | Ubicación |
|-------|-----------|
| Generador | `create-epis2-theme.ts` |
| Acentos | `color-roles.ts` (5 presets: clinicalBlue, tealBlue, calmGreen, soberViolet, neutral) |
| Roles clínicos | `clinical-roles.ts` |
| Overrides MUI | `components.ts` |
| Identidad visual | `visual-identity.ts`, `island-layout.ts` |
| Preferencias | `EpisThemePreferences.tsx` — mode, accent, density, motion |
| Toggle | `EpisThemeModeToggle.tsx` |

**CSS variables:** `cssVariables: true` en MUI; sin consumo directo `var(--epis2-*)` en app aún.

---

## 3. Variantes actuales (no MTB)

| Dimensión | Valores |
|-----------|---------|
| mode | light, dark |
| accent | 5 presets manuales |
| density | comfortable, compact |
| motion | standard, reduced |
| contrast | high (API sin UI) |

**Desalineación con THEME-01:** Clinical Blue canónico `#1E6FD6` vs preset `#1873DC`; Calm Teal `#006A6A` vs `tealBlue` `#0D7377`.

---

## 4. Duplicidades y riesgos

| ID | Riesgo | Severidad |
|----|--------|-----------|
| R1 | `EPIS2_THEME_SPEC.md` obsoleto vs código | Alta |
| R2 | Roles clínicos sin variantes dark dedicadas | Media |
| R3 | `EpisBrandMark` bgcolor hardcodeado | Media → corregido THEME-01 |
| R4 | `contrast: high` sin preferencia UI | Media |
| R5 | `accent` no aplica tint a superficies | Baja |
| R6 | Solo 2/5 roles con test WCAG | Media |
| R7 | Microcopy técnico (pgvector) | Baja → corregido THEME-01 |

---

## 5. Colores hardcodeados

| Zona | Estado |
|------|--------|
| `color-roles.ts`, `clinical-roles.ts`, `visual-identity.ts` | Permitido (capa tema) |
| `apps/web` | Sin hex en producción |
| `EpisBrandMark` | Corregido → `background.paper` |
| Gate `validate-no-hardcoded-colors` | THEME-01 |

---

## 6. Componentes fuera del tema

| Componente | Nota |
|------------|------|
| `chip-tones.ts` | Fallbacks hex si falta `theme.epis2` |
| Dev `UiCatalogPage` | Swatches desde `useTheme()` — OK |

---

## 7. Catálogo visual

| Ruta | Estado |
|------|--------|
| `/dev/ui-catalog` | Existe (gated) |
| `/desarrollo/catalogo-visual` | Existe (gated, MUI-G15) |

---

## 8. Estrategia de migración

1. **THEME-01 (esta sesión):** pipeline MTB + source/generated + gates — **sin** reemplazar `color-roles.ts` en runtime.
2. **THEME-02:** Clinical Blue como default desde `generated/clinical-blue.ts`.
3. **THEME-03:** Calm Teal + selector preferencias.
4. **THEME-04–05:** Dark validado + alto contraste UI.
5. **THEME-06–09:** Overrides ampliados, catálogo visual, QA.

**No crear segundo ThemeProvider.** **No cambiar home ni tablero.**

---

## Referencias

- Generador: `packages/epis2-ui/src/theme/create-epis2-theme.ts`
- Gate: `scripts/architecture/single-epis2-theme.mjs`
