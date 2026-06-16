# EPIS2 — Tema Monochrome Gray + coherencia cromática

**Fecha:** 2026-06-04  
**Alcance:** Nuevo tema MTB blanco/negro/grises, identidad visual derivada del esquema, chips demo alineados.

---

## Cambios

### Nuevo tema **Blanco y negro (grises)**
- ID MTB: `monochrome-gray`
- Acento preferencias: `monochrome`
- Fuente: `packages/epis2-ui/src/theme/source/monochrome-gray.material-theme.json`
- Light: primary `#171717`, superficies blanco → gris claro
- Dark: primary `#FAFAFA`, superficies negro → gris oscuro
- Semántica UI (warning/success/info) derivada en grises vía `resolveEpis2SemanticPalette`

### Coherencia global del tema
- `buildVisualIdentity` usa esquema MTB (bordes, focus, power bar, demo badge)
- `EpisDemoBadgeChip` reemplaza chips demo con `warning` fijo en login, comando, ficha, dashboard, formularios
- Barra de comando: focus ring desde `visual.powerBarFocusShadow` (sin `primary.light` hardcodeado)

### Roles clínicos protegidos
- Alertas CDS, borrador, aprobación y crítico **sin cambios** (`clinicalRoles`)

---

## Uso

Preferencias de apariencia → **Blanco y negro (grises)** → aplicación instantánea (localStorage).

---

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK |
| `npm run test` | 390 tests OK |
| `npm run theme:validate` | OK (7 perfiles MTB) |
| `npm run db:validate` | OK |

---

## Próximo paso

Captura visual M3 con `npm run quality:m3-visual-pass` incluyendo acento monochrome.
