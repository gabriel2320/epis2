# MF-DI-09 — Microjourneys post-acción

**Fecha cierre:** 2026-06-11 · **Programa:** PROG-DETERMINISTIC-INTELLIGENCE-2026  
**Gate:** `npm run quality:di-journeys-gate` ✓ · `npm run check` ✓

---

## Alcance

Acciones determinísticas sugeridas tras guardar borrador + validaciones admin RUT/previsión en formularios generados.

## Entregables

| Artefacto | Descripción |
|-----------|-------------|
| `postSaveMicrojourneys.ts` | Resolver por blueprint (receta, evolución, lab) |
| `chileAdminValidators.ts` | RUT + previsión FONASA/ISAPRE |
| `PostSaveMicrojourneyPanel.tsx` | UI «Siguiente paso sugerido» |
| `validateGeneratedFormAdmin.ts` | Hook admin en búsqueda paciente |
| `GeneratedClinicalFormPage` | Integración post-guardado |
| E2E `g6` | Smoke microjourney receta |
| `quality:di-journeys-gate` | Gate MF-DI-09 |

## Flujos

| Tras guardar | Acciones sugeridas |
|--------------|-------------------|
| Receta | Imprimir · Ver historial |
| Evolución | Crear receta asociada |
| Laboratorio | Panel frecuente por diagnóstico crónico |

## Gates

```bash
npm run quality:di-journeys-gate
npm run check
```

## Próximo paso

**MF-DI-10** — Signoff inteligencia determinística (`quality:di-signoff-gate`).

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
