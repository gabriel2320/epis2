# MF-DI-07 — Plantillas vivas condicionales

**Fecha cierre:** 2026-06-11 · **Programa:** PROG-DETERMINISTIC-INTELLIGENCE-2026  
**Gate:** `npm run quality:di-templates-gate` ✓ · `npm run check` ✓

---

## Alcance

Plantilla viva `dm2_control` sobre `evolution_note`: campos condicionales por comorbilidad (ERC → función renal; insulina → hipoglucemias). No se sugiere si falta diagnóstico DM2.

## Entregables

| Artefacto | Descripción |
|-----------|-------------|
| `comorbiditySignals.ts` | Señales DM2 / ERC / insulina desde resumen |
| `live-templates/definitions.ts` | Metadata plantilla `dm2_control` |
| `resolveLiveTemplate.ts` | `canSuggestLiveTemplate`, `materializeLiveTemplateBlueprint`, prefill |
| `types.ts` | `liveWhen` en `FormField` |
| `quality:di-templates-gate` | Gate MF-DI-07 |

## Reglas demo

| Condición | Campo visible |
|-----------|---------------|
| DM2 activa | Sugerible; SOAP base |
| ERC | `renalFunctionReview` |
| Insulina | `hypoglycemiaReview` |
| Sin DM2 | `canSuggestLiveTemplate` → false |

## Gates

```bash
npm run quality:di-templates-gate
npm run check
```

## Próximo paso

Integrar `materializeLiveTemplateBlueprint` en `GeneratedClinicalFormPage` al abrir evolución con slot control diabetes; continuar **MF-DI-08** (timeline).

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
