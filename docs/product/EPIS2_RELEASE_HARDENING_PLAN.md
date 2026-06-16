# EPIS2 — PROG-RELEASE-HARDENING

**Versión:** 1.0 · **Fecha:** 2026-06-16 · **Base:** `v0.1-demo-rc2`  
**Predecesor:** PROG-CONSOLIDATE ola 2 ✓ · [`epis2-prog-consolidate-ola2-close-2026.md`](../reports/epis2-prog-consolidate-ola2-close-2026.md)

Congelamiento vigente: [`CONSOLIDATION_FREEZE.md`](../CONSOLIDATION_FREEZE.md) — hardening permitido; no features clínicas.

---

## Objetivo

Convertir **`v0.1-demo-rc2`** en base reproducible, auditable y segura antes de **v0.2**.

No agregar pantallas clínicas. No Zod 4 en master (programa aparte: `PROG-ZOD4-MIGRATION`).

---

## Microfases

| ID | Estado | Entrega | Gate |
|----|--------|---------|------|
| **RH-01** | ✓ READY PR | Actions `@v5` + Node 24 en CI | CI required verde |
| **RH-02** | ✓ READY PR | CodeQL report-only | workflow `ci-rh02-codeql.yml` |
| **RH-03** | ✓ READY PR | Gitleaks report-only | workflow `ci-rh03-gitleaks.yml` |
| **RH-04** | ✓ READY PR | dependency-review + audit JSON | workflow `ci-rh04-deps.yml` |
| **RH-05** | ✓ READY PR | CycloneDX SBOM | workflow `ci-rh05-sbom.yml` |
| **RH-06** | pendiente | `no-test-fixtures-in-prod-web` + bridge web | PR aparte (14 archivos) |
| **RH-07** | ✓ READY PR | fail-closed AUTH demo/hybrid deployed | `config.test.ts` |
| **RH-08** | ✓ READY PR | `quality:release` manifest | `tools/gates/release.json` |

Workflows RH-02…05: **`continue-on-error: true`** — no required checks.

---

## Orden de ejecución

```text
PR #13  RH-01 + RH-02…05 + RH-07 + RH-08  (este tramo)
PR #14  RH-06 web fixtures bridge
Promoción futura: Gitleaks → blocking · CodeQL → required · audit alinear nightly
```

---

## Referencias

- CI tiers: MF-CON-11 · `tools/gates/required.json`
- Node deprecation: GitHub Actions Node 24 (jun 2026)
- Release tag: [`v0.1-demo-rc2`](https://github.com/gabriel2320/epis2/releases/tag/v0.1-demo-rc2)
