# EPIS2 — MF-UI-SIMPLIFY-M3 Audit (2026-06-07)

**Microfase:** MF-UI-SIMPLIFY-M3 — Algoritmo de simplificación Material Design  
**Canon:** home = `/comando`; sin router paralelo; sin Tramo J

---

## Principio rector

```txt
Una pantalla = un contexto clínico + una acción dominante + una barra de comando.
VISIBILIDAD = frecuencia clínica + seguridad + contexto actual
```

---

## Infraestructura creada

| Artefacto | Rol |
|-----------|-----|
| `apps/web/src/quality/uiDensityRules.ts` | Clasificación pantallas, presupuesto iconos, acciones globales |
| `EpisAppScaffold` | Top bar + rail + scroll único (`100dvh`, `embeddedLayout`) |
| `EpisClinicalWorkspaceShell` | Tipo B/C/D — command slot + main + supporting + ActionBar |
| `EpisSplitWorkspace` | Supporting pane MD3 colapsable + persistencia local |
| `EpisClinicalActionBar` | Alias de `EpisClinicalFormActionBar` (acción única) |
| `EpisCommandBarContextual` | Comando contextual en workspaces |
| `EpisBulkActionMenu` | Selección múltiple + confirmación destructiva |
| `EpisDraggableList` | DnD solo en modo edición reversible |
| `EpisCopyPasteTextTools` | Pegado plain-text; marca origen IA |

---

## Pantallas auditadas y cambios

| Pantalla | Tipo | Antes | Después |
|----------|------|-------|---------|
| `/comando` | A Command | `EpisAppShellLayout` scroll global | `EpisAppScaffold` `screenKind=command`, rail oculto |
| Shell clínico | B Workspace | Layout ad hoc | `EpisAppScaffold` + `embeddedLayout` |
| `/espacio/ficha` | B Workspace | `EpisDockReserveLayout` + split manual | `EpisClinicalWorkspaceShell` + `EpisSplitWorkspace` |
| `/epis2/dashboard` | B secundario | Shell sin scroll discipline | `EpisAppScaffold` + `EpisClinicalWorkspaceShell` |
| `/espacio/evolucion` | C Form | ActionBar única (previo MF-UI) | Gate duplicate-actions ✓ |

---

## Botones / iconos / scroll

- **Eliminados:** toggle duplicado de historial en ficha (un solo control en split bar).
- **Iconos:** presupuesto codificado (`command: 6`, `workspace: 12`, `form: 6`, `document: 0`).
- **Scroll:** `EpisAppShellLayout.embeddedLayout` evita scroll doble; solo `epis2-main-content` hace scroll.

---

## Gates añadidos

```bash
npm run quality:ui-simplify-gate      # meta
npm run quality:m3-scaffold-gate
npm run quality:duplicate-actions-gate
npm run quality:icon-budget-gate
npm run quality:scroll-discipline-gate
npm run quality:split-pane-gate
npm run quality:bulk-actions-gate
npm run quality:drag-drop-safety-gate
npm run quality:copy-paste-safety-gate
```

---

## Riesgos pendientes

1. **Dashboard tabs** — contenido denso por tab; falta acordeones sistemáticos (MF-UI-05).
2. **BulkActionMenu / DraggableList / CopyPaste** — patrones listos; adopción incremental en tablas farmacia/listas.
3. **Formularios largos** — colapsables por sección aún no generalizados.
4. **E2E UX-G02** — validar split toggle `epis2-ficha-history` tras mover control.

---

## Próximo paso

1. Adoptar `EpisBulkActionMenu` en listas de trabajo dashboard.
2. MF-UI-05 — acordeones en formularios largos.
3. **No** Tramo J hasta gates verdes en CI local.

---

## Frase guía

> EPIS2 debe sentirse como una cabina clínica limpia: barra superior fija, navegación lateral fija, comando central, una acción dominante, doble pantalla cuando ayude, y cero botones repetidos.
