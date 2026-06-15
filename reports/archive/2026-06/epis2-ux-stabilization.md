# EPIS2 — Plan A: Estabilización UX y documentación

**Fecha:** 2026-06-05  
**Alcance:** cierre ola UI post-`2f4203e`, modo oscuro en clínico/tablero, sync docs.

---

## Entregables

### A1 — Piloto visual (checklist)

| Pantalla | Verificación |
|----------|--------------|
| `/comando` | Chips con frase completa (`sampleEs`); toggle tema; sin ellipsis en sugerencias |
| `/espacio/ficha` | Acciones rápidas multilínea; `ClinicalPageNav` al pie |
| `/espacio/receta` | Campos ampliados (cantidad, indicaciones); nav vuelta ficha/comando |
| `/espacio/borrador/$id` | Revisión, continuar edición, volver a ficha |
| `/epis2/dashboard` | Tabs Mi trabajo / Paciente / Servicio; volver al Comando |

**Callejones:** cubiertos en sesión anterior (`ClinicalPageNav`, estados error con retry, `needs_patient` con CTAs).

### A2 — Modo oscuro

| Cambio | Archivo |
|--------|---------|
| Campos `OutlinedInput` usan `background.paper` (sin azul hardcodeado) | `packages/epis2-ui/src/theme/components.ts` |
| Toggle tema en shell clínico | `apps/web/src/layouts/ClinicalShellLayout.tsx` |
| Toggle tema en Modo tablero | `packages/epis2-ui/src/dashboard/EpisDashboardShell.tsx` |
| Badge DEMO adaptable a dark | `apps/web/src/components/ActivePatientBanner.tsx` |
| Test regresión dark inputs | `create-epis2-theme.dark.test.ts` |

### A3 — Sync documentación

| Documento | Actualización |
|-----------|---------------|
| `README.md` | 210+ tests, Plan A ✓, próximo WIDGET-01/V1 |
| `docs/ROADMAP.md` | Tabla frontera actual |
| `docs/SCOPE_V1.md` | Addendum 11 blueprints / slices demo |
| `docs/product/EPIS2_RELEASE_ROADMAP.md` | Estado repo + prioridades P1/P2 |
| `docs/product/EPIS2_COMPLETE_CAPABILITY_MAP.md` | Matriz ○/◐/✓ alineada a slices |
| `AGENTS.md` | Frontera para agentes |

### A4 — Capability map

Timeline, documentos, alergias, HL7 staging y navegación clínica actualizados según código actual.

---

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK — 14/14 architecture |
| `npm run test` | OK — 201 passed (211 con `DATABASE_URL`) |
| `npm run db:validate` | OK — 18 migraciones |

---

## Riesgos

| Riesgo | Mitigación |
|--------|------------|
| Chips largos ocupan más altura en Comando | `flexWrap` + multilínea ya activos |
| Modo oscuro no revisado en Login | Toggle disponible en Comando; preferencia persiste vía `localStorage` |
| Slices demo fuera de SCOPE_V1 original | Addendum explícito en `SCOPE_V1.md` |

---

## Próximo paso

**Plan B — WIDGET-01:** montar 2 widgets demo en Centro de Comando y ficha con `resolveWidgetVisibility`.

---

## Frase guía

> Los errores de EPIS no son recuerdos: son gates de EPIS2.
