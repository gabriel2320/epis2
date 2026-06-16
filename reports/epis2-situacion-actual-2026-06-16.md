# EPIS2 — Informe de situación actual

**Fecha:** 2026-06-16 · **HEAD `master`:** `c8d0efc` · **Congelamiento:** vigente

Canon: [`docs/EPIS2_CURRENT_STATE.md`](../docs/EPIS2_CURRENT_STATE.md) · [`docs/product/EPIS2_TABLERO.md`](../docs/product/EPIS2_TABLERO.md) (índice humano, no planificar)

---

## 1. Resumen ejecutivo

Dos programas convergieron en `master` el 2026-06-16:

| Programa | PR | Estado |
|----------|-----|--------|
| **PROG-UX-LAB** (Tramos A–D) | #29–#31, #33 | ✓ Código mergeado · **PASS WITH FIXES** |
| **PROG discipline post-RC3** (AT, CL, DS, SD) | #32 | ✓ Mergeado · script diet **170→18** |

**CI:** `required` + `e2e-dual-chart` verdes en merges finales (#32, #33).

**Veredicto global:** base demo consolidada; **GO producto** pendiente de walkthrough humano Modo A (Ollama off) y gate compuesto UX-LAB vía catálogo.

**Tag demo vigente:** `v0.1-demo-rc3` · `rc4` diferido hasta signoff humano.

---

## 2. Historial reciente en `master`

```text
c8d0efc  PROG discipline post-rc3 (#32)
903a344  docs: cierre UX-LAB post-merge #33
c2a328e  PROG-UX-LAB Tramo D (#33)
8a25569  MF-UXLAB-02 papel + chrome (#31)
e7d36ae  MF-UXLAB-01 censo narrativo (#30)
dd129b4  MF-UXLAB-00 baseline (#29)
```

**PRs abiertos:** solo Dependabot (#20–#25). Sin PRs de producto pendientes.

---

## 3. PROG-UX-LAB

Plan: [`EPIS2_UX_LAB_MODERN_PLAN.md`](../docs/quality/EPIS2_UX_LAB_MODERN_PLAN.md)

| Tramo | MF | Entregable | PR |
|-------|-----|------------|-----|
| A | MF-UXLAB-00 | Baseline + charter | #29 |
| B | MF-UXLAB-01 | Shift Context Strip + censo narrativo | #30 |
| C | MF-UXLAB-02 | Watermark papel + trust ladder | #31, #33 |
| D | MF-UXLAB-03 | Reportes corrida/cierre | #33 |

### Código destacado

- Censo: `ShiftContextStrip`, grid narrativo, fixtures DEMO
- Papel: `PaperDocumentWatermark`, `EpisDraftStatus` en chrome
- Trust ladder: `EpisDemoBadgeChip` + `EpisDraftStatus` en `PatientIdentityBand`; `EpisAiDegradedChip` (Modo A, IA off)
- E2E: `ux-lab-census`, `dual-chart-modes` (watermark, g6, g2b)

### Veredicto UX-LAB

| Criterio GO | Estado |
|-------------|--------|
| Modo A automatizado | ✓ |
| 0 UX-BLOCKER | ✓ (automatizado) |
| DEMO visible | ✓ |
| Borrador/aprobado inequívoco | ◐ walkthrough humano |
| Ollama off no bloquea | ✓ |
| Gates hard completos | ◐ ver §5 |

Reportes: [`epis2-ux-lab-close-2026-06-11.md`](./epis2-ux-lab-close-2026-06-11.md) · [`epis2-ux-lab-run-2026-06-11.md`](./epis2-ux-lab-run-2026-06-11.md)

---

## 4. PROG discipline post-RC3 (#32)

| Subprograma | Entrega |
|-------------|---------|
| **AT** Agent Truth | `AGENTS.md` v2, archive v1, `quality:agent-truth-gate` |
| **CL** Core/Labs FW | `core-labs-boundary.mjs`, gate imports labs |
| **DS** Demo Safety | `EpisDemoEnvironmentBanner`, `PrintDemoWatermark` |
| **SD** Script Diet 3 | Root **18 scripts**, `tool:script`, archive 153 scripts |

### Root scripts (18)

`build` · `build:ci-fixtures-chain` · `check` · `test` · `test:e2e` · `db:migrate` · `db:validate` · `stack:dev` · `dev:web` · `dev:session` · `dev:agent:close` · `dev:rapid` · `quality:fast` · `quality:clinical` · `quality:required` · `quality:release` · `quality:gate` · `tool:script`

### Aliases legacy (solo catálogo)

- `quality:ui` → `quality:ui-simplify-gate`
- `quality:ai` → sh-03-degrade + ai-client + web-ai-boundary

`validate-ficha-first-gate` y `validate-quality-aliases-gate` validan catálogo, no root `package.json`.

Reportes: [`epis2-prog-script-diet-3-close-2026-06-16.md`](./epis2-prog-script-diet-3-close-2026-06-16.md) · [`epis2-prog-agent-truth-close-2026-06-16.md`](./epis2-prog-agent-truth-close-2026-06-16.md)

---

## 5. Gates y CI

### `required` (PR)

```bash
npm run check
npm run test
npm run db:validate
npm run quality:gate -- quality:ficha-first-gate
npx prettier --check .
```

Job paralelo: **e2e-dual-chart** (22 tests).

### Local

```bash
npm run stack:dev
npm run quality:fast
npm run quality:required
npm run quality:gate -- quality:root-script-surface-gate
```

### Brecha: `quality:ux-lab-close`

Existía en root en PR #33; script diet (#32) lo eliminó. **No está en `catalog-full.json`.** Cierre UX-LAB vía cadena manual:

```bash
npm run quality:gate -- quality:security-promote-gate
npm run quality:gate -- quality:golden-journey
npm run quality:gate -- quality:ux-pilot
npm run quality:gate -- quality:m3-human-pilot
```

**Próximo fix recomendado:** alias `quality:ux-lab-close` en catálogo (no en root).

---

## 6. Invariantes producto

| Invariante | Estado |
|------------|--------|
| Home = Centro de Comando | ✓ |
| PostgreSQL = SoT | ✓ |
| Borradores ≠ aprobados · IA no firma | ✓ |
| Un command registry | ✓ |
| Sin import EPIS sin manifest | ✓ |
| Congelamiento clínico | ✓ |

---

## 7. Riesgos

| ID | Severidad | Descripción |
|----|-----------|-------------|
| R-01 | Media | Walkthrough Modo A no ejecutado |
| R-02 | Baja | `quality:ux-lab-close` ausente del catálogo |
| R-03 | Baja | Dependabot PRs #20–#25 sin revisar |
| R-04 | Info | Tag `rc4` diferido hasta signoff |

---

## 8. Próximos pasos

1. Walkthrough Modo A — [`epis2-ux-lab-run-TEMPLATE.md`](./epis2-ux-lab-run-TEMPLATE.md)
2. Nielsen 3–5 revisores
3. Añadir `quality:ux-lab-close` a `catalog-full.json`
4. Ejecutar gates cierre UX-LAB
5. Actualizar veredicto → **GO** si 0 UX-BLOCKER
6. Tag `v0.1-demo-rc4` tras signoff explícito
7. PROG-DISCIPLINE-CLOSE — brújula v1.4 + archivo reports

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
