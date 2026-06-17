# CICA-SG — implementación scoring en código

**Tramo:** Post MF-AEST-04 · **Fecha:** 2026-06-11  
**Canon:** [`docs/design/EPIS2_CICA_SCREEN_GOVERNOR.md`](../docs/design/EPIS2_CICA_SCREEN_GOVERNOR.md)

---

## Entrega

| Artefacto | Ruta |
|-----------|------|
| Tipos | `packages/epis2-ui/src/screen-governor/cicaScreenTypes.ts` |
| Admission Score | `packages/epis2-ui/src/screen-governor/cicaScreenScoring.ts` |
| Gobernador | `packages/epis2-ui/src/screen-governor/cicaScreenGovernor.ts` |
| Tests (10 casos) | `packages/epis2-ui/src/screen-governor/cicaScreenGovernor.test.ts` |
| Gate | `scripts/quality/validate-cica-screen-governor-gate.mjs` |

API pública (re-export `@epis2/epis2-ui` layout/clinical):

- `proposeEpisScreen(proposal)` → `{ verdict, container, admissionScore, reuseScreenId, screenDefinition? }`
- `calculateAdmissionScore(proposal)`
- `inferLayoutProfile(container, proposal)`

Duplicados derivados de `EPIS2_FORM_SCREEN_TREE` — sin registry paralelo.

---

## Gates

```bash
npm run quality:gate -- quality:cica-screen-governor-gate
npm run quality:gate -- quality:aesthetic-reset-close
```

---

## Uso agente

1. Completar `reports/cica-sg/<slug>.md` desde `_TEMPLATE.md`
2. Mapear campos → `ScreenNeedProposal`
3. Llamar `proposeEpisScreen()` · pegar JSON en §17 del ledger
4. Humano aprueba antes de CICA-L / código

---

## Veredicto

**GO** — CICA-SG L1 operativo · CICA-L loop cerrado · audit post-implementación sigue en `auditCicaScreen()`.

---

## Próximo paso

```text
quality:ux-lab-close + rc4 (stack completo)
Capturas humanas reports/cica-l/SCREENSHOTS.md
```
