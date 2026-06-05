# EPIS2 — Sesión P0 auditoría (Drizzle + CI Postgres)

**Fecha:** 2026-06-05 · **Commit:** pendiente push

---

## Alcance

1. Upgrade `drizzle-orm` ≥ 0.45.2 (CVE GHSA-gpj5-g38j-94v9)
2. Postgres en CI + `quality:golden-journey`

---

## Cambios

| Archivo | Cambio |
|---------|--------|
| `apps/api/package.json` | `drizzle-orm` ^0.45.2 |
| `package-lock.json` | lock actualizado |
| `.github/workflows/ci.yml` | servicio Postgres 16, `DATABASE_URL`, `db:migrate`, `quality:golden-journey` |

---

## Gates (local con `DATABASE_URL`)

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK |
| `npm test` | **182 passed** (0 skipped) |
| `npm run quality:golden-journey` | 7 passed (spec + API) |
| `npm audit --omit=dev` | 0 vulnerabilities |

---

## Riesgos

- CI más lento (~+30s migrate + integración).
- `db:migrate` sigue sin tabla de control (re-aplica SQL en DB fresca — OK en CI).

---

## Próximo paso

Verificar CI verde en GitHub; opcional `qa:bundle-analyze` en pipeline.
