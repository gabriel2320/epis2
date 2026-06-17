# EPIS2 — Integración capas L3+L4+L5

**Fecha:** 2026-06-07  
**Alcance:** Conciliar planes, migrar tabs dashboard pendientes, meta-gate de integración.

---

## Alcance de sesión

| Área | Archivos |
|------|----------|
| Migración RAD | `IcuDashboardTab.tsx`, `SpecialtyDashboardTab.tsx`, `PatientDashboardTab.tsx` |
| Puente grids | `apps/web/src/grids/radBulkActions.ts`, `grids/index.ts` |
| Plan producto | `docs/product/EPIS2_GLOBAL_DEV_PLAN.md` v1.1 |
| Stack capas | `docs/product/EPIS2_UI_LAYERS.md` (nuevo) |
| Registry | `radScreenRegistry.ts` — icu, specialty, patient → `done` |
| Gate | `validate-layers-integration-gate.mjs` + script npm |

---

## Decisiones

1. **Stack unificado:** L3 (scaffold/densidad) → L4 (RAD shell, bulk, acordeón) → L5 (`ClinicalDataGrid` vía `EpisRadSelectableGrid`).
2. **UCI:** mapa camas en grid con bulk handover/epicrisis; 15+ paneles de monitoreo colapsados en acordeón `copy.workspaces.icu.rail.monitoring`.
3. **Especialidad:** partograma + comité oncológico visibles; resto de paneles gráficos en acordeón secundario.
4. **Paciente:** problemas activos y timeline en `DashboardHomogeneousGrid`; borradores/labs sin cambio de contrato.
5. **Tramo J:** sigue **bloqueado** — pharmacy tab permanece `partial`.

---

## Gates ejecutados

```bash
npm run check                    # OK
npm run db:validate              # OK
npm run quality:layers-integration-gate  # OK
npm run test                     # 500/529 OK — 29 fallos API integration (Postgres :5433 no disponible, preexistente)
```

---

## Riesgos

1. **Quality tab** aún `partial` — no incluido en cierre Fase A.
2. **Command palette global** (Ctrl+K) pendiente Fase B.
3. **`npm run test` completo** puede fallar sin Postgres `:5433` (integración API preexistente).

---

## Próximo paso exacto

1. Migrar `QualityDashboardTab` al patrón `EpisRadDashboardTabShell` + grids homogéneos.
2. Integrar `ClinicalCommandPalette` en `EpisAppScaffold` (Fase B productivity).
3. Re-ejecutar `quality:tramo-j-*` solo tras pharmacy `migration: done` y signoff UX-G02.

---

## Frase guía

> RAD decide cómo se trabaja; clinical-productivity decide con qué widgets; ninguna capa firma.
