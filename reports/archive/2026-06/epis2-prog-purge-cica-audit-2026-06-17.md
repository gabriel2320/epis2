# EPIS2 — Auditoría PROG-PURGE-CICA (alineación + agent scope)

**Fecha:** 2026-06-17 · **MF:** MF-PURGE-04/07 · **Veredicto:** **GO**

## Alcance

Alineación parser brújula/tablero en `dev:session` + auditoría perímetro archive/agentes.

## Checks (16/16 OK)

| Área | Resultado |
|------|-----------|
| Canon archive (`AGENT_SCOPE_EXCLUSIONS`, `ARCHIVED_PROGRAMS_INDEX`, `PURGE_PLAN`) | ✓ |
| `.cursorignore` + regla `05-agent-archive-boundary.mdc` | ✓ |
| Reportes raíz | **67** `.md` · 0 `epis2-mf-*` históricos (solo `mf-con-*`) |
| Duplicados lote 6 root/archive | **0** |
| Brújula legible | PROG-PURGE-CICA + CICA merge |
| Tablero vs brújula | **Alineado** (header + sección Propuesto PURGE) |
| Stubs subagentes archivados | ✓ layers-integrator, paper-mode |
| Gates → archive paths | ✓ ficha-first sample |

Comando reproducible: `node scripts/maintenance/audit-prog-purge-cica.mjs`

## Cambios aplicados

1. **`getTableroState()`** — lee `EPIS2_CURRENT_STATE` (primario) + `## Propuesto —` del tablero; detecta stale header.
2. **`EPIS2_TABLERO.md`** — header y sección **PROG-PURGE-CICA**; UX-LAB movido a cerrado.
3. **`brief.mjs`** — sección «Estado brújula + tablero»; objetivo desde pasos derivados.
4. **Tests** — `getTableroState lee brújula PROG-PURGE-CICA`.

## Gates

- `npm run quality:fast` ✓
- `node scripts/maintenance/audit-prog-purge-cica.mjs` ✓

## Próximo paso

1. PR purga + merge `feat/prog-aesthetic-reset-close` → `master`
2. Pre-PR: `npm run quality:required`
