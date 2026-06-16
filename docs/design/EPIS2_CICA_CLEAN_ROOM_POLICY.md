# EPIS2 — CICA Clean Room Policy

> **EPIS2 CICA UI no hereda pantallas. Hereda intención clínica.**

## Principio

El legacy puede donar **datos, contratos, endpoints, fixtures, tests y lógica funcional**.

El legacy **no** puede donar **layout, navegación, sidebar, dashboard, composición visual, botones ni estructura de pantalla**.

## Raíz visual CICA

Rutas bajo `/app/*` — sala blanca. Rutas `/espacio/*` permanecen como legacy temporal hasta migración completa.

```
VITE_ENABLE_CICA_UI=true  → UI CICA (default objetivo demo)
VITE_ENABLE_CICA_UI=false → fallback legacy /espacio/*
```

## Permitido importar en `/app`

| Capa | Ejemplos |
|------|----------|
| Datos | `@epis2/contracts`, hooks React Query, API clients |
| Copy | `@epis2/design-system` |
| CICA UI | `@epis2/epis2-ui` → `cica/*`, `layout/clinical/*` |
| Dominio | `@epis2/clinical-domain`, `@epis2/command-registry` |

## Prohibido en `/app`

| Legacy visual | Motivo |
|---------------|--------|
| `EpisAppScaffold` | Sidebar + command dock administrativo |
| `ClinicalShellLayout` | Shell legacy contaminado |
| `EpisDashboardShell` / Modo tablero | No ficha médica |
| `EpisModeSwitcher` | Centro/Ficha/Dashboard |
| `epis2NavigationRail` | Labels multilínea, workspaces |
| `ChartEspacioCommandDock` | Barra NL duplicada en censo |
| `PatientListGrid` | Grid administrativo |
| Banner deprecado classic/dashboard | Contradicción producto |

## Componentes canónicos obligatorios

Toda pantalla `/app` debe componerse con:

```text
CicaAppShell
  ├── CicaTopBar
  ├── CicaClinicalNav
  └── ClinicalScreen (profile CICA)
        ├── CicaPatientIdentityBand (ficha)
        ├── CicaContextStrip (ficha)
        ├── CicaChartTabs (ficha)
        ├── ClinicalSection
        ├── ClinicalFieldGrid
        └── ClinicalActionBar
```

Registro: `packages/epis2-ui/src/cica/EPIS_CICA_SCREEN_REGISTRY.ts`

## Reglas CICA por pantalla

1. Una intención clínica única
2. Una acción primaria visible
3. Máximo dos acciones secundarias visibles
4. Resto en menú «Más»
5. Retorno claro (breadcrumb o nav)
6. DEMO visible y discreto
7. Paciente visible en pantallas de ficha
8. Borrador/aprobado cuando aplique
9. IA activa/degradada no dominante
10. Sin scroll horizontal
11. Sin cards anidadas profundas (>2 niveles)
12. Grilla 8 px

## Modificar una pantalla CICA

```text
1. EPIS_CICA_SCREEN_REGISTRY.ts   → intent, profile, ruta
2. CICA_CHART_TAB_REGISTRY.ts     → tabs ficha (si aplica)
3. apps/web/src/cica/*Page.tsx    → solo contenido clínico (children)
4. useCicaPatientPage + frames    → datos y shell reutilizados
```

| Quiero… | Archivo |
|---------|---------|
| Nueva ruta `/app` | registry + router + `buildCicaPath(screenId)` |
| Nuevo tab ficha | `CICA_CHART_TAB_REGISTRY` |
| Cambiar nav global | `buildDefaultCicaNavItems` en `CicaClinicalNav.tsx` |
| Cambiar identidad/contexto | `cicaPatientPresentation.ts` |
| Nueva sección ficha | `<CicaPatientSectionPage screenId="…" />` |

Hooks web: `useCicaPatientPage`, `useCicaNavigate`. Frames package: `CicaScreenFrame`, `CicaPatientScreenFrame`.

## Tema y responsive

Raíz visual CICA respeta grilla **8px** y breakpoints MUI (`cicaResponsive.ts`). Toda pantalla `/app` hereda tema EPIS2 (modo claro/oscuro + acento MTB) sin shell legacy.

| Pieza | Ubicación | Rol |
|-------|-----------|-----|
| `CicaThemeControls` | `CicaTopBar` | Toggle modo, 4 acentos rápidos, enlace `/preferencias-apariencia` |
| `useCicaThemeTokens` | consumo en páginas | Layout estático + colores semánticos MUI + `isDark` |
| `CicaScreenTransition` | `CicaAppLayout` | Fade+slide al cambiar ruta; off con `motion: reduced` |
| `CicaResponsiveGrid` | package | 1 / 2 / 12 columnas por breakpoint |
| `CicaFormGrid` | package | Formularios: campos 2 col tablet; prosa 1 col |
| `CicaSummaryGrid` | `apps/web/src/cica` | Resumen clásico: 2 col máx en `md+` |

Manual QA mínimo: viewport **375px** sin scroll horizontal; modo oscuro vía top bar; modo papel standalone e impresión.

## Gates

| Gate | Alcance |
|------|---------|
| `quality:cica-no-legacy-shell-gate` | `/app` sin imports shell legacy |
| `quality:cica-no-dashboard-mode-gate` | `/app` sin dashboard/tablero |
| `quality:cica-screen-registry-gate` | Registry + rutas alineadas |
| `quality:cica-action-density-gate` | Densidad acciones en páginas CICA |
| `quality:cica-paper-standalone-gate` | Papel en ruta exclusiva `/app/.../papel/` |
| `quality:cica-responsive-gate` | Grilla 8px, shell 100dvh, grids exportados |
| `quality:cica-theme-gate` | Controles tema, tokens, transición de pantalla |
| `quality:cica-clean-room-close-gate` | Compuesto cierre PR foundation (+ responsive-gate) |

## Migración

```text
PR1  Foundation + /app/buscar
PR2  (incluido PR1) Buscar paciente
PR3  /app/pacientes/:id/resumen
PR4  Evoluciones + nueva evolución
PR5  Modo papel standalone
PR6  Redirect legacy crítico → /app
```

Canon relacionado: `docs/design/EPIS2_CICA.md` · `docs/design/EPIS2_CLINICAL_LAYOUT_MANIFESTO.md`
