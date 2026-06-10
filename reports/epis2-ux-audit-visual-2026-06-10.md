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

1. Revisión humana en local (`npm run dev:web`) — Comando, clásico con paciente, dashboard, preferencias  
2. Segunda pasada visual capturada → actualizar `reports/epis2-m3-visual-pass-*.md`  
3. Tramo UX-AESTHETIC P2 (si aplica): consolidar command bar + status bar en modos MD3; rail móvil dashboard

**Frase guía:** *La pasada automatizada valida regresión; el signoff estético lo decide el clínico en pantalla.*
