# EPIS2 — Sync avances repositorio (2026-06-10)

**Alcance:** pull `37f5a52..648e88d` · auditoría estado CI · actualización tablero/pendientes  
**HEAD:** `648e88d`

---

## Avances integrados desde remoto (13 commits)

| Bloque | Commits | Contenido |
|--------|---------|-----------|
| CI parity | `15b6131` | Sin doble vitest en `quality:ci-parity` (~1s en CI) |
| Cierre Hilo B | `3d2745e` `88ec444` | Ola 2 productividad cerrada · tablero sync |
| Impresión Ola 6A | `cd45630` `7f4c96b` `331fc07` | Receta A5 · epicrisis Carta (`PrintLetterDocument`) · lab/imagen A5 + registry `PRINTABLE_BLUEPRINTS` (PEND-006 código cerrado) |
| Auditoría fases 1–4 | `b27fdcd` `fb5ba23` `9b2b073` `f307066` | Higiene · robustez (transacción approveDraft, JWT rol) · pulido M3 · deuda estructural (`GeneratedClinicalFormPage` dividido) |
| Tema M3 | `d1fefa1` `deb55b3` `5c44a79` | Sesión documental F4 · alto contraste P1b · Hilo M3-R state layers |
| Housekeeping | `648e88d` | v4/v5 → `interop/`/`ai/` · gate `web-components-root-frozen` |

Ramas Dependabot nuevas: zod 4.4.3, jsdom, globals, types/node, plugin-react.

---

## Hallazgo crítico: CI rojo (PEND-011)

| Dato | Valor |
|------|-------|
| Rojo desde | Fase 2 `fb5ba23` — run [27229331034](https://github.com/gabriel2320/epis2/actions/runs/27229331034) |
| Último verde | [27228650107](https://github.com/gabriel2320/epis2/actions/runs/27228650107) (`b27fdcd` fase 1) |
| Runs rojos consecutivos | 7 (fases 2–4, print F1/F2, M3-R, housekeeping) |
| Specs que fallan | `ola6a-print-certificate` · `ola6a-print-discharge-summary` · `ola6a-print-orders` (lab + imagen) |
| Síntoma | `getByTestId('epis2-form-<blueprint>')` timeout 15s — la página de formulario no renderiza el form en CI |
| Contexto | Fase 2 añadió estos E2E a CI; nunca han estado verdes en CI. El testid vive en `EpisClinicalForm[Rhf]` (packages/epis2-ui), sigue existiendo; el fallo es de render/carga de la página en entorno CI, no de testid eliminado |

**Repro sugerida:**

```bash
npm run stack:dev
npx playwright test e2e/ola6a-print-certificate.spec.ts --headed
# o paridad completa:
EPIS2_LOCAL_CI_E2E=1 npm run quality:local-ci
```

---

## Documentos actualizados

- `docs/product/EPIS2_TABLERO.md` — HEAD `648e88d`, CI ❌ + P0 PEND-011
- `reports/archive/2026-06/epis2-pendientes-registro-2026-06-09.md` — PEND-011 nuevo (P0)

---

## Próximo paso

1. **P0:** investigar y arreglar E2E print en CI (PEND-011) — sesión `epis2-ci`
2. Tras verde: signoff visual P1 (alto contraste + M3-R)
3. Dependabot zod 4.x en PR aparte (PEND-007)
