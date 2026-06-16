# Tramo 5 — PROG-SECURITY-PROMOTE · RH-09 (MF-SEC-01)

**Fecha:** 2026-06-11 · **Programa:** PROG-POST-RC3 · **Predecesor:** RH-03 report-only

---

## Alcance RH-09

Promover Gitleaks de report-only a **blocking** en CI.

| Entrega | Ruta |
|---------|------|
| Workflow blocking | `.github/workflows/ci-rh03-gitleaks.yml` → `RH-09 Gitleaks (blocking)` |
| Config | `.gitleaks.toml` |
| Gate local | `quality:security-promote-gate` |
| phase4 verify | `tools/scripts/verify-phase4-ci.mjs` actualizado |

**Sin cambio:** RH-02 CodeQL · RH-04 deps · RH-05 SBOM siguen `continue-on-error: true`.

---

## Evidencia CI previa (report-only)

Runs `ci-rh03-gitleaks.yml` en `master`: **success** en commits recientes post-rc3 (2026-06-16), incl. tramos 1–4 PROG-POST-RC3.

---

## Branch protection (operador)

Tras merge, añadir required check en GitHub:

**Settings → Branches → master → Require status checks:**

- `gitleaks (blocking)` (workflow **RH-09 Gitleaks (blocking)**)

Sin este paso, el workflow falla PRs con secretos pero no bloquea merge vía ruleset hasta configurarlo.

---

## Verificación

```bash
npm run quality:security-promote-gate
npm run tool:consolidate:verify-phase4
npm run quality:fast
```

---

## Pendiente — RH-10 / RH-11

| RH | Entrega |
|----|---------|
| **RH-10** | CodeQL → required (quitar continue-on-error) |
| **RH-11** | dependency-review alinear o waiver documentado |

Plan: [`epis2-audit-plan-post-rc3-2026.md`](epis2-audit-plan-post-rc3-2026.md)
