# EPIS2 — Release `v0.1-demo-rc3`

**Fecha:** 2026-06-16 · **Base:** `v0.1-demo-rc2` · **HEAD:** `02e0d3b`  
**Programa:** PROG-RELEASE-HARDENING RH-01…08 ✓

---

## Resumen

Tercer release candidate demo tras hardening de CI, seguridad report-only, auth fail-closed y desacople de `@epis2/test-fixtures` en web prod.

---

## Cambios vs `v0.1-demo-rc2`

| Área | Entrega |
|------|---------|
| CI | Node 24 · `actions/checkout@v5` · `setup-node@v5` |
| Security (report-only) | CodeQL · Gitleaks · dependency-review · npm audit JSON · CycloneDX SBOM |
| Auth deployed | `AUTH_MODE=demo` / hybrid sin key → fail-closed staging/prod |
| Web prod | `devFixturesBridge` · gate `no-test-fixtures-in-prod` web |
| Gates | `npm run quality:release` · `npm run security:no-bidi` |

PRs: [#15](https://github.com/gabriel2320/epis2/pull/15) · [#16](https://github.com/gabriel2320/epis2/pull/16)

---

## Gate pre-tag

```bash
npm run quality:release
```

Evidencia: `reports/quality-release-rc3.log` · CI master [27613893124](https://github.com/gabriel2320/epis2/actions/runs/27613893124) ✓ · local `npm run check` + web build ✓ (format:check local Windows CRLF — no bloqueante)

---

## Pendiente post-rc3

- Revisión legal [`DISCLAIMER.md`](../DISCLAIMER.md)
- Promover Gitleaks/CodeQL a blocking (programa futuro)
- `actions/setup-node@v6` solo si RH dedicado

---

*Demo sintética — no uso clínico real.*
