# MF-LOCK-RC3-01 — Branch protection + estado público

**Fecha:** 2026-06-16 · **Programa:** micro-cierre operacional post PROG-POST-RC3  
**Base:** `master` post `b8d1fff` · **Tag release:** `v0.1-demo-rc3` (ancla RH-01…08; POST-RC3 en `master`)

---

## Objetivo

Blindar `master` con required checks reales y alinear README/operación con cierre POST-RC3.

**Prohibido:** features clínicas · cambios apps/packages.

---

## Branch protection `master` — ✓ aplicada

API: `PUT repos/gabriel2320/epis2/branches/master/protection` · permiso **ADMIN**.

| Setting | Valor |
|---------|-------|
| Strict status checks | `true` |
| PR reviews requeridas | `0` aprobaciones (solo flujo PR) |
| Force push | deshabilitado |

### Required checks (context exacto GitHub)

| Context | Workflow |
|---------|----------|
| `required` | CI |
| `e2e-dual-chart` | CI |
| `gitleaks (blocking)` | RH-09 |
| `CodeQL (javascript-typescript, blocking) (javascript-typescript)` | RH-10 |
| `dependency-review (blocking)` | RH-11 |

Verificación:

```bash
gh api repos/gabriel2320/epis2/branches/master/protection
```

---

## Prerrequisito dependency-review — ✓ resuelto

Primer run falló: *Dependency graph not enabled*.

Acciones API:

- `PUT repos/.../vulnerability-alerts` → 204
- `PATCH security_and_analysis.dependabot_security_updates` → enabled
- GraphQL: `dependencyGraphManifests.totalCount` = **25**

Rerun workflow → `dependency-review (blocking)` **pass**.

---

## PR verificación — [#23](https://github.com/gabriel2320/epis2/pull/23)

| Check | Resultado |
|-------|-----------|
| `required` | ✓ pass (~8m47s) |
| `e2e-dual-chart` | ✓ pass |
| `gitleaks (blocking)` | ✓ pass |
| `CodeQL (javascript-typescript, blocking) (javascript-typescript)` | ✓ pass |
| `dependency-review (blocking)` | ✓ pass (tras enable graph) |
| `npm-audit-report` | ✓ pass (report-only, no required) |

**No required:** Cursor Bugbot · CodeQL (duplicate advisory check) · npm-audit-report

---

## Estado público

| Artefacto | Estado |
|-----------|--------|
| `origin/master` | POST-RC3 + RH-09/10/11 · protegido tras merge #23 |
| Release latest | `v0.1-demo-rc3` — nota POST-RC3 añadida en release body |
| README | PROG-POST-RC3 ✓ |

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

---

## RH-12 — auditoría reproducible

Workflow manual: `.github/workflows/rh12-branch-protection-required-checks.yml`

| Modo | Uso | Token |
|------|-----|-------|
| `audit` | Verificar lista canónica (default) | `GITHUB_TOKEN` |
| `apply` | Restaurar protección tras deriva | Secret `EPIS2_REPO_ADMIN_TOKEN` (PAT Administration write) |

```bash
gh secret set EPIS2_REPO_ADMIN_TOKEN --repo gabriel2320/epis2   # solo si usarás apply
# Actions → RH-12 Branch protection required checks → Run workflow
```
