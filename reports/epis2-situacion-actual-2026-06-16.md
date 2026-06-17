# EPIS2 — Informe de situación actual

**Fecha:** 2026-06-16 · **HEAD `master`:** `9cf7d44` · **Congelamiento:** vigente (solo estética autorizada en tramo MF-AEST)

**Reconciliación remoto (2026-06-16):** PRs [#32](https://github.com/gabriel2320/epis2/pull/32)–[#35](https://github.com/gabriel2320/epis2/pull/35) **MERGED**. Script diet: **18** root scripts.

Canon: [`docs/EPIS2_CURRENT_STATE.md`](../docs/EPIS2_CURRENT_STATE.md) · [`docs/product/EPIS2_TABLERO.md`](../docs/product/EPIS2_TABLERO.md) (índice humano, no planificar)

---

## 1. Resumen ejecutivo

Dos programas convergieron en `master` el 2026-06-16:

| Programa | PR | Estado |
|----------|-----|--------|
| **PROG-UX-LAB** (Tramos A–D + Autopilot) | #29–#35 | ✓ Funcional · **PASS WITH FIXES** (estética pendiente) |
| **PROG discipline post-RC3** (AT, CL, DS, SD) | #32 | ✓ Mergeado · script diet **170→18** |

**CI:** `required` + `e2e-dual-chart` verdes en merges finales (#32–#34).

**Veredicto global:** **PASS WITH FIXES** — signoff humano Modo A **APROBADO** funcional · **rediseño estético pendiente** ([`epis2-ux-lab-human-signoff-2026-06-16.md`](./epis2-ux-lab-human-signoff-2026-06-16.md)) · `rc4` diferido.

**Tag demo vigente:** `v0.1-demo-rc3`

---

## 2. Historial reciente en `master`

```text
9cf7d44  chore(ux-lab): MF-UXLAB-04 autopilot + gate fixes (#35)
6533680  chore(ux-lab): register close gate after script diet (#34)
9da9e30  docs: informe situacion actual EPIS2 post UX-LAB y discipline
c8d0efc  PROG discipline post-rc3 (#32)
903a344  docs: cierre UX-LAB post-merge #33
c2a328e  PROG-UX-LAB Tramo D (#33)
8a25569  MF-UXLAB-02 papel + chrome (#31)
e7d36ae  MF-UXLAB-01 censo narrativo (#30)
dd129b4  MF-UXLAB-00 baseline (#29)
```

**PRs abiertos:** solo Dependabot (#20–#25). Sin PRs de producto UX-LAB/discipline pendientes.

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
| Borrador/aprobado inequívoco | ✓ autopilot (watermark + draft) |
| Ollama off no bloquea | ✓ |
| Gates hard completos | ◐ PR fix-only (E2E dual + m3 run-e2e + theme copy) |
| Walkthrough Modo A | ✓ Autopilot + **signoff humano APROBADO** |
| Estética Clinical Calm Premium | ◐ **rediseño pendiente** (MF-AEST) |

Reportes: [`epis2-ux-lab-close-2026-06-11.md`](./archive/2026-06/epis2-ux-lab-close-2026-06-11.md) · [`epis2-ux-lab-run-2026-06-11.md`](./archive/2026-06/epis2-ux-lab-run-2026-06-11.md)

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

### `quality:ux-lab-close` — registrado (#34)

Alias compuesto en `tools/gates/catalog-full.json` (no root). CI #34: `required` + `e2e-dual-chart` ✓.

```bash
npm run quality:gate -- quality:ux-lab-close
```

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
| R-01 | ~~Media~~ | ~~Walkthrough Modo A~~ ✓ signoff humano |
| R-05 | **Alta** | Rediseño estético MF-AEST — ver [`epis2-ux-lab-human-signoff-2026-06-16.md`](./epis2-ux-lab-human-signoff-2026-06-16.md) |
| R-02 | ~~Baja~~ | `quality:ux-lab-close` — mergeado #34 |
| R-03 | Baja | Dependabot PRs #20–#25 sin revisar |
| R-04 | Info | Tag `rc4` diferido hasta signoff |

---

## 8. Próximos pasos

1. ~~Walkthrough / signoff humano Modo A~~ ✓ APROBADO funcional
2. **Tramo MF-AEST** — Clinical Calm Premium ([`EPIS2_CLINICAL_CALM_PREMIUM_PLAN.md`](../docs/design/EPIS2_CLINICAL_CALM_PREMIUM_PLAN.md))
3. `npm run quality:gate -- quality:ux-lab-close` (corrida completa)
4. Tag `v0.1-demo-rc4` tras estética tramo 1 + gates verdes

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
