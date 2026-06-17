# EPIS2 — Auditoría UX visual (2026-06-10)

**Estado:** **NO-GO** signoff estético / usabilidad  
**Origen:** Revisión humana post `quality:m3-visual-pass` automatizado  
**Alcance:** Tramo UX-AESTHETIC P1 — correcciones mínimas en sesión

---

## Hallazgos del revisor (producto)

| # | Problema | Severidad | Acción en sesión |
|---|----------|-----------|------------------|
| 1 | Diseño estético deficiente (densidad, jerarquía) | Alta | Ritmo formularios 32→24dp; top bars simplificadas |
| 2 | Faltan iconos (modos, dashboard rail) | Media | Iconos en `EpisModeSwitcher` y rail dashboard |
| 3 | Instrucciones duplicadas (Comando, preferencias) | Media | Quitar marca EPIS2 duplicada; título preferencias único |
| 4 | Pantallas > viewport sin scroll | Alta | `epis2CanvasSx` + flex scroll en shells clásico/dashboard |
| 5 | Botones encimados en barra superior | Alta | `flexWrap` en `EpisTopAppBar`; nav icono-only en xs |
| 6 | Campos excesivamente separados | Media | `sectionGap` 24dp |
| 7 | Dashboard / clásico desordenados | Alta | Metadata clínica solo en status bar; menos botones en xs |
| 8 | Configuración difícil de encontrar | Alta | Icono ⚙ en barra global + modos clásico/dashboard |

---

## Cambios aplicados (código)

- `ClinicalAppBarSettingsAction` → `/preferencias-apariencia` visible en barra global y modos MD3
- `EpisTopAppBar` + `ClinicalGlobalTopBar` → wrap responsive, labels ocultos en pantallas estrechas
- `EpisModeSwitcher` → Terminal / Assignment / Dashboard con iconos
- `EpisDashboardMd3NavigationRail` → icono por destino
- `EpisClassicMd3Shell` / `EpisDashboardMd3Shell` → contenedores flex para scroll interno
- `epis2CanvasSx` → `overflowY: auto`
- `epis2M3FormLayout.sectionGap` → 24dp
- `EpisCommandCenterGoogleBar` → sin marca EPIS2 redundante (hero ya tiene título)
- `AppearancePreferencesPage` → sin headline duplicado
- Top bars clásico/dashboard → paciente/servicio en barra; usuario/rol en status bar

---

## Gates pendientes post-fix

```bash
npm run check
npm run test -w @epis2/epis2-ui
npm run test -w @epis2/web -- --run src/components/classic-md3 src/pages/AppearancePreferencesPage.test.tsx
npm run quality:m3-human-pilot   # revalidar V1–V6
```

---

## Próximo paso

1. Revisión humana en local — Comando, clásico con paciente, dashboard, preferencias (densidad Compacta)
2. Segunda pasada visual capturada → actualizar `reports/epis2-m3-visual-pass-*.md`

---

## Tramo UX-AESTHETIC P2 (2026-06-10)

| Cambio | Archivos |
|--------|----------|
| Dock inferior unificado (command + status) | `EpisClassicMd3BottomDock`, `EpisDashboardMd3BottomDock`, shells |
| Top bar global unificada en clásico/dashboard | `ClassicMd3WorkspaceLayout`, `DashboardMd3WorkspaceLayout` → `EpisTopAppBar` |
| Nav móvil clásico (drawer + chips) | `EpisClassicMd3MobileNav` |
| Nav móvil dashboard (tabs horizontales) | `EpisDashboardMd3MobileNav` |
| Scope bar colapsable | `EpisDashboardMd3ScopeBar` |
| Densidad UI → ritmo formularios | `resolveEpis2M3FormLayout`, `theme.epis2.formLayout`, forms |
| Supporting pane off en `< lg` | `ClassicMd3WorkspaceLayout` |
| Status expandible | `EpisClassicMd3StatusBar`, `EpisDashboardMd3StatusBar` |

**Frase guía:** *La pasada automatizada valida regresión; el signoff estético lo decide el clínico en pantalla.*

---

## Plan «Clinical Calm Premium» (integrado 2026-06-10)

Hoja de ruta estética completa: [`docs/design/EPIS2_CLINICAL_CALM_PREMIUM_PLAN.md`](../docs/design/EPIS2_CLINICAL_CALM_PREMIUM_PLAN.md)

| Tramo | Contenido | Prioridad |
|-------|-----------|-----------|
| **THEME-CALM-01** | Tema MTB petróleo `#0B5C66`, fondo `#F7F9FC`, dark clínico | Alta |
| **UX-AESTHETIC P3** | Islas sin sombra, chips tonales, canvas app | Alta |
| **UX-CALM-COMMAND** | Barra comando 56–64px, radius 28–32px | Media |
| **UX-CALM-PATIENT** | Banner premium + mosaico + iconografía tarjetas | Media (continúa Fase A) |
| **UX-CALM-CLASSIC** | Hoja SOAP digital 820–920px | Media |
| **UX-CALM-DASHBOARD** | Dashboard editorial ≤5 métricas | Media |
| **UX-CALM-DARK** | Paleta oscura azul-gris | Baja |
| **UX-CALM-SIGNOFF** | Cierre NO-GO → GO humano | Gate final |

P1/P2 y MF-CLINICAL-SUMMARY-A cubren infraestructura y composición base del plan.
