# MF-FF-08 — Live templates en web

**Fecha cierre:** 2026-06-15 · **Programa:** PROG-FICHA-FIRST · **Wave:** 3  
**Gate:** `npm run quality:di-templates-gate` ✓ · `quality:clinical-productivity-gate` ✓

---

## Alcance

Materializar plantillas clínicas vivas (`@epis2/clinical-forms/live-templates`) en `GeneratedClinicalFormPage` con prefill desde contexto del paciente.

## Cambios

| Artefacto | Entrega |
|-----------|---------|
| `packages/clinical-forms/src/live-templates/definitions.ts` | +`ckd_renal_review`, +`insulin_hypo_review` (≥3 plantillas con `dm2_control`) |
| `resolveLiveTemplate.ts` | `buildLiveTemplatePrefill` extendido |
| `GeneratedClinicalFormPage.tsx` | Wiring `materializeLiveTemplateBlueprint`, chips `epis2-live-template-*` |
| `validate-di-templates-gate.mjs` | Exige ≥3 plantillas + wiring en form page |

## Próximo paso

**MF-FF-09** — Evolución diaria layout clínico.
