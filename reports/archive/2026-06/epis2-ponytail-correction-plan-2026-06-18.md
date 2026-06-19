# EPIS2 — Plan de corrección Ponytail (sin dañar producto)

**Versión:** 1.0 · **Fecha:** 2026-06-18  
**Programa:** `PROG-PONYTAIL-TRIM` (nuevo, subordinado a `PROG-PURGE-CICA`)  
**Regla guía:** `.cursor/rules/55-ponytail-clinico.mdc` · Canon: `PRODUCT_INVARIANTS.md`

> **Tesis:** Reducir superficie inflada **sin tocar contratos clínicos, sin borrar legacy runtime**, sin mega-PR.  
> *El mejor código es el que no fue necesario escribir — pero los gates que protegen pacientes no se escriben de menos.*

**Brújula:** [`EPIS2_PURGE_ARCHIVE_PLAN.md`](../docs/product/EPIS2_PURGE_ARCHIVE_PLAN.md) · [`GOLDEN_CLINICAL_JOURNEY.md`](../docs/quality/GOLDEN_CLINICAL_JOURNEY.md)

---

## 1. Objetivo y límites

### Objetivo

Bajar inflación estructural identificada en auditoría Ponytail (2026-06-18):

- Duplicación CICA/legacy en UI (nav, búsqueda, tabs, pages finas)
- Registries triplicados (screen + blueprint + router)
- Gates operacionales de MF/tramos cerrados
- Wrappers passthrough y código muerto

### Intocable (detenerse si la MF lo toca sin autorización)

| Área | Razón |
|------|--------|
| Invariantes #1–#18 | `PRODUCT_INVARIANTS.md` |
| Borrador → aprobación humana, RLS, auditoría | `30-clinical-safety` |
| Un Command Registry + un Form Registry | #9–#10 |
| Golden clinical journey | E2E + gate producto |
| Legacy `/espacio/*` como fallback | `VITE_DISABLE_CICA_UI` + dual-chart E2E |
| PostgreSQL SoT, migraciones sin MF DB | ADR-001 |
| IA-last (IA no aprueba/firma) | `ai-write-boundary` |

### No es objetivo (esta ola)

- Sunset total de `/espacio/*`
- Fusionar CICA + legacy shell en un solo PR
- Borrar packages lexicon (recién cerrados PROG-LEXICON-CORE)
- Refactor masivo de `clinical/service.ts` (~3300 LOC)
- Reducir gates de seguridad clínica / registry-meta Chile

---

## 2. Principios de ejecución

1. **Un PR por microfase** — diff reviewable (<400 LOC neto salvo archive).
2. **Eliminar / archivar antes que reescribir** — mover gates tramo a `tools/gates/catalog.archived`.
3. **CICA crece; legacy no** — nuevas features solo en `/app/*`; legacy solo fixes + redirect.
4. **Registry SoT único por dominio** — pantalla CICA: `EPIS_CICA_SCREEN_REGISTRY`; no añadir cuarto mapa.
5. **Defer > stub con nav** — pantallas sin datos no aparecen en sidebar.
6. **Gate por MF** — ver tabla §4; cierre con reporte `reports/epis2-mf-pony-*-close.md`.
7. **Rollback** — cada MF reversible vía git revert; sin migraciones destructivas.

---

## 3. Fases (orden obligatorio)

```text
Fase 0 — Perímetro (doc + reglas)           ✓ parcial (55-ponytail-clinico)
Fase 1 — Basura segura (delete sin runtime)  bajo riesgo
Fase 2 — Defer stubs CICA                    bajo riesgo
Fase 3 — Collapse pages demo CICA            medio riesgo
Fase 4 — Consolidar listas/búsqueda          medio-alto (1 superficie)
Fase 5 — Registry-driven routes CICA         alto (programa)
Fase 6 — Nav/tabs unificados                 alto (post Fase 5)
Fase 7 — Gate prune operacional              medio (sin tocar clinical gates)
Fase 8 — Packages/fixtures (opcional)        bajo prioridad
```

**Regla de dependencia:** Fase N+1 no empieza hasta gate verde de Fase N en `main`.

---

## 4. Microfases

### MF-PONY-00 — Plan y métricas baseline ✓

| Campo | Valor |
|-------|--------|
| Entrega | Este documento |
| Allowlist | `reports/` |
| Gate | `npm run quality:fast` |
| Métricas baseline | ~30 `Cica*Page.tsx`; ~280 gate scripts; 2 patient search; 3 tab registries |

---

### MF-PONY-01 — Delete seguro (código muerto + passthrough)

**Riesgo:** bajo · **Duración:** 1 sesión

| Acción | Archivos candidatos |
|--------|---------------------|
| Borrar componentes sin referencias | `CicaPatientSectionPages.tsx`, rutas/docs huérfanas |
| Inline `CicaBlueprintPage` → import directo `CicaGeneratedScreen` | `CicaBlueprintPage.tsx` + call sites |
| Quitar exports muertos en blueprints | `stubPatientBlueprint` si gate lo permite |

| Allowlist | Prohibido |
|-----------|-----------|
| `apps/web/src/cica/CicaBlueprintPage.tsx`, `CicaPatientSectionPages.tsx`, imports | router, registry, legacy `/espacio` |

| Gate cierre |
|-------------|
| `npm run quality:fast` |
| `npm run quality:gate -- validate-cica-clean-room-close-gate` |
| `npm run test -w @epis2/web -- cica` (unit) |

**Criterio éxito:** −3 archivos mínimo; cero cambio de rutas visibles.

---

### MF-PONY-02 — Defer stubs sistema CICA

**Riesgo:** bajo · **Duración:** 1 sesión

| Acción | Detalle |
|--------|---------|
| Ocultar del sidebar | `/app/recientes`, `/app/mi-trabajo`, `/app/agenda` |
| Mantener rutas | Deep links y gates pueden seguir registrando screenId |
| Copy | Banner “próxima iteración” solo si URL directa |

| Allowlist | Prohibido |
|-----------|-----------|
| `cicaSidebarNav.ts`, `EPIS_CICA_SCREEN_REGISTRY.ts` (flag `navVisible: false`) | Borrar rutas; tocar legacy nav |

| Gate cierre |
|-------------|
| `validate-cica-clean-room-close-gate` |
| `cicaSidebarNav.test.ts` |
| E2E CICA smoke si existe |

**Criterio éxito:** Sidebar sin entradas vacías; golden journey intacto.

---

### MF-PONY-03 — Collapse secciones demo paciente

**Riesgo:** medio · **Duración:** 1–2 sesiones

| Acción | Detalle |
|--------|---------|
| Una ruta genérica | `CicaPatientDemoSectionPage` + param `sectionId` |
| Mapa config | En `patientScreens.blueprint.ts` o registry — **una** SoT |
| Borrar pages finas | `CicaPatientDischargePage`, `Procedures`, `Interconsultas`, `Medications`, `Audit` (5–7 archivos) |
| Router | Reemplazar N `createRoute` por 1 ruta parametrizada |

| Allowlist | Prohibido |
|-----------|-----------|
| `apps/web/src/cica/CicaPatientDemoSectionPage.tsx`, `patientScreens.blueprint.ts`, `router.tsx` (CICA patient section routes) | Formularios clínicos; API; resumen/evoluciones P0 |

| Gate cierre |
|-------------|
| `validate-cica-clean-room-close-gate` |
| `buildCicaBlueprintActions.test.ts` |
| `quality:clinical` |

**Criterio éxito:** −5+ archivos page; mismas URLs o redirects 301 internos documentados.

---

### MF-PONY-04 — Blueprint/registry dedup (layout trivial)

**Riesgo:** medio · **Duración:** 1 sesión

| Acción | Detalle |
|--------|---------|
| Fusionar blueprints triviales | `{ screenId, sections: [{ id, span: 12 }] }` → derivar de registry |
| Mantener blueprints ricos | action forms, paper, evolución (campos reales) |
| Actualizar gate | `validate-cica-screen-registry-gate` — una SoT |

| Allowlist | Prohibido |
|-----------|-----------|
| `EPIS_CICA_SCREEN_REGISTRY.ts`, `apps/web/src/cica/blueprints/patientScreens.blueprint.ts` | `clinical-forms` blueprints |

| Gate cierre |
|-------------|
| `validate-cica-screen-registry-gate` |
| `validate-cica-clean-room-close-gate` |

---

### MF-PONY-05 — Lista clínica + búsqueda (un componente)

**Riesgo:** medio-alto · **Duración:** 2 sesiones · **Pre-requisito:** MF-PONY-03

| Acción | Detalle |
|--------|---------|
| Extraer `EpisClinicalList` | De `CicaClinicalList` + `PatientSearchResults` |
| Un row mapper | `patientListRowMeta` compartido |
| CICA + legacy | Perfil visual via props/theme, misma lógica |

| Allowlist | Prohibido |
|-----------|-----------|
| `packages/epis2-ui/src/cica/CicaClinicalList.tsx`, `apps/web/src/components/patient-search/`, pages búsqueda | Borrar `PatientSearchScreen` hasta sunset legacy |

| Gate cierre |
|-------------|
| `validate-patient-search-layout-gate` |
| `quality:clinical` |
| `test:e2e:dual-chart` (legacy sigue con disable CICA) |
| E2E CICA búsqueda si aplica |

**Criterio éxito:** un list component; dos shells siguen funcionando.

---

### MF-PONY-06 — Registry-driven CICA routes (programa)

**Riesgo:** alto · **Duración:** 3+ sesiones · **Sub-MFs:** 06a generator, 06b migrate P1 screens, 06c tests

| Acción | Detalle |
|--------|---------|
| Generador rutas | `buildCicaRoutesFromRegistry(registry)` en router |
| Migrar pantallas P0/P1 | resumen, evoluciones, indicaciones, documentos, formularios |
| No migrar aún | dual-chart `/espacio/ficha` |

| Allowlist | Prohibido |
|-----------|-----------|
| `router.tsx`, `EPIS_CICA_SCREEN_REGISTRY.ts`, `buildCicaBlueprintActions.ts` | Legacy router tree |

| Gate cierre |
|-------------|
| Full CICA gate stack |
| `quality:golden-journey` |
| `test:e2e:week3` o equivalente CICA |

**Detenerse si:** `architecture:validate` falla o URL canónica cambia sin redirect.

---

### MF-PONY-07 — Nav/tabs unificados (programa)

**Riesgo:** alto · **Pre-requisito:** MF-PONY-06 estable

| Acción | Detalle |
|--------|---------|
| `ClinicalChartTabRegistry` único | IDs + label ES + route builder CICA + legacy adapter |
| Deprecar | `patientChartNavigation.ts` duplicado |
| Sidebar | `cicaSidebarNav` consume árbol compartido + prefijo `/app` |

| Allowlist | Prohibido |
|-----------|-----------|
| `packages/epis2-ui/src/cica/`, `apps/web/src/clinical/patientChartNavigation.ts`, `epis2NavigationTree.ts` | Eliminar legacy rail en este MF |

| Gate cierre |
|-------------|
| `validate-ficha-first-gate` |
| `validate-cica-clean-room-close-gate` |
| dual-chart + golden journey |

---

### MF-PONY-08 — Gate prune fase 2 (operacional)

**Riesgo:** medio · **Alineado con MF-CON-03**

| Acción | Detalle |
|--------|---------|
| Archivar gates tramo A–K audit | → `tools/gates/catalog.archived.json` |
| Componer dual-chart gates | 12 → 2 runners |
| Meta | <80 gates activos en `catalog-full.json` |

| Allowlist | Prohibido |
|-----------|-----------|
| `scripts/quality/validate-tramo-*-audit-gate.mjs`, `tools/gates/`, `validate-gates-prune-*` | Gates: human-approval, ai-write, registry-meta, golden-journey |

| Gate cierre |
|-------------|
| `validate-gates-prune-phase2-gate` |
| `npm run quality:required` |

---

### MF-PONY-09 — Opcional: fixtures + widgets (backlog)

| Acción | Cuándo |
|--------|--------|
| DEMO/SIM fixture merge | Solo si MF test autorizada |
| `epis2-widgets` → `epis2-ui` | Solo si sin consumidores externos |
| Passthrough `EpisTextField` etc. | Solo si design-system acuerda contrato |

**Prioridad:** baja — no bloquear Fases 1–7.

---

## 5. Matriz de riesgo por fase

| MF | Riesgo producto | Riesgo clínico | Reversible | PRs |
|----|-----------------|----------------|------------|-----|
| PONY-01 | Muy bajo | Ninguno | Sí | 1 |
| PONY-02 | Bajo | Ninguno | Sí | 1 |
| PONY-03 | Medio | Bajo (solo demo UI) | Sí | 1 |
| PONY-04 | Medio | Ninguno | Sí | 1 |
| PONY-05 | Medio-alto | Bajo | Sí | 1–2 |
| PONY-06 | Alto | Medio | Parcial | 3+ |
| PONY-07 | Alto | Medio | Parcial | 2+ |
| PONY-08 | Medio | Ninguno* | Sí | 1–2 |

\*Si se archiva un gate aún referenciado en CI → rompe pipeline. Verificar `catalog-full.json` antes de merge.

---

## 6. Checklist pre-merge (todas las MFs)

```bash
npm run quality:fast          # iteración
npm run check                 # pre-PR
npm run test                  # pre-PR (según alcance MF)
npm run architecture:validate # obligatorio si toca router/registry
```

Adicional si toca rutas CICA/home:

```bash
npm run quality:gate -- validate-cica-clean-room-close-gate
npm run quality:gate -- validate-login-command-home-gate
```

Adicional si toca legacy/dual-chart:

```bash
# CI ya usa VITE_DISABLE_CICA_UI=true en e2e-dual-chart
npm run test:e2e:dual-chart -w @epis2/web  # pre-PR manual opcional
```

---

## 7. Qué evitamos construir (contabilidad Ponytail)

| MF | Archivos no creados (objetivo acumulado) |
|----|------------------------------------------|
| PONY-03 | −5..7 `CicaPatient*Page.tsx` por cada nueva sección demo |
| PONY-04 | −~8 blueprint consts triviales |
| PONY-05 | −1 lista duplicada permanente |
| PONY-06 | −1 page + 1 route manual por pantalla CICA nueva |
| PONY-07 | −1 tab registry manual sync |
| PONY-08 | −~20 gate scripts activos |

---

## 8. Relación con programas existentes

| Programa | Relación |
|----------|----------|
| **PROG-PURGE-CICA** | Ponytail ejecuta recorte **dentro** de zona activa CICA; PURGE archiva, Ponytail consolida |
| **PROG-EPIS2-LEXICON-CORE** | Cerrado — no fusionar packages en PONY-09 sin MF lexicon |
| **PROG-CONSOLIDATE-2 / MF-CON-03** | PONY-08 continúa gate prune |
| **CONSOLIDATION_FREEZE** | Respetado — no mega-PR cross-cutting |

---

## 9. Próximo paso recomendado

**Ejecutar MF-PONY-01** en la próxima sesión UI:

- Alcance acotado, cero cambio de UX visible
- Valida pipeline CICA gates
- Entrega reporte `reports/epis2-mf-pony-01-close.md`

Comando arranque:

```bash
npm run dev:session
# Adjuntar brief + declarar: MF-PONY-01 · allowlist §4 · @55-ponytail-clinico
```

---

## 10. Frase guía

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*  
*La inflación CICA no es legacy: es código escrito antes de preguntar «¿debe existir ahora?»*
