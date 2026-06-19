# Tramo 5 — PROG-SECURITY-PROMOTE · RH-11 (MF-SEC-03)

**Fecha:** 2026-06-11 · **Programa:** PROG-POST-RC3 · **Predecesor:** RH-04 report-only

---

## Alcance RH-11

Promover **dependency-review** a blocking en PRs; documentar waiver para npm-audit report-only.

| Entrega | Ruta |
|---------|------|
| Workflow | `.github/workflows/ci-rh04-deps.yml` → RH-11 |
| Waiver / policy | `docs/product/EPIS2_DEPENDENCY_REVIEW_WAIVER.md` |
| Gate | `quality:security-promote-gate` (RH-09/10/11) |

**Umbral:** `fail-on-severity: critical` · comentario en PR siempre.

**Report-only (waiver):** job `npm-audit-report` · artefacto JSON · RH-05 SBOM sin cambio.

---

## Evidencia CI previa

Runs `ci-rh04-deps.yml` en PRs recientes: **success** (2026-06-16), incl. Dependabot y RH-06.

---

## Branch protection (operador)

Añadir **`dependency-review (blocking)`** junto a:

- `gitleaks (blocking)` (RH-09)
- `CodeQL (javascript-typescript, blocking)` (RH-10)

---

## Verificación

```bash
npm run quality:security-promote-gate
npm run tool:consolidate:verify-phase4
npm run quality:fast
```

---

## Cierre Tramo 5

PROG-SECURITY-PROMOTE completo: RH-09 ✓ · RH-10 ✓ · RH-11 ✓  
Cierre programa: [`epis2-prog-post-rc3-close.md`](epis2-prog-post-rc3-close.md)
