# MF-DI-04 — Prefill contextual extendido (CE-6)

**Fecha cierre:** 2026-06-14 · **Programa:** PROG-DETERMINISTIC-INTELLIGENCE-2026  
**Gate:** `npm run quality:di-prefill-gate` ✓

---

## Alcance

Generalizar CE-4/CE-5 a receta crónica, laboratorio control DM2/HTA, certificado y evolución SOAP con motivo «control diabetes» — todo determinístico, borrador editable.

## Entregables

| Artefacto | Descripción |
|-----------|-------------|
| `chronic-control-prefill.ts` | Foco crónico DM2/HTA, panel labs, parseo medicación |
| `context-clinical-prefill.ts` | CE-6: prescription, lab_request, medical_certificate + evolución enriquecida |
| `command-slot-prefill.ts` | Subjetivo SOAP desde `clinicalReasonHint` |
| `command-registry/slots.ts` | `control diabetes`, panel DM2, renovar receta |
| `assist-route-phrases.ts` | Frases long-tail control diabetes / receta / lab |
| `GeneratedClinicalFormPage` | Prefill contexto + slots; badge borrador sugerido |

## Flujos demo

| Comando | Destino | Prefill |
|---------|---------|---------|
| `control diabetes` | Evolución SOAP | Subjetivo + assessment/plan desde resumen |
| `renovar receta cronica` | Receta | Metformina/dosis + duración 90 días |
| `solicitar panel control dm2` | Laboratorio | Panel HbA1c + bioquímica + motivo DM2 |

## Gates

```bash
npm run quality:di-prefill-gate
npm run check
```

## Próximo paso

**MF-DI-05** — Panel acciones probables en ficha (`npm run quality:di-next`).

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
