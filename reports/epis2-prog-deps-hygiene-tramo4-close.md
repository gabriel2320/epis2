# Tramo 4 — PROG-DEPS-HYGIENE · cierre (MF-DEP-01)

**Fecha:** 2026-06-11 · **Programa:** PROG-POST-RC3 · **Tag base:** `v0.1-demo-rc3`

---

## Alcance MF-DEP-01

Triage Dependabot sin merge de majors de riesgo · ignores persistentes · documentación.

| Entrega | Ruta |
|---------|------|
| Triage matrix | `docs/product/EPIS2_DEPENDABOT_TRIAGE.md` |
| Ignores | `.github/dependabot.yml` |
| Gate | `quality:deps-hygiene-gate` |

---

## Decisiones PR

| PR | Decisión |
|----|----------|
| #5 zod 4 | IGNORE major · PROG-ZOD4-MIGRATION |
| #17 @types/node 25 | IGNORE · engines `<25` |
| #13 checkout v6 | Defer · ignore major en dependabot.yml |
| #1–3 devDeps | Defer · sesión dedicada + quality:required |

**dependency-review:** sigue report-only (RH-04) hasta Tramo 5.

---

## Verificación

```bash
npm run quality:deps-hygiene-gate
npm run quality:fast
```

---

## Próximo tramo

**Tramo 5 — PROG-SECURITY-PROMOTE:** RH-09 Gitleaks blocking · RH-10 CodeQL · RH-11 dependency-review.

Plan: [`epis2-audit-plan-post-rc3-2026.md`](epis2-audit-plan-post-rc3-2026.md)
