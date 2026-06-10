# EPIS2 — Hilo NORM · Tramo N1 (quick wins)

**Fecha:** 2026-06-10 · **Plan:** [`EPIS2_NORMA_FULLSTACK_PLAN.md`](../docs/product/EPIS2_NORMA_FULLSTACK_PLAN.md) · **Pendiente:** PEND-012

> Precondición cumplida: PEND-011 cerrado con CI verde
> ([run 27274610746](https://github.com/gabriel2320/epis2/actions/runs/27274610746)) — primer verde desde fase 2.

## Microfases

| MF | Alcance | Commit | Gate de cierre |
|----|---------|--------|----------------|
| MF-NORM-102 | `/health/live` + `/health/ready` (R-48); `/health` y `/ready` alias legacy | `eb759d5` | `app.test.ts` 4/4 ✓ |
| MF-NORM-105 | Paginación `GET /api/drafts`: `draftsListQuerySchema` (limit 50 def / 100 max, offset, coerción) + SQL `WHERE`/`ORDER BY updated_at DESC`/`LIMIT`/`OFFSET` (R-35) | `ce0bff5` | integración 55 drafts ✓ (default 50, página 2 sin solape, 400 fuera de rango) + 4 unit schema ✓ |
| MF-NORM-104 | Pin Node: `.nvmrc` = 20 (paridad CI), `engines >=20 <25`, nota en `EPIS2_DEV_VELOCITY.md` | `c5142a7` | `node -v` CI documentado |
| MF-NORM-103 | Prettier: devDep + `.prettierrc.json` + `.prettierignore` + `format`/`format:check` + paso CI | `c5142a7` + commit de formato aislado | `npm run format:check` ✓ |
| MF-NORM-101 | `apps/web/tsconfig.json` extiende `tsconfig.base.json` (gana `exactOptionalPropertyTypes`); ~94 errores TS corregidos en ~41 archivos (patrones: `prop?: X \| undefined` en tipos propios, spread condicional ante APIs externas) | (pendiente) | `typecheck -w @epis2/web` ✓ |

## Decisiones

- **Formateo masivo aislado:** `prettier --check .` reportó 1233 archivos; el `--write` va en un
  commit propio (sin lógica) y en el mismo push que el paso `format:check` de CI para no dejar CI rojo.
- **`reports/` y `docs/` excluidos de prettier** (`.prettierignore`): los documentos siguen su propio estilo.
- **`listDrafts` interno sin límite:** los llamadores internos (dashboard, inpatient) mantienen
  semántica completa; el límite por defecto aplica solo en la ruta HTTP.
- **Node `>=20 <25`:** CI fija 20; local con 24 sigue permitido (cota superior evita saltos no probados).

## Gates de cierre del tramo

| Gate | Resultado |
|------|-----------|
| `npm run check` | (completar) |
| `npm run test` | (completar) |
| `npm run test:e2e` (set CI) | (completar) |
| `npm run format:check` | (completar) |

## Próximo paso exacto

Tramo N2 (observabilidad): MF-NORM-201 `correlationId` + pino estructurado → 202 envelope de error → 203 OTel.
