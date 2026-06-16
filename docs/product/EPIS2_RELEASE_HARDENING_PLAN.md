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
| **RH-01** | ✓ DONE | Actions `@v5` + Node 24 en CI · PR #15 |
| **RH-02** | ✓ DONE | CodeQL report-only |
| **RH-03** | ✓ DONE | Gitleaks report-only |
| **RH-04** | ✓ DONE | dependency-review + audit JSON |
| **RH-05** | ✓ DONE | CycloneDX SBOM |
| **RH-06** | PR #16 | `no-test-fixtures-in-prod-web` + bridge web |
| **RH-07** | ✓ DONE | fail-closed AUTH demo/hybrid deployed |
| **RH-08** | ✓ DONE | `quality:release` + `security:no-bidi` |

Workflows RH-02…05: **`continue-on-error: true`** — no required checks.

---

## Orden de ejecución

```text
PR #15  RH-01 + RH-02…05 + RH-07 + RH-08  ✓ merged
PR #16  RH-06 web fixtures bridge  (abierto)
PR #14  Dependabot setup-node v6 — cerrado (superseded)
```

---

## Referencias

- CI tiers: MF-CON-11 · `tools/gates/required.json`
- Node deprecation: GitHub Actions Node 24 (jun 2026)
- Release tag: [`v0.1-demo-rc2`](https://github.com/gabriel2320/epis2/releases/tag/v0.1-demo-rc2)
