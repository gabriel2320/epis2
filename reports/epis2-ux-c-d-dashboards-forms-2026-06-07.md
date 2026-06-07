# EPIS2 — UX-C + UX-D (tableros planos + formularios UX-G03)

**Fecha:** 2026-06-07 · **Alcance:** `packages/epis2-ui`, `apps/web`, `packages/design-system`

---

## Objetivo

Completar las fases **UX-C** y **UX-D** del arco command-first: tableros Quality/ICU sin marcos anidados (LAYOUT-G12) y formularios con máximo 3 acciones visibles (UX-G03).

---

## UX-C — Tableros Quality / ICU

| Cambio | Detalle |
|--------|---------|
| `QualityDashboardTab` | 24× `Paper outlined` → `EpisWorkspaceSection` |
| `IcuDashboardTab` | 22× `Paper outlined` → `EpisWorkspaceSection` |
| Patrón | Métricas `EpisMetric` arriba + secciones planas (lista/tabla) |
| Script | `scripts/qa/flatten-dashboard-sections.mjs` (reutilizable) |

**Conservado:** todos los `data-testid` IDC, sentinel, bed-map, flowsheet, etc.

---

## UX-D — Formularios (UX-G03)

| Componente | Rol |
|------------|-----|
| `EpisClinicalFormActionBar` | **Guardar** · **Firmar** · **⋯** (overflow) |
| Copy | `forms.save`, `forms.sign`, `forms.moreActions`, `forms.draftSaved` |
| `GeneratedClinicalFormPage` | Barra unificada; FAB `EpisClinicalActionDock` retirado del scrollspy |
| Semántica | **Guardar** persiste y muestra estado; **Firmar** guarda y abre revisión humana |

**Overflow (⋯):** sugerencia IA (`epis2-ai-suggest`) y acciones secundarias futuras.

---

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK |
| `npm run test` | OK — **506** tests (+1 action bar) |
| `npm run db:validate` | OK |
| E2E UX-G02 | B + C1 PASS · A requiere API demo (`login HTTP 500` en entorno local) |

---

## Riesgos

- **Parte A E2E:** depende de API `:3001` + DB demo activos; no es regresión UI.
- **Tableros restantes** (Nursing, Service, etc.) siguen con `Paper` — fuera de alcance UX-C piloto.

---

## Próximo paso

| Fase | Contenido |
|------|-----------|
| **Vista 3** | Login gateway estético |
| **E2E UX-G02** | Parte A con API levantada |
| **Reporte CE-0→CE-5** | Consolidado tras validación humana |

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
