# EPIS2 — Registro de ramas git (archivo)

**Versión:** 1.1 · **Fecha:** 2026-06-16 · **Programa:** PROG-PURGE-CICA · MF-PURGE-02

> **No borrar ramas.** Archivar = registrar aquí + tag git opcional. El operador decide limpieza local/remota.

---

## Rama activa (producto)

| Rama | Rol | Notas |
|------|-----|-------|
| `master` | **Troncal** | Tag demo `v0.1-demo-rc3` |
| `feat/prog-aesthetic-reset-close` | **Feature en curso** | CICA clean room; merge pendiente |

---

## Ramas archivadas — consolidación (mergeadas ✓)

Registradas como histórico. **Referencia únicamente** — no retomar como línea de trabajo.

| Rama | Programa | Estado | Evidencia cierre |
|------|----------|--------|------------------|
| `chore/epis2-consolidation-2` | PROG-CONSOLIDATE ola 2 | ✓ mergeada | [`epis2-prog-consolidate-ola2-close-2026.md`](../../reports/epis2-prog-consolidate-ola2-close-2026.md) |
| `chore/epis2-consolidation-2-config-auth` | MF-CON-04/05 | ✓ mergeada | idem |
| `chore/epis2-consolidation-2-governance-ci` | MF-CON-03/11 | ✓ mergeada | idem |
| `chore/epis2-consolidation-2-http` | MF-CON-06 | ✓ mergeada | idem |
| `chore/epis2-consolidation-2-mf-con-09` | MF-CON-09 | ✓ mergeada | idem |
| `chore/repo-consolidation-phase-0-1` | PROG-CONSOLIDATE ola 1 | ✓ mergeada | [`epis2-prog-consolidate-close-2026.md`](../../reports/epis2-prog-consolidate-close-2026.md) |
| `chore/prog-release-hardening-rh01-08` | PROG-RELEASE-HARDENING | ✓ mergeada (remote) | [`epis2-session-close-2026-06-16-release-hardening.md`](../../reports/epis2-session-close-2026-06-16-release-hardening.md) |
| `chore/prog-release-hardening-rh06-web-fixtures` | RH-06 | ✓ mergeada (remote) | idem |
| `pr-15` | PR histórico | ✓ obsoleto | referencia only |

---

## Procedimiento de archivo de rama (sin borrar)

1. Confirmar merge en GitHub o `git log master..<rama>` vacío.
2. Registrar fila en esta tabla.
3. Tag opcional de archivo: `git tag archive/<rama>-YYYY-MM-DD <last-commit-on-branch>`
4. **No** `git branch -d` / **no** `git push origin --delete` salvo orden explícita del operador.

---

## Ramas Dependabot

Mantener hasta merge o cierre PR — ver [`epis2-prog-deps-hygiene-tramo4-close.md`](../../reports/archive/2026-06/epis2-prog-deps-hygiene-tramo4-close.md).

---

## Desarrollos truncados en `master`

No son ramas git — ver [`TRUNCATED_MODULES.md`](./TRUNCATED_MODULES.md). Agentes: **no expandir** — ver [`AGENT_SCOPE_EXCLUSIONS.md`](./AGENT_SCOPE_EXCLUSIONS.md).

---

## Referencias

- [`EPIS2_PURGE_ARCHIVE_PLAN.md`](../product/EPIS2_PURGE_ARCHIVE_PLAN.md)
- [`ARCHIVED_PROGRAMS_INDEX.md`](./ARCHIVED_PROGRAMS_INDEX.md)
