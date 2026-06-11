# EPIS2 — Mapa de rutas (modos dual ficha)

**Versión:** 0.1 · **ADR:** [`ADR-002-dual-chart-modes.md`](../adr/ADR-002-dual-chart-modes.md)

---

## Leyenda

| Símbolo | Significado |
|---------|-------------|
| 🟢 | Canónico nuevo |
| 🟡 | Legacy congelado |
| 🔵 | Sin cambio (home / auth) |

---

## Rutas objetivo (post-migración fase 2+)

```text
/login                          🔵
/comando                        🔵 HOME (launcher delgado fase 3)
/sesion-expirada                🔵

/espacio/ficha                  🟢 ClinicalShell + chartMode
  ?patientId=
  &chartMode=traditional|paper  (default: traditional)
  &section=anamnesis            (paper: sección activa)

/espacio/ficha/imprimir         🟢 preview print Carta/A5
  ?patientId=&format=letter|a5&section=all|anamnesis

/espacio/*                      🟡 formularios — heredan ClinicalShell + command bar
  (evolucion, epicrisis, labs…)

/dev/chart-modes                🟢 preview scaffold (flag VITE_ENABLE_DUAL_CHART_MODES)

/epis2/dashboard                🟡 legacy congelado
  ?mode=dashboard

/espacio/ficha?mode=classic     🟡 legacy MD3 — sin nuevas features
```

---

## Search params canónicos

| Param | Valores | Uso |
|-------|---------|-----|
| `patientId` | UUID | Paciente activo |
| `chartMode` | `traditional` \| `paper` | Modo ficha dual |
| `section` | `cover` \| `anamnesis` \| … | Scroll/foco modo papel |
| `printFormat` | `letter` \| `a5` | Impresión |
| `mode` | `classic` \| `dashboard` | **Legacy** — ignorar en código nuevo |
| `returnTo` | `dashboard` | **Legacy** retorno |

Parser: `parseChartModeSearch()` en `apps/web/src/routes/chartModeSearch.ts` (fase 1).

---

## Layout × ruta

| Ruta | Shell | Command bar | Modo visual |
|------|-------|-------------|-------------|
| `/comando` | `EpisAppScaffold` | hero + dock | Launcher |
| `/espacio/ficha` (nuevo) | `ClinicalShell` | dock fijo + Ctrl+K | traditional / paper |
| `/espacio/ficha?mode=classic` | `EpisClassicMd3Shell` | dock MD3 | Legacy |
| `/espacio/*` modern | `EpisAppScaffold` | floating dock | Legacy modern |
| `/epis2/dashboard` | dashboard MD3 / RAD | dock | Legacy |

---

## Componentes × ruta

```text
ClinicalShell
├── PatientChartBanner
├── ChartModeSwitch
├── CommandPaletteOverlay → ClinicalShellCommandPalette
├── EpisUniversalCommandBar (variant: chart-transversal)
└── Outlet
      ├── TraditionalEhrMode   (chartMode=traditional)
      └── PaperChartMode       (chartMode=paper)
            └── PaperChartTemplate (7 secciones)
```

---

## Referencias Figma Make

| Modo | Prototipo |
|------|-----------|
| Traditional | [Medical Record](https://www.figma.com/make/PhZ55jJhxLQUtIWEuf17ZO/Medical-Record) |
| Paper | [Crear páginas ficha médica](https://www.figma.com/make/AJ9MNrSyClA0hh8jB8sx49/Crear-p%C3%A1ginas-de-ficha-m%C3%A9dica) |

Mapeo Code Connect: `docs/dev/EPIS2_FIGMA_CODE_CONNECT.md`
