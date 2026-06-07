# EPIS2 — Query dashboard + Storybook bootstrap

**Fecha:** 2026-06-07 · **Alcance:** Prioridad B (multiplicadores)

---

## Alcance

1. **TanStack Query** — migración completa del modo tablero (`DashboardModeContent`).
2. **Storybook** — bootstrap en `packages/epis2-ui` con gate de tema MUI-G16.

---

## TanStack Query (dashboard)

| Cambio | Detalle |
|--------|---------|
| Hook | `useDashboardQueries` — 12 tabs con `enabled` por permiso/tab |
| Keys | `queryKeys.dashboard.*` |
| Invalidación | `invalidateAfterDraftApproval` incluye `dashboard.all()` y ficha paciente |
| Archivo | `DashboardModeContent.tsx` — eliminados ~200 líneas de fetch manual |
| Tests | `DashboardModePage.test.tsx` → `renderWithQuery` + mock parcial API |

---

## Storybook

| Cambio | Detalle |
|--------|---------|
| Config | `packages/epis2-ui/.storybook/` — `Epis2ThemeProvider` en preview |
| Stories | 12 archivos canónicos (Button, CommandBar, ClinicalForm, DataGrid, Metric, DraftStatus, ApprovalGate, AiDisclosure, Empty, Loading, Chip, PrintA5) |
| CLI | Raíz monorepo: `npm run storybook:ui` / `storybook:ui:build` |
| Gate | `storybook-theme-gate.mjs` en `architecture:validate` |
| ADR | `docs/design/EPIS2_STORYBOOK_DECISIONS.md` |
| Output | `packages/epis2-ui/storybook-static/` (gitignored) |

---

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK (incl. `storybook-theme-gate`) |
| `npm run test` | 438/438 OK |
| `npm run db:validate` | OK |
| `npm run storybook:ui:build` | OK |

---

## Riesgos

- Storybook deps en raíz + workspace epis2-ui — mantener versiones alineadas (`8.6.18`).
- `useMutation` en formularios clínicos sigue pendiente (invalidación unificada al guardar borrador).

---

## Próximo paso

1. **Prioridad A:** signoff clínico humano A–K → piloto institucional.
2. **Prioridad B:** `useMutation` + invalidación desde formularios; CI opcional `storybook:ui:build`.
3. Ampliar stories bajo demanda por IDC (no catálogo masivo).

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
