# EPIS2 — Vista 1 Command Center (UX-B.1 redesign)

**Fecha:** 2026-06-07 · **Alcance:** `packages/epis2-ui`, `apps/web` (home `/comando`)

---

## Objetivo

Transformar el Centro de Comando de layout vertical tipo dashboard a **dock minimalista + bento opcional**, manteniendo command-first y canon EPIS2.

---

## Entregables

| Componente | Ubicación | Descripción |
|------------|-----------|-------------|
| `EpisFloatingCommandDock` | `packages/epis2-ui/src/command/` | Power Bar flotante inferior-central; prompt + rol/IA integrados |
| `EpisBentoGrid` / `EpisBentoCell` | `packages/epis2-ui/src/layout/` | Grilla 2×2 con `background.default` (surfaceContainer), sin outlined |
| Tokens `floating` radius + `floatingDockShadow` | `theme/shape.ts`, `visual-identity.ts` | Única sombra MD3 suave permitida para el dock |
| `railHidden` | `EpisAppShellLayout` | Rail oculto en home |
| `reserveDockSpace` | `EpisCommandCenterLayout` | Padding inferior para no tapar contenido |
| `CommandCenterPage` | `apps/web` | Sin hero, sin context line, sin sugerencias por defecto |
| `isDemoNarrativesEnabled` | `dev/demoNarrativesEnv.ts` | Flag `VITE_ENABLE_DEMO_NARRATIVES` (dev=true por defecto) |

---

## Eliminado de vista principal

- Título + subtítulo hero centrados
- `CommandCenterContextLine` (duplicaba AppBar)
- `EpisCommandSuggestions` por defecto
- Navigation Rail en `/comando`

---

## Bento

- Visible **solo si hay datos** (recientes, tareas, borradores o alertas con paciente)
- Celdas vacías no se renderizan; centro limpio si no hay nada

---

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK (LAYOUT-G12 incluido) |
| `npm run test` | OK — **503** tests |
| `npm run db:validate` | OK |

---

## Test ids preservados (E2E)

- `epis2-command-prompt` — ahora en el dock (h1)
- `epis2-power-bar` — formulario del dock
- `epis2-floating-command-dock` — contenedor nuevo
- `epis2-toggle-demo-narratives` — solo si demo flag activo

---

## Riesgos / próximo paso

| Riesgo | Mitigación |
|--------|------------|
| E2E UX-G02 usa demos narrativos | `DEV=true` o `VITE_ENABLE_DEMO_NARRATIVES=true` en CI |
| Tema oscuro dock | Revisar contraste en piloto visual |
| Ficha aún duplica Power Bar | **Vista 2** — split-screen + dock único global |

**Siguiente:** revisión visual manual en `http://127.0.0.1:5173/comando` → Vista 2 (Ficha split-screen) tras confirmación.

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
