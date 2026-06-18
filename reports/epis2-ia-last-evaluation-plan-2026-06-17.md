# EPIS2 — Evaluación IA-last · Criterio clínico gobernante

**Fecha:** 2026-06-17 · **Autor:** sesión diseño producto + ingeniería  
**Estado:** **Propuesto** · **Rama base:** `feat/prog-aesthetic-reset-close` @ post-pull  
**Canon:** [`docs/product/EPIS2_IA_LAST_PRODUCT_ARCHITECTURE.md`](../docs/product/EPIS2_IA_LAST_PRODUCT_ARCHITECTURE.md)

---

## Resumen ejecutivo

La visión compartida —**EPIS2 como sistema clínico aumentador de criterio médico, IA-last**— es **coherente con el canon existente** (VISION v2, invariantes 11–15, ADR-002 dual chart, CICA clean room). EPIS2 ya implementa ~60 % del pipeline propuesto; el salto restante no es «más IA», sino **unificar acciones, reglas y diccionarios deterministas** antes de escalar Ollama.

**Veredicto:** **ADOPTAR** la dirección con ajustes de nomenclatura EPIS2 (un solo registry, no paquetes duplicados prematuros).

**Bloqueador inmediato:** completar **PROG-PURGE-CICA** (merge CICA → master) antes de abrir PROG-EPIS2-LEXICON-CORE.

---

## 1. Discusión — fortalezas de la propuesta

### 1.1 Ventaja competitiva bien identificada

El diferenciador no es «saber programar», sino **reconocer en segundos pantallas clínicas absurdas o peligrosas**. Cursor/Ollama deben convertir ese criterio en contratos verificables (blueprints, gates, E2E), no en UI artesanal.

### 1.2 IA-last es canon, no innovación

`VISION_EPIS2.md` ya define **Nivel 1 — Clinical Core debe funcionar solo**. Invariante #15 exige app sin IA local. La propuesta formaliza lo que el repo promete pero aún no mide de forma agregada (métrica «85 % comandos sin LLM»).

### 1.3 Dos experiencias vs tres modos actuales

La simplificación **Ficha clásica + Papel** es correcta. Hoy coexisten:

- `/app/*` CICA (futuro)
- `/espacio/*` legacy (fallback)
- `/epis2/dashboard` (secundario, no home)

El plan **CICA-L única UI futura** con sunset `/espacio` es el movimiento 1 correcto; requiere actualizar invariante #6 y brújula tras merge.

### 1.4 Clinical Action Engine

Conceptualmente sólido. En EPIS2 **no debe nacer como paquete paralelo**: `@epis2/command-registry` ya tiene intents, aliases, scoring, permisos y rutas; `EPIS_CICA_SCREEN_REGISTRY` añade layout; `clinical-forms` añade campos. El manifest es **vista unificada derivada**, no tercer registry.

### 1.5 Librerías y diccionarios

La priorización P0 (acciones, lexicon, medicamentos/lab mínimos, reglas, escalation) es acertada. `services/drug-intel` y `clinical-case-intel` son **labs** — correcto mantenerlos fuera del core hasta promoción explícita (`quality:core-no-labs-imports-gate`).

---

## 2. Discusión — tensiones y correcciones

### 2.1 Riesgo: segundo Command Registry

**Propuesta externa:** `clinicalActions.manifest.ts` independiente.  
**Corrección EPIS2:** generar manifest desde `EPIS2_COMMAND_DEFINITIONS` + mapa CICA; gate anti-drift. Violaría invariante #9 si fuera editable por separado.

### 2.2 IA en routing: ya parcialmente contenida

`shouldInvokeAssistRoute()` solo escala cuando `status === 'needs_clarification'`. Falta:

- confidence numérica explícita en UI
- métricas de cuántas veces se llamó `runCommandRouteAssist`
- gate que falle si web importa lógica de routing IA directamente

### 2.3 Reglas clínicas dispersas

Existen señales (`comorbiditySignals`, CDS hooks PROG-CDS-UX) pero **no hay motor unificado** `@epis2/clinical-rules` con severidades blocking/critical. Esta es la brecha de seguridad clínica más importante pre-IA.

### 2.4 Completeness antes de approve

Blueprints tienen `requiredFields` parciales; falta engine transversal que bloquee approve en API (receta sin dosis, epicrisis sin dx alta).

### 2.5 Integraciones prematuras

Meilisearch, HAPI, MinIO, Keycloak, SNOMED completo — **correctamente P2/P3**. EPIS2 v0.1 sintético debe cerrar lexicon core + golden journey CICA primero.

### 2.6 Congelamiento vigente

[`CONSOLIDATION_FREEZE.md`](../docs/CONSOLIDATION_FREEZE.md) prohíbe features clínicas nuevas sin MF autorizada. PROG-EPIS2-LEXICON-CORE debe declararse como **desbloqueo explícito** post-merge CICA.

---

## 3. Mapa estado actual → objetivo

| Capacidad IA-last | Hoy | Objetivo |
|-------------------|-----|----------|
| Resolver comando sin LLM | command-registry rank + aliases | + lexicon ES-CL + confidence API |
| Abrir pantalla correcta | CICA routes + redirects legacy | 100 % golden journey `/app` |
| Prefill formulario | context-clinical-prefill | + rules + completeness |
| Plantilla SOAP vacía | live-templates parcial | plantillas deterministas por blueprint |
| Alerta alergia / K crítico | CDS parcial | clinical-rules + lab-dictionary |
| Next best action | context-rank en commands | nextBestActions en ficha |
| Escalation IA | assist-route on clarification | ai-escalation-gate formal |
| Context Pack | RAG assembleContext | AiContextPack tipado en contracts |
| Trazabilidad | langfuseTrace, promptHash | ai_runs persistido + accepted/rejected |
| Modo papel premium | PaperModeScreen | PDF carta/A5 core docs |

---

## 4. Plan de ejecución (orden estricto)

### Ola 0 — Cerrar perímetro visual (ahora)

| Paso | Acción | Owner |
|------|--------|-------|
| 0.1 | PR merge CICA → master | Release |
| 0.2 | Actualizar `EPIS2_CURRENT_STATE` home `/app/buscar` | Documentador |
| 0.3 | Plan sunset `/espacio` (fecha + redirects) | Arquitecto |
| 0.4 | Golden journey E2E en `/app/*` | QA |

### Ola 1 — PROG-EPIS2-LEXICON-CORE (4–6 semanas agente)

```text
MF-LX-01  Manifest derivado + gate anti-drift
MF-LX-02  clinical-lexicon-es-cl (extraer + tests)
MF-LX-03  drug-dictionary-cl mínimo (50 ítems demo)
MF-LX-04  lab-dictionary mínimo + umbrales críticos
MF-LX-05  clinical-rules (5 reglas blocking demo)
MF-LX-06  ai-escalation-gate + métricas resolver
```

**Gate cierre:** `quality:lexicon-core-close-gate` (componer: manifest + rules + ollama-off journey).

### Ola 2 — PROG-IA-LAST-CORE

```text
MF-IL-01  Resolver v2 con confidence en CommandResolveResult
MF-IL-02  Clinical Context Builder endpoint
MF-IL-03  completeness-checks en approve API
MF-IL-04  Plantillas deterministas evolution/discharge/prescription
MF-IL-05  50 evals sintéticos + AiContextPack en contracts
```

### Ola 3 — PROG-CICA-PAPER-PREMIUM

Libro evoluciones, receta A5, certificado A5, epicrisis carta, export PDF.

### Ola 4 — Observabilidad + terminología

OpenTelemetry clinical traces · subsets LOINC/ICD · HAPI sandbox.

---

## 5. Librerías — decisión create vs extend

| Item | Decisión | Motivo |
|------|----------|--------|
| clinical-actions | **Extend** command-registry | Invariante #9 |
| clinical-lexicon-es-cl | **Create** package | Separar datos de lógica matcher |
| clinical-rules | **Create** package | Dominio puro testeable |
| completeness-checks | **Create** package | Compartido API + web |
| drug/lab dictionary | **Create** seeds en packages | Promover desde drug-intel después |
| ai-escalation-gate | **Module** en command-registry | Cohesión resolver |
| terminology-core | **Defer** P2 | Tras lexicon estable |
| print-templates | **Extend** epis2-ui/print | Ya existe base |

---

## 6. Integraciones — decisión adopt/defer

| Integración | Decisión | Fase |
|-------------|----------|------|
| Ollama | Adopt (ya) | Mantener encapsulado |
| PostgreSQL | Adopt (ya) | SoT |
| pgvector | Adopt incremental | Tras MedRepo/Evolab contrato |
| Meilisearch | Defer | Si búsqueda paciente >500ms |
| HAPI FHIR | Defer sandbox | Interop ola 4 |
| MinIO/Tika/OCR | Defer | EPIS2-MedRepo satélite |
| OpenTelemetry | Defer | Ola 4 |
| Keycloak | Defer | Pre-piloto PHI |
| Grafana stack | Defer | Dev avanzado opcional |

---

## 7. Gates propuestos (añadir a catalog-full.json)

| Gate ID | Verifica |
|---------|----------|
| `quality:clinical-action-manifest-gate` | Manifest derivado sin drift registry/CICA/forms |
| `quality:clinical-rules-gate` | Reglas blocking registradas y testeadas |
| `quality:ai-escalation-gate` | Web no importa local-ai; IA solo post-clarification |
| `quality:lexicon-core-close-gate` | Composite ola 1 |
| `quality:ollama-off-golden-gate` | Golden journey PASS sin Ollama |

---

## 8. Próximo paso exacto

1. **Operador:** autorizar MF-LX-01 tras merge CICA (desbloqueo freeze).
2. **Sesión Cursor:** `npm run dev:session` · microfase MF-LX-01 solo — manifest derivado + gate.
3. **No iniciar:** paquetes terminology/SNOMED, Meilisearch, segundo registry.
4. **Validar:** corpus 20 frases clínicas ES-CL resueltas sin Ollama como smoke test manual.

---

## 9. Conclusión

EPIS2 está **bien encaminado** hacia «ficha clínicamente inteligente por diseño». La propuesta IA-last no contradice el canon; lo **operacionaliza**. El error a evitar es duplicar registries o integrar stacks externos antes de cerrar reglas, completeness y lexicon mínimo chileno.

> *No pienses «¿cómo hago que la IA entienda la ficha?» Piensa «¿cómo hago que EPIS2 entienda la ficha antes que la IA?»*

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
