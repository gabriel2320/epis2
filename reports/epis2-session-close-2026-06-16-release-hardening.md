# Cierre sesión — PROG-RELEASE-HARDENING RH-01…08

**Fecha:** 2026-06-16 · **Rama:** `master` @ `1cee041`  
**Programa:** PROG-RELEASE-HARDENING · **Base:** `v0.1-demo-rc2`

---

## Alcance

Cerrar tramo 1 de release hardening: CI Node 24, workflows security report-only, auth fail-closed deployed, gate `quality:release`, bridge web fixtures (RH-06), gobierno pre-merge PR #15.

---

## Entregas mergeadas

| PR | RH | Entrega |
|----|-----|---------|
| [#15](https://github.com/gabriel2320/epis2/pull/15) | RH-01…05, RH-07, RH-08 | Node 24 · Actions v5 · CodeQL/Gitleaks/deps/SBOM report-only · auth fail-closed · `quality:release` · `security:no-bidi` |
| [#16](https://github.com/gabriel2320/epis2/pull/16) | RH-06 | Web `devFixturesBridge` · gate `no-test-fixtures-in-prod` web · `VITE_EPIS2_LOAD_DEV_FIXTURES` CI preview |
| [#14](https://github.com/gabriel2320/epis2/pull/14) | — | Cerrado superseded (Dependabot setup-node v6) |

Evidencia: [`epis2-prog-release-hardening-rh01-08.md`](./epis2-prog-release-hardening-rh01-08.md) · [`epis2-prog-release-hardening-rh06-web.md`](./epis2-prog-release-hardening-rh06-web.md)

---

## Gates sesión

| Gate | Resultado |
|------|-----------|
| PR #15 `required` + `e2e-dual-chart` | ✓ |
| PR #16 `required` + `e2e-dual-chart` (21 tests) | ✓ |
| `npm run security:no-bidi` | ✓ (2195 archivos texto) |
| `npm run quality:fast` (RH-06 local) | ✓ |
| Human review PR #15 | ✓ comentario + labels |

---

## Decisiones

- Unicode bidi en PR #15: ellipsis `…` en título/commit — no trojan; gate `security:no-bidi` añadido.
- RH-06 fuera de #15; PR #14 Dependabot no mezclado con RH-06.
- Fixtures web en prod: dynamic import solo con `DEV` o `VITE_EPIS2_LOAD_DEV_FIXTURES` (CI e2e).

---

## Riesgos

- Workflows RH-02…05 siguen report-only (no bloquean merge).
- `dependency-review` falla por diseño hasta alinear deps.
- Tag `v0.1-demo-rc3` no creado aún.
- Revisión legal [`DISCLAIMER.md`](../docs/DISCLAIMER.md) pendiente.

---

## Próximo paso exacto (mañana)

1. Opcional: tag **`v0.1-demo-rc3`** tras `npm run quality:release` local.
2. Revisión legal `DISCLAIMER.md`.
3. Decidir promoción Gitleaks/CodeQL a blocking o RH setup-node v6 aparte.
4. Arrancar sesión: `npm run stack:dev` · `npm run dev:session` · `@reports/dev-agent-brief.md`.

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
