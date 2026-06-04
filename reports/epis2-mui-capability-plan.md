# EPIS2 — Informe EPIS2-MUI-00 (Capability plan)

**Fecha:** 2026-06-04  
**Fase:** EPIS2-MUI-00 — Capability Map and Internal UI Architecture  
**Estado:** ✅ Completa (documentación únicamente)

---

## Resumen ejecutivo

EPIS2 adoptará Material UI y MUI X como **plataforma de capacidades gobernada**, no como catálogo visible. Esta fase define mapa, arquitectura `packages/epis2-ui`, tema único, plan progresivo MUI-01–MUI-11, gates anti-deriva y registro de licencias.

**No se instaló ninguna dependencia nueva.** **No se creó UI productiva.** **No se avanzó a MUI-01.**

---

## Entregables

| Artefacto | Ruta |
|-----------|------|
| Mapa de capacidades | `docs/design/MUI_CAPABILITY_MAP.md` |
| Arquitectura UI | `docs/design/EPIS2_UI_ARCHITECTURE.md` |
| Especificación de tema | `docs/design/EPIS2_THEME_SPEC.md` |
| Plan adopción MUI X | `docs/design/MUI_X_ADOPTION_PLAN.md` |
| Log de licencias | `docs/design/MUI_LICENSING_DECISION_LOG.md` |
| Gates MUI | `docs/quality/MUI_ANTI_DRIFT_GATES.md` |
| Este informe | `reports/epis2-mui-capability-plan.md` |

---

## Componentes evaluados (conteo)

| Clasificación | Aprox. |
|---------------|--------|
| `USE_V0` / ya en código | 25+ componentes Core |
| `USE_NOW` | 5 (Autocomplete, Emotion styled, consolidación tema) |
| `USE_LATER` | 40+ (incluye familias MUI X) |
| `EVALUATE` | 8 (Scheduler, Timeline lab, Pro grid, etc.) |
| `REJECT` | 6 (Carbon, segundo tema, SpeedDial, etc.) |

---

## Componentes seleccionados para adopción

### Inmediato (MUI-01–03)

- `@mui/material`, `@emotion/react`, `@emotion/styled`, `@mui/icons-material`
- Primitivos: Button, TextField, Dialog, Alert, Chip, Paper, Stack, Tabs
- Wrappers command: `EpisCommandBar`, `EpisCommandSuggestions`

### Por fase clínica (MUI-05–09)

| Paquete | Trigger clínico |
|---------|-----------------|
| `@mui/x-data-grid` | Worklist, pacientes, lab, auditoría |
| `@mui/x-date-pickers` + `dayjs` | Fechas encuentro y órdenes |
| `@mui/x-charts` | Tendencias lab y KPI servicio |
| `@mui/x-tree-view` | Árbol documental |

### Evaluación posterior

| Paquete | Condición |
|---------|-----------|
| `@mui/x-scheduler` | Modelo citas + LIC-007 APPROVED |

---

## Componentes rechazados

- Carbon / OpenMRS / Soft Carbon (validador existente).
- Dashboard como home.
- Menú hospitalario primario.
- `SpeedDial`, `BottomNavigation` como navegación principal.
- MUI X Pro/Premium sin registro en log de licencias.
- Instalación indiscriminada de iconos.

---

## Paquetes requeridos por fase

| Fase | npm (nuevos respecto a hoy) |
|------|------------------------------|
| MUI-01 | Reorganizar Core (ya instalado en web) |
| MUI-05 | `@mui/x-data-grid` |
| MUI-06 | `@mui/x-date-pickers`, `dayjs` |
| MUI-07 | `@mui/x-charts` |
| MUI-08 | `@mui/x-tree-view` |
| MUI-10 | `@mui/x-scheduler` (si EVALUATE → APPROVED) |

---

## Riesgos

### Bundle

| Riesgo | Mitigación |
|--------|------------|
| Data Grid + Charts en chunk inicial | Lazy por ruta tablero / ficha |
| Iconos masivos | Import por icono |
| Barrels `@mui/material` | ESLint restricted imports (MUI-11) |
| Duplicar Emotion | Una versión en monorepo workspaces |

### Licencia

| Riesgo | Mitigación |
|--------|------------|
| Uso accidental Pro | Log LIC-* + grep CI |
| Scheduler tier desconocido | Spike aislado MUI-10 |

### Organización

| Riesgo | Mitigación |
|--------|------------|
| Imports directos MUI en 20+ archivos web | Migración incremental MUI-01–03 |
| Dos fuentes de tema (design-system vs epis2-ui) | Mover tema en MUI-01; design-system = copy only |

---

## Línea base repositorio (MUI-00)

- `apps/web`: MUI 6.4 + icons; imports directos en componentes/páginas.
- `packages/design-system`: `epis2Theme` sin locale `esES` aún.
- MUI X: **no instalado**.
- `packages/epis2-ui`: **no creado** (definido en arquitectura).

---

## Próximos pasos (MUI-01)

1. Crear workspace `packages/epis2-ui` con tema según `EPIS2_THEME_SPEC.md`.
2. Exportar `Epis2ThemeProvider` y primitivos mínimos.
3. Migrar `LoginPage` y `CommandCenterPage` como piloto.
4. Añadir validador `no-direct-mui-imports.mjs`.
5. Actualizar `docs/QUALITY_GATES.md` con referencia a `MUI_ANTI_DRIFT_GATES.md`.

---

## Criterios de aceptación MUI-00

| # | Criterio | Cumple |
|---|----------|--------|
| 1 | Mapa completo de capacidades MUI | ✅ |
| 2 | Cada capacidad asociada a caso EPIS2 | ✅ |
| 3 | Arquitectura `packages/epis2-ui` | ✅ |
| 4 | Tema único definido | ✅ |
| 5 | Plan adopción progresiva | ✅ |
| 6 | Gates anti-deriva | ✅ |
| 7 | Sin instalación de dependencias | ✅ |
| 8 | Sin UI productiva nueva | ✅ |
| 9 | Arquitectura EPIS2 sin cambios de código | ✅ |
| 10 | Documentación en español | ✅ |
| 11 | No avance a MUI-01 en esta fase | ✅ |

---

## Frase guía

EPIS2 utiliza todo el poder de MUI, pero solo muestra lo que el trabajo clínico necesita.

---

## Referencias cruzadas

- Producto: `docs/product/PRODUCT_INVARIANTS.md` (#4, #6–7, #14)
- Calidad: `docs/quality/ANTI_DRIFT_GATES.md`
- Roadmap producto: `docs/product/EPIS2_RELEASE_ROADMAP.md` (añadir hito MUI al planificar release)
