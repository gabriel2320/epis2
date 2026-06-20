# EPIS2 — PROG-DETERMINISTIC-INTELLIGENCE-2026

**Versión:** 1.0 · **Fecha:** 2026-06-14  
**Sistema:** [SDEPIS2](./EPIS2_DEV_SYSTEM.md) · **Ledger:** [`di-ledger.json`](../quality/di-ledger.json)  
**Prerrequisito:** PROG-EXPERIENCIA-CORE signoff ✓ (MF-PA-08 + MF-TE-08 + MF-CM-08)

> **Norte:** La ficha se siente inteligente **sin IA local** — contextual, anticipatoria, rápida, ordenada y clínicamente consciente.  
> **Frase guía:** *Muestra menos, anticipa mejor, reduce errores y deja terminar más rápido.*

---

## 1. Qué es (y qué no es)

| Es | No es |
|----|-------|
| Inteligencia de producto, reglas, diseño y flujo | Chatbot o copiloto que sustituye la ficha |
| Capas sobre Command Registry + Form Registry existentes | Segundo registry temporal |
| Prefill, ranking, sugerencias silenciosas, validaciones | Escritura directa en SoT |
| Funciona con Ollama apagado (invariante #15) | Dependencia de MF-IM-* para UX básica |
| Complemento de PROG-STRENGTHEN (paralelo intercalado) | Reemplazo de MF-SH / MF-IM |

**Metáfora:** la ficha como **secretario clínico** — recuerda contexto, reduce clics, anticipa lo probable, evita errores.

---

## 2. Relación con arquitectura EPIS2

No crear nueve microservicios «Engine». Extender artefactos canónicos:

```text
Capa propuesta              Implementación EPIS2
────────────────────────────────────────────────────────────
Context Engine              apps/api/src/clinical/service.ts
                            getPatientClinicalContext · alerts CDS/CDR
Command Registry            packages/command-registry (CE-0→CE-5 ✓)
Form Registry               packages/clinical-forms · GeneratedClinicalFormPage
Suggestion Engine           command-registry/rank · EpisCommandSuggestionCards
Clinical Rules Engine       packages/clinical-domain · MF-CU-* (STRENGTHEN)
Template Engine             blueprints + paper-chart · reglas en metadata
Timeline Engine             ficha hub / history (extender MF-DI-08)
Print Engine                PRINTABLE_BLUEPRINTS · modo papel (signoff ✓)
Audit Engine                audit events · MF-SH-01 draft trace ✓
```

**IA local (después):** capa superior — borradores, resúmenes, citas. Nunca firma ni escribe finales (invariantes #11–#13).

---

## 3. Mapa: visión → microfases

| # Visión | Tema | MF | Subprograma |
|----------|------|-----|-------------|
| §1 | Contexto clínico adaptativo | MF-DI-01 | PROG-DI-CONTEXT |
| §2 | Memoria operacional | MF-DI-02 | PROG-DI-MEMORY |
| §3 | Autocompletado determinístico | MF-DI-03 | PROG-DI-MEMORY |
| §4 | Barra clínica / comandos | — | **Hecho** (CE-0→CE-5, MF-CM-08) |
| §5 | Prellenado contextual | MF-DI-04 | PROG-DI-PREFILL |
| §6 | Sugerencias silenciosas | MF-DI-06 | PROG-DI-SUGGEST |
| §7 | Validaciones clínicas UX | MF-CU-01…04 | **STRENGTHEN** 2C |
| §8–§12 | Intención + ranking probable | MF-DI-05 | PROG-DI-SUGGEST |
| §9 | Timeline filtrable | MF-DI-08 | PROG-DI-TIMELINE |
| §10 | Plantillas vivas | MF-DI-07 | PROG-DI-TEMPLATES |
| §11 | Pantalla limpia | MF-DI-01, MF-TE-* | Parcialmente signoff |
| §13–§14 | Microjourneys + admin | MF-DI-09 | PROG-DI-JOURNEYS |
| §15 | IA después | MF-IM-* | **STRENGTHEN** 2B |
| — | Signoff capa determinística | MF-DI-10 | PROG-DI-CLOSE |

---

## 4. Subprogramas

| ID | Nombre | MF | Prioridad |
|----|--------|-----|-----------|
| PROG-DI-CONTEXT | Contexto denso en ficha | DI-01 | 1 |
| PROG-DI-PREFILL | Prefill contextual extendido | DI-04 | 2 |
| PROG-DI-SUGGEST | Acciones probables + chips silenciosos | DI-05, DI-06 | 3 |
| PROG-DI-MEMORY | Memoria operacional + ranking catálogo | DI-02, DI-03 | 4 |
| PROG-DI-TEMPLATES | Plantillas condicionales | DI-07 | 5 |
| PROG-DI-TIMELINE | Timeline clínico filtrable | DI-08 | 6 |
| PROG-DI-JOURNEYS | Microjourneys post-acción | DI-09 | 7 |
| PROG-DI-CLOSE | Signoff inteligencia determinística | DI-10 | 8 |

**Solapamiento con STRENGTHEN:** MF-CU-* cubre §7 (CDS hooks). MF-DI-06 comparte UI con CU-02; **no duplicar** componentes — DI-06 consume `ClinicalCdsCard` cuando CU-01 exista; hasta entonces usa alertas API actuales.

---

## 5. Microfases (detalle)

### MF-DI-01 — Contexto clínico denso en ficha

**Objetivo:** Al abrir paciente, la pantalla no es genérica — episodio, problemas activos, medicamentos, antigüedad de labs/exámenes, alergias siempre visibles.

| Campo | Valor |
|-------|-------|
| Depende | Signoff experiencia core |
| Gate | `quality:di-context-gate` |
| Paths | `apps/web/src/components/chart/**`, `EpisClinicalContextPane`, `apps/api/src/clinical/**` |
| Evidencia | E2E dual-chart · header persistente · copy temporal («HbA1c hace X meses») |
| Desbloquea | DI-04, DI-05 |

**Criterios aceptación (demo Juan Pérez):**
- Problemas activos HTA + DM2 visibles sin scroll.
- Última consulta y última HbA1c con antigüedad en lenguaje clínico.
- Medicamentos activos listados junto al contexto.

---

### MF-DI-02 — Memoria operacional por usuario

**Objetivo:** Última sección usada, formularios favoritos, pacientes recientes, plantillas por especialidad — prefs por usuario, no LLM.

| Campo | Valor |
|-------|-------|
| Depende | DI-01 |
| Gate | `db:validate` + tests prefs |
| Paths | migración prefs · `apps/api/src/user/**` · hooks web |
| Evidencia | RLS por usuario · restaurar sección al reabrir paciente |

---

### MF-DI-03 — Autocompletado con ranking de frecuencia

**Objetivo:** Medicamentos, diagnósticos, órdenes lab — búsqueda + ranking institucional + personal (post DI-02).

| Campo | Valor |
|-------|-------|
| Depende | DI-02 |
| Gate | unit tests ranking |
| Paths | `MedicationCatalogAutocomplete`, catálogos API, command-registry phrase hints |

---

### MF-DI-04 — Prefill contextual extendido (CE-6)

**Objetivo:** Generalizar patrón CE-4/CE-5 a receta crónica, laboratorio control DM2, certificados — matriz diagnóstico → campos sugeridos.

| Campo | Valor |
|-------|-------|
| Depende | DI-01 |
| Gate | E2E prefill (extiende UX-G02) |
| Paths | `GeneratedClinicalFormPage`, `commandFormSearch`, blueprints receta/lab |
| Evidencia | Comando `control diabetes` → SOAP + motivo + diagnósticos + badge prefill |

---

### MF-DI-05 — Panel acciones probables

**Objetivo:** 3–5 acciones ranked al abrir ficha (sin escribir en barra) — matriz ambulatorio / hospitalizado / urgencia.

| Campo | Valor |
|-------|-------|
| Depende | DI-01 |
| Gate | `quality:di-suggestions-gate` |
| Paths | `EpisCommandSuggestionCards`, `rankCommandDefinitions`, ficha hub |
| Evidencia | Demo: [Evolución SOAP] [Renovar receta] [Lab control DM2] según contexto |

---

### MF-DI-06 — Sugerencias silenciosas (chips)

**Objetivo:** Pistas no invasivas — receta por vencer, examen pendiente, alergia, PA elevada. Máximo N visibles; resto colapsable (invariante #8).

| Campo | Valor |
|-------|-------|
| Depende | DI-05 · preferible MF-CU-01 |
| Gate | `quality:di-suggestions-gate` |
| Paths | `apps/web/src/components/cds/**`, `usePatientClinicalAlerts` |
| Evidencia | Sin pop-ups modales · chips en context pane |

---

### MF-DI-07 — Plantillas vivas condicionales

**Objetivo:** Blueprint control diabetes muestra campos según comorbilidades (ERC → función renal; insulina → hipoglucemias).

| Campo | Valor |
|-------|-------|
| Depende | DI-04 |
| Gate | tests blueprint rules |
| Paths | `packages/clinical-forms/**`, norm metadata |
| Evidencia | Plantilla DM sin diabetes activa → no sugerida |

---

### MF-DI-08 — Timeline clínico filtrable

**Objetivo:** Historia como línea útil con filtros (labs, firmados, hospitalizaciones, evoluciones).

| Campo | Valor |
|-------|-------|
| Depende | DI-01 |
| Gate | E2E timeline smoke |
| Paths | ficha hub · history API · dual-chart |
| Evidencia | Agrupación temporal (Hoy / hace 3 meses / hace 1 año) |

---

### MF-DI-09 — Microjourneys post-acción

**Objetivo:** Tras guardar receta → imprimir; tras evolución → crear receta; lab → panel frecuente por diagnóstico; RUT/previsión admin.

| Campo | Valor |
|-------|-------|
| Depende | DI-04, DI-05 |
| Gate | E2E journey hooks |
| Paths | form shell · post-save handlers · admin validators |

---

### MF-DI-10 — Signoff inteligencia determinística

**Objetivo:** Golden journey «secretario clínico» completo sin Ollama.

| Campo | Valor |
|-------|-------|
| Depende | DI-01…09 · MF-CU-02 recomendado |
| Gate | `quality:di-signoff-gate` |
| Evidencia | Piloto demo checklist ampliado · app sin `dev:ai` · reporte cierre |

---

## 6. Precedencia vs PROG-STRENGTHEN-2026

```text
                    PROG-EXPERIENCIA-CORE ✓
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
     PROG-STRENGTHEN-2026          PROG-DI-2026 (este plan)
     SH → IM → CU → IC             DI-01 → … → DI-10
              │                               │
              └───────────┬───────────────────┘
                          ▼
              Intercalación por sesión SDEPIS2
              (1 MF activo · no mezclar >10 archivos API)
```

| Regla | Detalle |
|-------|---------|
| **No bloquea SH-02** | MF-SH-02 sigue siendo READY en tablero para evals IA |
| **Intercalación sugerida** | Semana A: SH/IM · Semana B: DI · o 1 sesión DI tras cada 2 SH |
| **CU antes de DI-06 ideal** | MF-CU-01 desbloquea UI unificada de alertas |
| **DI-10 después de CU-02** | Signoff incluye CDS visible + sugerencias silenciosas |
| **Evolab informa** | Findings hyp-f (staging vacío) → DI-01/DI-08 backlog |

**Comando siguiente MF DI:** `node scripts/quality/di-next.mjs` (cuando exista) · mientras tanto ledger manual.

---

## 7. Cronograma orientativo (2026 Q3)

```text
2026-06–07  │ DI-01 contexto denso · SH-02 evals (paralelo)
2026-07     │ DI-04 prefill · DI-05 acciones probables
2026-08     │ DI-02 memoria · DI-03 autocomplete · CU-01…02 (STRENGTHEN)
2026-08–09  │ DI-06 chips · DI-07 plantillas · DI-08 timeline
2026-09     │ DI-09 microjourneys
2026-10     │ DI-10 signoff (coordinar con strengthen-close)
```

Estimación: **~10 sesiones SDEPIS2** (1 MF/sesión) + solapamiento CU.

---

## 8. Reglas de sesión

1. **Un MF-DI activo** por sesión; declarar `allowedPaths` del ledger.
2. **No** crear Command/Form Registry paralelo.
3. **Gates mínimos al cierre:** `npm run check` · `npm run test` · `npm run db:validate`.
4. **Reporte:** `reports/epis2-mf-di-*.md`.
5. **App debe funcionar sin IA** al cerrar cada MF-DI (invariante #15).
6. **Home = CICA `/app/buscar`** — timeline/sugerencias en ficha, no dashboard como home.

---

## 9. Journey de referencia (aceptación global)

Escenario **Juan Pérez** — hipertenso, diabético, consulta ambulatoria control crónico:

1. Abrir paciente → contexto denso + 4 acciones sugeridas + chips silenciosos.
2. Barra: `control diabetes` → evolución SOAP preformateada + labs al lado.
3. Firmar evolución → oferta receta asociada con dosis previa sugerida.
4. Solicitar HbA1c desde panel o comando — prefill panel control DM2.
5. Todo **sin Ollama** — opcional assist solo en borrador si `dev:ai` activo.

Gate final MF-DI-10 reproduce este journey en E2E + piloto checklist.

---

## 10. Referencias

| Documento | Uso |
|-----------|-----|
| [`di-ledger.json`](../quality/di-ledger.json) | Estados MF-DI-* |
| [`strengthen-ledger.json`](../quality/strengthen-ledger.json) | MF-CU, MF-SH, MF-IM |
| [`EPIS2_IDC_GLOSSARY.md`](./EPIS2_IDC_GLOSSARY.md) | CE-0→CE-5 |
| [`PRODUCT_INVARIANTS.md`](./PRODUCT_INVARIANTS.md) | #8, #9, #10, #15 |
| [`epis2-plan-fases-desarrollo-2026-06-13.md`](../../reports/archive/2026-06/epis2-plan-fases-desarrollo-2026-06-13.md) | Fase 2 + capa DI |
| [`GOLDEN_CLINICAL_JOURNEY.md`](../quality/GOLDEN_CLINICAL_JOURNEY.md) | Journey base |

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
