# MF-LOCK-RC3-01 — Branch protection + estado público

**Fecha:** 2026-06-16 · **Programa:** micro-cierre operacional post PROG-POST-RC3  
**Base:** `master` post `b8d1fff` · **Tag release:** `v0.1-demo-rc3` (ancla RH-01…08; POST-RC3 en `master`)

---

## Objetivo

Blindar `master` con required checks reales y alinear README/operación con cierre POST-RC3.

**Prohibido:** features clínicas · cambios apps/packages.

---

## Required checks configurados

Configuración vía GitHub API (`branches/master/protection`) · operador ADMIN.

| Context (check name) | Workflow | Modo |
|----------------------|----------|------|
| `required` | CI | blocking |
| `e2e-dual-chart` | CI | blocking |
| `gitleaks (blocking)` | RH-09 Gitleaks | blocking |
| `CodeQL (javascript-typescript, blocking) (javascript-typescript)` | RH-10 CodeQL | blocking |
| `dependency-review (blocking)` | RH-11 (solo PR) | blocking |

**Strict:** `true` — HEAD del PR debe incluir checks del merge base actualizado.

**PR reviews:** 0 requeridas (repo demo; ajustar si equipo crece).

---

## PR verificación

| Campo | Valor |
|-------|-------|
| PR | _completar tras apertura MF-LOCK-RC3-01_ |
| Checks verdes | _captura / enlace Actions_ |

---

## Estado público

| Artefacto | Estado |
|-----------|--------|
| `origin/master` | POST-RC3 + RH-09/10/11 |
| Release latest | `v0.1-demo-rc3` (notas pre-promoción security — ver abajo) |
| README | PROG-POST-RC3 ✓ |

**Nota release:** body rc3 describe RH report-only (correcto al tag). POST-RC3 security promote vive en `master` posterior; no re-tag forzado.

---

## Verificación local

```bash
npm run quality:fast
gh api repos/gabriel2320/epis2/branches/master/protection
```

---

## Gates

```bash
npm run quality:fast
```

Congelamiento vigente · siguiente: piloto sintético UX (sin expansión clínica masiva).
