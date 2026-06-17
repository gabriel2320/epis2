# EPIS2 — Auditoría global pantallas y formularios

**Fecha:** 2026-06-04  
**Alcance:** Árbol de pantallas, registry de 18 blueprints, estética M3, contraste, widgets, dashboard, pantalla dividida, import/export.

---

## 1. Árbol de pantallas (estado)

| Ruta | Pantalla | Shell M3 | Estado |
|------|----------|----------|--------|
| `/comando` | Centro de Comando (home) | `EpisAppShellLayout` + rail | **COMPLETE** |
| `/epis2/dashboard` | Dashboard operativo | `EpisAppShellLayout` + rail | **COMPLETE** (esta sesión) |
| `/espacio/ficha` | Ficha paciente 5 tabs | `ClinicalShellLayout` + chart chrome | **COMPLETE** |
| `/espacio/preferencias-apariencia` | Preferencias M3 | Página standalone | **COMPLETE** |
| `/espacio/admin?tab=forms` | Estudio formularios | Admin console tab | **COMPLETE** (esta sesión) |
| `/espacio/*` (19 rutas blueprint) | Formularios clínicos | Two-pane + scrollspy | **COMPLETE** |
| `/login` | Inicio sesión | Minimal | **COMPLETE** |

**Nota producto:** Home sigue siendo Centro de Comando; dashboard es vista secundaria accesible por comando o rail.

---

## 2. Registry formularios (19/19)

Todos los blueprints en `packages/clinical-forms/src/registry.ts` tienen:

- `routePath` único
- `intentIds` ligados al command-registry
- `columnSpan` M3 donde aplica (fase 2)
- Validación layout vía `validateBlueprintLayout`

**Generación de nuevos formularios:** Admin → Formularios (`BlueprintStudioPanel`):

1. Wizard scaffold (blueprintId, ruta, intent, roles)
2. Export JSON individual o registry completo
3. Import JSON con validación + regeneración de módulo TS (`scaffoldBlueprintModule`)

**Pendiente producto:** inventario ficha médica **IDC 1–200** — `docs/product/EPIS2_ARCHITECTURE_INVENTORY_MEDICAL_RECORD.md`.  
**Árbol reconciliado:** `docs/architecture/EPIS2_RECONCILED_NAVIGATION_TREE.md` · `apps/web/src/navigation/epis2NavigationTree.ts`.

---

## 3. Estética y contraste

| Norma | Implementación | Estado |
|-------|----------------|--------|
| Botones filled/contrastText | `buildEpis2Components` — primary/secondary/error/warning/info/success | **COMPLETE** |
| FAB coloreados | `MuiFab` contrastText | **COMPLETE** |
| Chips filled de color | `MuiChip-filledPrimary` … `filledSuccess` | **COMPLETE** |
| EpisButton tonal | Fondo `primary.main` + texto claro | **COMPLETE** |
| Grid 8dp / touch 48dp | `m3-layout-tokens.ts` | **COMPLETE** |
| Roles clínicos protegidos | Sin personalización en preferencias | **COMPLETE** |

Tests: `components.contrast.test.ts`, `clinical-roles.contrast.test.ts`.

---

## 4. Pantalla dividida clínica

- Preferencia `clinicalSplitScreen`: `focus` | `split` en `EpisThemePreferences`
- UI en `EpisAppearancePreferencesPanel`
- Hook `useEpisClinicalContextPanel` abre historial por defecto en modo `split`
- Canon: `docs/design/EPIS2_PATIENT_CHART_NAVIGATION_M3.md`

---

## 5. Widgets

| Capacidad | Estado |
|-----------|--------|
| Rejilla 12 columnas M3 | **COMPLETE** |
| Arrastrar para reordenar | **COMPLETE** (`EpisDraggableWidgetGrid`) |
| Persistencia orden | localStorage vía `widgetLayoutOrder` |
| Export/import layout JSON | **COMPLETE** (`widget-layout-io`) |
| Toolbar en `ClinicalWidgetPanel` | **COMPLETE** |

---

## 6. Import / export

| Artefacto | Formato | Ubicación |
|-----------|---------|-----------|
| Blueprint clínico | JSON schema v1 | Admin → Formularios |
| Registry completo | JSON | Admin → Formularios |
| Layout widgets | JSON schema v1 | Panel widgets (superficie) |
| FHIR bundle | API existente | Fuera de alcance UI esta sesión |

---

## 7. Gates ejecutados

```bash
npm run check
npm run test
npm run db:validate
```

---

## 8. Riesgos

1. **Scaffold ≠ registro automático** — el módulo generado debe añadirse manualmente a `blueprints/` y `registry.ts` con gates.
2. **Widget order** — solo localStorage; no sincroniza entre dispositivos.
3. **Formularios MISSING del catálogo producto** — siguen fuera de MVP v1.

---

## 9. Próximo paso

1. Blueprint de demografía paciente (primer MISSING de alto valor).
2. Sincronizar widget layout con preferencias de servidor cuando exista API de perfil.
3. `npm run quality:golden-journey` en ciclo de release.
