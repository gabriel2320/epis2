# PROG-POST-RC3 — cierre programa

**Fecha:** 2026-06-11 · **Tag base:** `v0.1-demo-rc3` · **Plan:** [`epis2-audit-plan-post-rc3-2026.md`](epis2-audit-plan-post-rc3-2026.md)

---

## Tramos entregados

| Tramo | Programa | Evidencia |
|-------|----------|-----------|
| 1 | PROG-GOBIERNO | [`epis2-prog-gobierno-post-rc3-tramo1-close.md`](epis2-prog-gobierno-post-rc3-tramo1-close.md) |
| 2 | PROG-DEV-PARITY | [`epis2-prog-dev-parity-tramo2-close.md`](epis2-prog-dev-parity-tramo2-close.md) |
| 3 | PROG-LEGAL-DISCLAIMER | [`epis2-prog-legal-disclaimer-tramo3-close.md`](epis2-prog-legal-disclaimer-tramo3-close.md) |
| 4 | PROG-DEPS-HYGIENE | [`epis2-prog-deps-hygiene-tramo4-close.md`](epis2-prog-deps-hygiene-tramo4-close.md) |
| 5 | PROG-SECURITY-PROMOTE | RH-09 [`rh09`](epis2-prog-security-promote-tramo5-rh09.md) · RH-10 [`rh10`](epis2-prog-security-promote-tramo5-rh10.md) · RH-11 [`rh11`](epis2-prog-security-promote-tramo5-rh11.md) |

---

## CI security post-promoción

| Check | Modo |
|-------|------|
| Gitleaks | **blocking** (RH-09) |
| CodeQL | **blocking** (RH-10) |
| dependency-review | **blocking** critical en PR (RH-11) |
| npm-audit JSON | report-only |
| CycloneDX SBOM | report-only (RH-05) |

Policy: [`docs/product/EPIS2_DEPENDENCY_REVIEW_WAIVER.md`](../docs/product/EPIS2_DEPENDENCY_REVIEW_WAIVER.md)

---

## Pendiente operador (no código)

1. Branch protection `master`: required checks RH-09/10/11.
2. Programas diferidos: `PROG-ZOD4-MIGRATION` · batch devDeps #1–3 · `PROG-MEDIA-FUTURE`.

---

## Gates cierre

```bash
npm run quality:security-promote-gate
npm run quality:deps-hygiene-gate
npm run quality:legal-disclaimer-gate
npm run tool:consolidate:verify-phase4
npm run quality:fast
```

**Congelamiento** sigue vigente — base pre-piloto sintético gobernada; no features clínicas sin MF autorizada.
