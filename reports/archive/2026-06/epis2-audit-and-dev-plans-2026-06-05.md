# EPIS2 — Auditoría y planes de desarrollo pendientes

**Fecha:** 2026-06-05  
**Commit auditado:** `2f4203e` (`origin/master`)  
**Alcance:** estado del producto, gates, deuda documental, frontera V0–V5, planes ejecutables.

---

## 1. Resumen ejecutivo

| Área | Veredicto |
|------|-----------|
| Canon e invariantes (18) | **OK** — 14 gates arquitectónicos verdes |
| Calidad técnica | **OK** — `check` · **210 tests** · `db:validate` · golden journey |
| Gate V0 (piloto) | **OK** — GO DEMO (`reports/epis2-pilot-human-2026-06-05.md`) |
| Slices V1–V5 | **Parciales** — demo funcional; gates completos abiertos |
| UX reciente (tema plano + chips + formularios) | **Entregado** — sin gate humano post-cambio |
| Widgets contextuales | **WIDGET-00 ✓** · **WIDGET-01 pendiente** |
| Documentación vs código | **Deriva moderada** — README, roadmap producto, capability map |

**Veredicto global:** repositorio **maduro para demo técnica y piloto controlado**. La frontera productiva no es “implementar V0”, sino **cerrar slices**, **montar widgets**, **completar gates V1+** y **sincronizar documentación**.

---

## 2. Estado actual verificado

### 2.1 Fases técnicas EPIS2-NN

| Fase | Estado |
|------|--------|
| EPIS2-00 … EPIS2-12 | ✓ Completadas |
| MUI-01 … MUI-10 | ✓ Completadas |
| M3-00 … M3-09 | ✓ Completadas |
| WIDGET-00 | ✓ Fundación (`@epis2/epis2-widgets`) |
| UI post-M3 (tema plano monocromático, islas, chips, nav clínica) | ✓ Commit `2f4203e` |

### 2.2 Gates (sesión de auditoría)

```bash
npm run check                  # OK — architecture:validate 14/14
npm run test                   # OK — 210 passed
npm run db:validate            # OK — 18 migraciones
npm run quality:golden-journey # OK (con DATABASE_URL)
```

CI (`.github/workflows/ci.yml`): check + test + db:validate + golden-journey con Postgres 16.  
**No incluye:** `qa:bundle-analyze` (presupuesto bundle MUI X).

### 2.3 Versiones de producto (slices vs gate completo)

| Versión | Slice demo | Gate completo | Reporte |
|---------|------------|---------------|---------|
| **V0** | ✓ | ✓ GO DEMO | `epis2-pilot-human-2026-06-05.md` |
| **V1** Longitudinal | ✓ alergias, docs, timeline, interconsulta, imagenología | ○ RAG pgvector, OCR, PDF | `epis2-v1-longitudinal.md` |
| **V2** Hospitalización | ✓ censo, críticos, órdenes, tablero servicio | ○ ingreso, traslados, alta operativa E2E | `epis2-v2-inpatient.md` |
| **V3** Enfermería/farmacia | ✓ blueprints + MAR + validación farmacéutica | ○ tableros por rol, conciliación, MAR programado | `epis2-v3-nursing-pharmacy.md` |
| **V4** Interop/ops | ✓ staging read-only, HL7 validator, tablero calidad | ○ writeback, backups, admin UI | `epis2-v4-interop-ops.md` |
| **V5** IA trazable | ✓ RAG con citas, resumen 24h, `ai_runs` | ○ pgvector, evals, prompts versionados | `epis2-v5-ai-traceable.md` |

### 2.4 Formularios registrados (11 blueprints)

Más allá del límite documentado en `SCOPE_V1.md` (6 + búsqueda), el registry único incluye:

`patient_search`, `patient_summary`, `evolution_note`, `discharge_summary`, `prescription`, `lab_request`, `referral`, `imaging_request`, `nursing_note`, `medication_administration`, `pharmacy_validation`.

**Nota:** coherente con slices V1/V3; requiere actualizar `SCOPE_V1.md` o declarar “demo slices” explícitamente para evitar confusión con el MVP original.

---

## 3. Hallazgos de auditoría

### 3.1 Fortalezas

- Pipeline command-first completo: comando → intent → formulario → borrador → aprobación → auditoría.
- Un solo Command Registry y un solo Form Registry (gates automatizados).
- Golden journey API + spec + piloto humano GO DEMO.
- Integración API amplia (clínico, inpatient, FHIR, V4 ops, V5 IA, MAR).
- Tema M3 unificado; flujos clínicos con navegación (`ClinicalPageNav`).
- Fundación widgets sin violar home = Centro de Comando.

### 3.2 Brechas y deuda

| ID | Severidad | Hallazgo |
|----|-----------|----------|
| D1 | P1 | **WIDGET-01** no montado en web (registry existe, sin superficie en Comando/ficha). |
| D2 | P1 | **Revisión UX post-`2f4203e`**: chips multilínea, modo oscuro en formularios/tablero, journey visual no re-ejecutado. |
| D3 | P1 | **Golden journeys V1–V5** documentados pero no todos en CI como `quality:golden-journey` extendido. |
| D4 | P2 | **README** cita 182 tests; reales = 210. Próximo paso sigue “EPIS2-13” sin mencionar UI reciente ni WIDGET-01. |
| D5 | P2 | **`EPIS2_RELEASE_ROADMAP.md`** “siguiente fase EPIS2-12” obsoleto; slices V2–V5 no reflejados en tabla de fases. |
| D6 | P2 | **`EPIS2_COMPLETE_CAPABILITY_MAP.md`** varios ítems en ○ que ya son ◐/✓ (timeline, documentos, tablero servicio). |
| D7 | P2 | **`qa:bundle-analyze`** no falla CI si se excede presupuesto gzip. |
| D8 | P3 | Scheduler MUI X 9 alpha (peer MUI 7+) — solo `/dev/scheduler-spike`. |
| D9 | P3 | `mui-core` ~164 KB gzip — monitorear tras cambios de tema. |

### 3.3 Riesgos producto (sin violar invariantes)

| Riesgo | Mitigación |
|--------|------------|
| Confundir “mucho código” con “V1/V2 cerrados” | Gates por journey dorado + checklist humano por versión. |
| Widgets compiten con Comando | `resolveWidgetVisibility` + máx. 1–2 widgets esenciales en home. |
| Formularios extra fuera de SCOPE_V1 | Actualizar canon/scope o etiquetar “slice demo” en UI. |
| IA sin Ollama en demo | Mantener tests sin `dev:ai`; chip “Sin IA” visible. |

---

## 4. Planes de desarrollo pendientes

Regla: **una microfase por sesión**, gate al cierre, reporte en `reports/`, sin avanzar si `architecture:validate` falla.

---

### Plan A — Estabilización UX y documentación (1–2 sesiones)

**Objetivo:** Cerrar la ola UI `2f4203e` y alinear docs con el repo.

| # | Entregable | Criterio de aceptación |
|---|------------|------------------------|
| A1 | Piloto visual rápido | Checklist 15 min: Comando, ficha, receta, borrador, tablero — sin texto truncado ni callejones. |
| A2 | Modo oscuro | Revisión en formularios + tablero; contraste roles críticos OK. |
| A3 | Sync docs | README (210 tests), `ROADMAP.md`, `EPIS2_RELEASE_ROADMAP.md`, `SCOPE_V1.md` o addendum slices. |
| A4 | Capability map | Actualizar matriz ○/◐/✓ según slices entregados. |

**Gate:** `npm run check` + reporte `reports/epis2-ux-stabilization.md`.

**Dependencias:** ninguna.

---

### Plan B — WIDGET-01 Montaje contextual (2–3 sesiones)

**Objetivo:** Primer uso productivo del Widget Registry sin cambiar el home.

| # | Entregable | Ubicación |
|---|------------|-----------|
| B1 | Resolver contexto | `WidgetContext` desde sesión + paciente activo + pantalla (`command-center` \| `patient-chart`). |
| B2 | 2 widgets demo montados | Ej.: `patient-context-summary`, `pending-drafts-count` (fixtures → API ligera). |
| B3 | Superficie M3 | `Epis2WidgetSurface` en `CommandCenterPage` (colapsable) y `PatientWorkspacePage`. |
| B4 | Tests | Visibilidad: dashboard widgets **no** en `/comando`; forbidden sin permiso. |

**Gate:** `single-widget-registry` + `widget-registry-gates` + tests UI; home sigue `/comando`.

**Dependencias:** WIDGET-00 ✓.

**Referencia:** `docs/widgets/EPIS2_WIDGET_ARCHITECTURE.md`, `reports/epis2-widget-foundation.md`.

---

### Plan C — V1 completo: documentos e inteligencia longitudinal (4–6 sesiones)

**Objetivo:** Cerrar gate V1 ambulatorio demo.

| # | Entregable | Notas |
|---|------------|-------|
| C1 | Pipeline intake documentos | PDF/TXT/imagen → staging → `clinical_documents` (sin PHI real). |
| C2 | OCR opcional | Spike → servicio o worker; salida siempre borrador/metadata. |
| C3 | RAG pgvector | Embeddings en Postgres; citas obligatorias; sin sidecar SoT. |
| C4 | Export PDF / impresión | Epicrisis o resumen — frontera, no auto-firma. |
| C5 | Observaciones estructuradas | Signos vitales en modelo + timeline. |
| C6 | Journey CI | `golden-v1-longitudinal-review` automatizado en `quality:golden-journey`. |

**Gate V1:** Journey documentado en `EPIS2_GOLDEN_JOURNEYS.md` §3 completo + checklist humano.

**Dependencias:** Plan A (docs); legacy allowlist para intake/RAG (`epis-document-intake-ocr`, `epidos-rag-pgvector`).

---

### Plan D — V2 completo: hospitalización operativa (3–5 sesiones)

**Objetivo:** EPIS2-13 formal — flujo ingreso → órdenes → crítico → epicrisis → alta.

| # | Entregable | Notas |
|---|------------|-------|
| D1 | Ingreso hospitalario | Formulario/comando + admisión en BD. |
| D2 | Traslados de cama | API + UI mínima en tablero servicio. |
| D3 | Preparación de alta | Worklist + enlace epicrisis. |
| D4 | Alta operativa E2E | Journey `golden-v2-admission-discharge` ampliado. |
| D5 | Clinical actions (opcional) | `packages/clinical-actions` desde concepto EPIONE (cribado). |

**Gate V2:** Journey §4 completo con alta sintética auditada.

**Dependencias:** V0 ✓; slice V2 actual como base.

---

### Plan E — V3 completo: enfermería y farmacia (3–4 sesiones)

**Objetivo:** Multidisciplinario demo con tableros por rol.

| # | Entregable |
|---|------------|
| E1 | Tablero enfermería (Mi trabajo filtrado por rol nurse) |
| E2 | Tablero farmacia (validaciones pendientes) |
| E3 | MAR programado + ventanas horarias demo |
| E4 | Conciliación medicamentosa mínima (CDS/CDR) |
| E5 | IA assist ampliada a nursing/MAR/farmacia en `assistSchemas` |

**Gate V3:** Journey §5 + aprobación MAR con doble chequeo en CI.

**Dependencias:** Blueprints ya ampliados en `2f4203e`.

---

### Plan F — V4/V5 + hardening piloto (4+ sesiones)

**Objetivo:** Piloto interno read-only y IA avanzada trazable.

| Track | Entregables clave |
|-------|-------------------|
| **V4** | HL7 inbound staging controlado; catálogos; backups script; observabilidad API |
| **V5** | Prompts versionados; evals sintéticas; intent NL asistido (sin ejecutar) |
| **Hardening** | EPIS2-16: RLS diseño, auth real post-demo, rate limits, secretos |

**Gate V4:** `golden-v4-interop-ops` en CI + auditor sin escritura SoT.  
**Gate V5:** Ollama off = 100% journeys; Ollama on = `ai_runs` + citas en RAG.

---

### Plan G — Infraestructura y calidad continua (paralelo, bajo riesgo)

| # | Tarea | Prioridad |
|---|-------|-----------|
| G1 | Añadir `npm run qa:bundle-analyze` a CI con umbral gzip | P2 |
| G2 | Ampliar `quality:golden-journey` a V1/V2 smoke API | P2 |
| G3 | Dependabot / `npm audit` en CI | P3 |
| G4 | Documentar decisión Scheduler (LIC-007): Community lista+DatePicker vs Premium | P3 |

---

## 5. Orden recomendado de ejecución

```text
A (estabilización UX + docs)
  → B (WIDGET-01)
    → C (V1 completo)  ─┐
    → D (V2 completo)   ├─ pueden alternarse si hay dependencia de BD
    → E (V3 completo)  ─┘
      → F (V4/V5 + hardening)
G (CI bundle) en paralelo tras A
```

**Siguiente sesión sugerida:** **Plan A** (piloto visual post-UI + sync README/roadmap) **o Plan B** si la prioridad es widgets en Comando/ficha.

---

## 6. Criterios de “hecho” por plan

| Plan | Gate mínimo |
|------|-------------|
| A | Docs sincronizados + checklist UX sin bloqueos |
| B | 2 widgets visibles bajo demanda; forbidden OK |
| C | RAG+OCR+PDF demo + journey V1 CI |
| D | Alta hospitalaria sintética E2E |
| E | Tableros rol nurse/pharmacist |
| F | Piloto read-only signoff + IA trazable ampliada |
| G | CI falla si bundle excede presupuesto |

---

## 7. Fuera de alcance (recordatorio)

OpenMRS, Carbon, dashboard como home, auto-aprobación, PHI real, copia masiva EPIS, segundo registry, IA escribiendo finales.

---

## 8. Referencias

- `docs/product/EPIS2_RELEASE_ROADMAP.md`
- `docs/product/EPIS2_COMPLETE_CAPABILITY_MAP.md`
- `docs/quality/EPIS2_GOLDEN_JOURNEYS.md`
- `reports/epis2-project-audit-2026-06-05.md`
- `reports/epis2-chips-forms-completion.md`
- `reports/epis2-widget-foundation.md`

---

## Frase guía

> Los errores de EPIS no son recuerdos: son gates de EPIS2.
