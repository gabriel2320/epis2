# Tramo 5 — PROG-SECURITY-PROMOTE · RH-10 (MF-SEC-02)

**Fecha:** 2026-06-11 · **Programa:** PROG-POST-RC3 · **Predecesor:** RH-02 report-only

---

## Alcance RH-10

Promover CodeQL de report-only a **blocking** en CI.

| Entrega | Ruta |
|---------|------|
| Workflow blocking | `.github/workflows/ci-rh02-codeql.yml` → `RH-10 CodeQL (blocking)` |
| Config | `codeql/codeql-config.yml` |
| Gate local | `quality:security-promote-gate` (RH-09 + RH-10) |
| phase4 verify | `tools/scripts/verify-phase4-ci.mjs` |

**Sin cambio:** RH-04 deps · RH-05 SBOM siguen `continue-on-error: true`.

---

## Evidencia CI previa (report-only)

Runs `ci-rh02-codeql.yml` en `master`: **success** en commits recientes post-rc3 (2026-06-16), incl. tramos PROG-POST-RC3 y RH-09.

---

## Branch protection (operador)

Añadir required check en GitHub **Settings → Branches → master**:

- `CodeQL (javascript-typescript, blocking)` (workflow **RH-10 CodeQL (blocking)**)

Junto con RH-09: `gitleaks (blocking)`.

---

## Verificación

```bash
npm run quality:security-promote-gate
npm run tool:consolidate:verify-phase4
npm run quality:fast
```

---

## Pendiente — RH-11

**RH-11:** dependency-review alinear o waiver documentado · plan [`epis2-audit-plan-post-rc3-2026.md`](epis2-audit-plan-post-rc3-2026.md)
