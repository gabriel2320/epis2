# EPIS2 — PROG-RELEASE-HARDENING

**Versión:** 1.1 · **Estado:** ✓ **CERRADO** · **Fecha cierre:** 2026-06-16  
**Base:** `v0.1-demo-rc2` · **Tag entrega:** [`v0.1-demo-rc3`](https://github.com/gabriel2320/epis2/releases/tag/v0.1-demo-rc3)  
**Predecesor:** PROG-CONSOLIDATE ola 2 ✓ · [`epis2-prog-consolidate-ola2-close-2026.md`](../reports/epis2-prog-consolidate-ola2-close-2026.md)

Congelamiento vigente: [`CONSOLIDATION_FREEZE.md`](../CONSOLIDATION_FREEZE.md) — hardening permitido; no features clínicas.

---

## Objetivo

Convertir **`v0.1-demo-rc2`** en base reproducible, auditable y segura antes de **v0.2**.

No agregar pantallas clínicas. No Zod 4 en master (programa aparte: `PROG-ZOD4-MIGRATION`).

**Resultado:** objetivo cumplido · tag **`v0.1-demo-rc3`** publicado.

---

## Microfases

| ID | Estado | Entrega | Gate |
|----|--------|---------|------|
| **RH-01** | ✓ DONE | Actions `@v5` + Node 24 en CI · PR #15 |
| **RH-02** | ✓ DONE | CodeQL report-only |
| **RH-03** | ✓ DONE | Gitleaks report-only |
| **RH-04** | ✓ DONE | dependency-review + audit JSON |
| **RH-05** | ✓ DONE | CycloneDX SBOM |
| **RH-06** | ✓ DONE | bridge web + gate prod · PR #16 |
| **RH-07** | ✓ DONE | fail-closed AUTH demo/hybrid deployed |
| **RH-08** | ✓ DONE | `quality:release` + `security:no-bidi` |

Workflows RH-02, RH-04, RH-05: **`continue-on-error: true`** — report-only.

**Promoción post-rc3 (PROG-SECURITY-PROMOTE):**

| ID | Estado | Entrega |
|----|--------|---------|
| **RH-09** | ✓ DONE | Gitleaks **blocking** · [`epis2-prog-security-promote-tramo5-rh09.md`](../reports/epis2-prog-security-promote-tramo5-rh09.md) |
| **RH-10** | ✓ DONE | CodeQL **blocking** · [`epis2-prog-security-promote-tramo5-rh10.md`](../reports/epis2-prog-security-promote-tramo5-rh10.md) |
| RH-11 | pendiente | dependency-review alinear |

---

## Orden de ejecución

```text
PR #15  RH-01 + RH-02…05 + RH-07 + RH-08  ✓ merged
PR #16  RH-06 web fixtures bridge  ✓ merged
PR #14  Dependabot setup-node v6 — cerrado (superseded)
Promoción post-rc3: RH-09 Gitleaks blocking ✓ · RH-10 CodeQL blocking ✓ · RH-11 dependency-review
```

---

## Referencias

- CI tiers: MF-CON-11 · `tools/gates/required.json`
- Node deprecation: GitHub Actions Node 24 (jun 2026)
- Release tag: [`v0.1-demo-rc3`](https://github.com/gabriel2320/epis2/releases/tag/v0.1-demo-rc3)
- Cierre: [`epis2-session-close-2026-06-16-release-hardening.md`](../reports/epis2-session-close-2026-06-16-release-hardening.md) · [`epis2-v0.1-demo-rc3-release.md`](../reports/epis2-v0.1-demo-rc3-release.md)
- Siguiente programa: [`epis2-audit-plan-post-rc3-2026.md`](../reports/epis2-audit-plan-post-rc3-2026.md) (PROG-POST-RC3)
