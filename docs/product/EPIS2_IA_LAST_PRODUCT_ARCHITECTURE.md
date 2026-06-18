# EPIS2 — Arquitectura IA-last y criterio clínico gobernante

**Versión:** 1.0 · **Fecha:** 2026-06-17  
**Audiencia:** Chief Clinical Architect, agentes Cursor, planificación SDEPIS2  
**Estado:** **Propuesto** — requiere MF autorizada post-merge CICA (ver [`CONSOLIDATION_FREEZE.md`](../CONSOLIDATION_FREEZE.md))

**Canon relacionado:** [`VISION_EPIS2.md`](./VISION_EPIS2.md) · [`PRODUCT_INVARIANTS.md`](./PRODUCT_INVARIANTS.md) · [`EPIS2_CICA_CLEAN_ROOM_POLICY.md`](../design/EPIS2_CICA_CLEAN_ROOM_POLICY.md) · [`GOLDEN_CLINICAL_JOURNEY.md`](../quality/GOLDEN_CLINICAL_JOURNEY.md)

---

## Frase madre

> **Una acción clínica, una pantalla clara, un borrador revisable, una firma humana.**

EPIS2 no es «una ficha con IA», ni un HIS completo, ni un dashboard clínico. Es una **máquina de documentación clínica** donde el criterio médico gobierna y los agentes (humanos o software) solo aceleran pasos verificables.

---

## Evaluación: visión vs estado actual (2026-06-17)

### Alta alineación (ya existe o está en merge)

| Idea propuesta | Estado EPIS2 | Evidencia |
|----------------|--------------|-----------|
| Core funciona sin IA | ✓ Invariante #15 | `quality:sh-03-degrade-gate`, tests EPIS2-07 |
| IA no aprueba ni firma | ✓ Invariante #11 | `ai-write-boundary`, `@epis2/ai-client` |
| Borrador → aprobación humana | ✓ | API drafts + audit |
| Dos representaciones (electrónico + papel) | ✓ parcial | ADR-002, CICA `PaperModeScreen`, `/app/pacientes/:id/papel` |
| Command bar + resolución determinista | ✓ | `@epis2/command-registry` (`rank.ts`, aliases, context boost) |
| IA solo en ambigüedad (routing) | ✓ parcial | `shouldInvokeAssistRoute` → solo `needs_clarification` |
| Blueprints declarativos | ✓ | `@epis2/clinical-forms` |
| CICA = UI futura | ◐ merge pendiente | `/app/*`, `EPIS_CICA_SCREEN_REGISTRY` |
| Prefill / plantillas sin IA | ◐ | `context-clinical-prefill`, `live-templates`, `command-slot-prefill` |
| Trazabilidad IA | ◐ | `langfuseTrace`, `promptHash`, `syntheticEvals` en `services/local-ai` |
| Seguridad base | ✓ | RH-01…12, rate limit, auth fail-closed |
| FHIR como frontera | ✓ | `@epis2/fhir-export`, no SoT UI |

### Brechas críticas (trabajo pendiente)

| Brecha | Riesgo | Prioridad |
|--------|--------|-----------|
| **Tres superficies UI** (`/app`, `/espacio`, dashboard) | Ambigüedad producto, doble mantenimiento | P0 post-merge |
| **Acciones clínicas fragmentadas** (command-registry + CICA registry + `clinicalIntent.ts`) | Cursor inventa pantallas; drift | P0 |
| **Sin motor de reglas clínico unificado** | Errores obvios dependen de memoria humana | P0 |
| **Sin completeness engine** por tipo documental | Epicrisis/receta incompletas pasan a revisión | P0 |
| **Lexicon ES-CL no empaquetado** | Sinónimos repartidos en command-registry | P1 |
| **Diccionarios medicamento/lab mínimos** | `drug-intel` es satélite, no core determinista | P1 |
| **Context Pack tipado antes de IA** | RAG envía contexto amplio | P1 |
| **Golden journey en rutas CICA** | E2E legacy ≠ home futuro | P1 |
| **Observabilidad clínica end-to-end** | Sin trace `action → draft → approve` | P2 |
| **Integraciones externas** (Meilisearch, HAPI, MinIO…) | Prematuras para v0.1 | P3 |

### Tensiones con invariantes (resolver antes de implementar)

| Propuesta externa | Conflicto | Resolución EPIS2 |
|-------------------|-----------|------------------|
| `clinicalActions.manifest.ts` **nuevo** | Invariante #9 — un solo Command Registry | **Extender** `@epis2/command-registry`; export `ClinicalActionManifest` derivado de `EPIS2_COMMAND_DEFINITIONS` + rutas CICA |
| Segundo Form Registry | Invariante #10 | Mantener `@epis2/clinical-forms`; enriquecer blueprints |
| Dashboard eliminado del core | Invariante #7 — no home dashboard | ✓ Coherente; dashboard queda `/epis2/dashboard` secundario |
| Home `/app/buscar` | Invariante #6 cita `/espacio/buscar-paciente` | Actualizar ADR/brújula tras merge CICA; redirect legacy |
| `@epis2/clinical-actions` paquete nuevo | Riesgo duplicar registry | **Fase 1:** alias/export desde command-registry; paquete solo si el manifest crece >1 módulo |

---

## Producto: dos experiencias (objetivo)

```text
A. Ficha electrónica clásica (CICA-L)
   → /app/* · una intención · una acción primaria · paciente visible

B. Modo papel clínico
   → carta / A5 · imprimible · versionado · misma SoT

Fuera del core clínico:
   → Dashboard administrativo (/epis2/dashboard) — nunca home
   → /espacio/* — fallback temporal hasta sunset documentado
```

### Gramática visual CICA (checklist GO)

| Capa | Componente | Función |
|------|------------|---------|
| Identity Band | `CicaPatientIdentityBand` | Quién es el paciente |
| Context Strip | `CicaContextStrip` | Dónde estoy / qué hago |
| Action Surface | `CicaScreenFrame` + form | Tarea clínica única |
| Evidence Panel | Resumen mínimo contextual | Solo lo necesario |
| Draft Panel | Estado borrador/aprobado | Nunca oculto en forms |
| Command Dock | Barra transversal (Ctrl+K) | IA silenciosa, no protagonista |
| Safety Strip | Alertas reglas | No invasivo |

Auditoría humana obligatoria antes de declarar CICA **GO** en producción sintética.

---

## Arquitectura IA-last (capas)

```text
apps/web          → Experiencia CICA, rutas /app, interacción
apps/api          → Auth, drafts, approvals, audit, FHIR boundary
packages/contracts → DTOs, eventos, AiContextPack (futuro)
packages/clinical-domain → RBAC, permisos, safety checks puros
packages/clinical-forms  → Blueprints, prefill, plantillas, print hooks
packages/command-registry → Acciones clínicas + resolver determinista (ÚNICO registry)
packages/epis2-ui → CICA, papel, MD3
services/local-ai → Ollama, redacción, resumen (NUNCA import en web)
database          → SoT, RLS, auditoría append-only
```

### Pipeline determinista (antes de cualquier LLM)

```text
Comando / clic
  → normalize (ES-CL)
  → match exacto → sinónimos → regex → contexto pantalla → historial
  → confidence ≥ 0.8 → acción resuelta (SIN IA)
  → confidence 0.5–0.79 → aclaración UI
  → confidence < 0.5 → AiContextPack → local-ai (opcional)
  → cargar blueprint
  → Clinical Context Builder (API)
  → prefill + plantilla determinista
  → Rules Engine + Completeness
  → pantalla CICA
  → borrador
  → revisión humana → aprobación → versión → print
```

Reglas de escalación IA ( encapsular en `@epis2/command-registry` → `ai-escalation` ):

- **Prohibido IA:** abrir pantalla, permisos, validar campos, aprobar, SQL, auditoría
- **Permitido IA:** ambigüedad, redacción narrativa, resumen multi-nota, extracción texto libre

---

## Clinical Action Engine (concepto → implementación EPIS2)

No crear un segundo motor. **Unificar** en tres artefactos existentes:

| Artefacto | Rol |
|-----------|-----|
| `EPIS2_COMMAND_DEFINITIONS` | Contrato acción: intent, permiso, aliases, routePath, formId |
| `EPIS_CICA_SCREEN_REGISTRY` | Contrato pantalla: layout, señales, acción primaria |
| Blueprints `clinical-forms` | Contrato formulario: campos, prefill, print |

Tipo objetivo (derivado, no duplicado):

```typescript
type ClinicalActionContract = {
  id: ClinicalIntent;
  label: string;
  synonyms: readonly string[];
  requiresPatient: boolean;
  requiredPermission: Permission;
  blueprintId?: string;
  draftType?: string;
  cicaRoute: string;        // /app/...
  legacyRoute?: string;     // sunset
  printable: boolean;
  aiRequired: false;        // default IA-last
  safetyCheckIds: readonly string[];
};
```

Generación: script de build o módulo `manifest.ts` que **lee** los tres registros y falla si hay drift (`quality:clinical-action-manifest-gate`).

---

## Librerías y diccionarios (mapa EPIS2)

### Crear o formalizar (packages/)

| Paquete propuesto | Estrategia EPIS2 | Prioridad |
|-------------------|------------------|-----------|
| `@epis2/clinical-actions` | **Alias** de command-registry + CICA routes | P0 |
| `@epis2/clinical-lexicon-es-cl` | Extraer sinónimos de `clinical-command-dictionary` + Chile | P0 |
| `@epis2/clinical-rules` | Nuevo — reglas blocking/warning | P0 |
| `@epis2/completeness-checks` | Nuevo — checklist por draftType | P0 |
| `@epis2/ai-escalation-gate` | Módulo en command-registry | P0 |
| `@epis2/drug-dictionary-cl` | Seed mínimo demo; ampliar drug-intel después | P1 |
| `@epis2/lab-dictionary` | Seed K, Na, Hb, PCR + críticos | P1 |
| `@epis2/units-ucum` | Normalización unidades | P1 |
| `@epis2/vitals-dictionary` | PA, FC, SatO2, escalas | P1 |
| `@epis2/terminology-core` | Wrapper CodeableConcept | P2 |
| `@epis2/diagnosis-dictionary` | Subset CIE-10 + español | P2 |
| `@epis2/print-templates` | Consolidar print en epis2-ui + forms | P1 |
| `@epis2/document-types` | Mapeo draftType ↔ FHIR category | P2 |
| `@epis2/chile-health-admin` | Extender `clinical-domain/chile/*` | P2 |

### Integraciones externas (cuándo)

| Integración | Cuándo | Notas |
|-------------|--------|-------|
| PostgreSQL + pgvector | Ya | SoT + embeddings futuros |
| Ollama | Ya | `services/local-ai` |
| Meilisearch | Fase 3 | Búsqueda paciente/docs si Postgres no alcanza |
| HAPI FHIR sandbox | Fase 3 | Interop tests, no SoT |
| MinIO + Tika + Tesseract | MedRepo satélite | No mezclar con ficha clínica |
| OpenTelemetry | Fase 2 | Trace clínico |
| Keycloak | Pre-piloto PHI | Sustituir auth demo |
| SNOMED/LOINC completos | P3 | Subsets EPIS2 primero |

---

## Programas SDEPIS2 propuestos

### Pre-requisito: PROG-PURGE-CICA ✓◐

Merge `feat/prog-aesthetic-reset-close` → `master` · sunset plan `/espacio` · actualizar invariante #6 home.

### PROG-EPIS2-LEXICON-CORE (Fase 1 — inteligencia sin IA)

| MF | Entrega | Gate |
|----|---------|------|
| MF-LX-01 | Manifest unificado acciones (derivado) | `quality:clinical-action-manifest-gate` |
| MF-LX-02 | `@epis2/clinical-lexicon-es-cl` | tests sinónimos ES-CL |
| MF-LX-03 | `drug-dictionary-cl` mínimo (50 fármacos demo) | unit |
| MF-LX-04 | `lab-dictionary` mínimo + críticos | unit |
| MF-LX-05 | `@epis2/clinical-rules` básico | `quality:clinical-rules-gate` |
| MF-LX-06 | `ai-escalation-gate` en command-registry | `quality:ai-escalation-gate` |

**Resultado:** 80–90 % comandos comunes resueltos sin Ollama.

### PROG-IA-LAST-CORE (Fase 2 — completar pipeline)

| MF | Entrega | Gate |
|----|---------|------|
| MF-IL-01 | Deterministic resolver v2 (confidence explícita) | command-registry tests |
| MF-IL-02 | Clinical Context Builder (API contract) | integration |
| MF-IL-03 | `@epis2/completeness-checks` | blocking en approve |
| MF-IL-04 | Plantillas SOAP/epicrisis deterministas | forms tests |
| MF-IL-05 | AiContextPack + eval 50 casos sintéticos | `ai:evals:closure` |

### PROG-CICA-PAPER-PREMIUM (Fase 3 — diferenciador)

| MF | Entrega |
|----|---------|
| MF-PP-01 | Evolución carta + libro evoluciones |
| MF-PP-02 | Receta A5 + certificado A5 |
| MF-PP-03 | Epicrisis carta + PDF export |
| MF-PP-04 | Golden journey 100 % en `/app/*` |

### PROG-CLINICAL-OBSERVABILITY (Fase 4)

OpenTelemetry: `trace.clinical_action` web → api → db → ai opcional.

---

## Método Cursor (médico como Chief Clinical Architect)

```text
1. Describir acto clínico real + criterio aceptación
2. Verificar acción en manifest (no inventar pantalla)
3. Blueprint mínimo en clinical-forms
4. Ruta CICA en EPIS_CICA_SCREEN_REGISTRY
5. Test unitario resolver + rules
6. Test E2E Playwright (estado vacío, error, borrador)
7. Validación visual humana (checklist CICA)
8. MF pequeña · reporte cierre · gates subagente
```

Prompt tipo (resumen): microfase acotada · una acción primaria · no segundo registry · no import local-ai en web · borrador only.

### Comité de agentes (dev, no producto)

| Agente | Rol |
|--------|-----|
| Arquitecto | Capas, imports, no acoplamiento |
| Clínico | ¿Tiene sentido para un médico? |
| UX CICA | Carga cognitiva, una acción |
| Seguridad | Auth, PHI, audit |
| QA | Vitest + Playwright |
| Documentador | Solo canon allowlist |
| Release | Gates, PR |

**Decisión producto:** siempre humano médico.

---

## Métricas de éxito

| Métrica | Objetivo |
|---------|----------|
| Comandos resueltos sin IA | ≥ 85 % en corpus sintético 50 casos |
| Flujo manual con Ollama off | Golden journey PASS |
| Tiempo a pantalla de acción | ≤ 2 interacciones desde ficha |
| Borradores con completeness blocking | 100 % tipos core |
| Pantallas CICA checklist | 10/10 antes de GO |
| ai_runs con accepted/rejected | Trazabilidad 100 % assist |

---

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| Segundo registry por prisa | Gate `no-duplicate-registries` + manifest derivado |
| IA invade routing temprano | `ai-escalation-gate` + tests Ollama off |
| Diccionarios clínicos incorrectos | Solo sintético; fuentes validadas antes piloto |
| Scope explosion (HIS) | [`NON_GOALS.md`](../NON_GOALS.md) + freeze |
| Legacy nunca muere | Fecha sunset `/espacio` en brújula post-merge |

---

## Referencias

- [`EPIS2_CLINICAL_TERMINOLOGY.md`](./EPIS2_CLINICAL_TERMINOLOGY.md)
- [`EPIS2_DOMAIN_ARCHITECTURE.md`](../architecture/EPIS2_DOMAIN_ARCHITECTURE.md)
- [`EPIS2_DEV_SYSTEM.md`](./EPIS2_DEV_SYSTEM.md)
- Reporte evaluación: [`epis2-ia-last-evaluation-plan-2026-06-17.md`](../../reports/epis2-ia-last-evaluation-plan-2026-06-17.md)

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
