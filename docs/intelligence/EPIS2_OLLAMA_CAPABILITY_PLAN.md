# EPIS2 — Plan de capacidades Ollama (IA local)

**Versión:** 1.0 · **Estado:** Plan maestro  
La IA es **capacidad transversal**, no el núcleo del sistema.

---

## 1. Principio rector

```text
Datos clínicos permitidos (lectura)
  → servicio local-ai
  → respuesta estructurada (JSON Schema / Zod)
  → validación schema
  → policy engine (sin escritura SoT)
  → borrador visible en UI
  → revisión humana
  → aprobación → PostgreSQL
```

**La aplicación debe funcionar con Ollama apagado.**

---

## 2. Funciones permitidas por área

### 2.1 Centro de Comando (V0+ / V5)

| Función | Versión | Estado |
|---------|---------|--------|
| Interpretar instrucciones NL | V5 | ○ (hoy: registry determinista) |
| Detectar intent y slots | V5 | ○ |
| Datos faltantes | V5 | ○ |
| Sugerir formulario / acción | V0 | ◐ resolve sin IA |
| Sinónimos y typos | V0 | ✓ registry + aliases |

### 2.2 Información clínica (V1 / V5)

| Función | Versión |
|---------|---------|
| Resumir últimas 24 h | V5 |
| Resumir hospitalización | V5 |
| Explicar tendencias laboratorio | V5 |
| Localizar documentos (RAG) | V1 |
| Preguntas con fuentes citadas | V1/V5 |
| Cronologías | V5 |

### 2.3 Documentación (V0+)

| Función | Versión | Estado |
|---------|---------|--------|
| Proponer borrador evolución | V0 | ✓ assist por blueprint |
| Estructurar epicrisis / ingreso | V1+ | ◐ epicrisis blueprint |
| Completar secciones desde contexto | V0 | ✓ `pickAssistContextFromSummary` |
| Detectar contradicciones / faltantes | V1+ | ○ |

### 2.4 Seguridad y revisión (V0+)

| Función | Versión | Estado |
|---------|---------|--------|
| Duplicidades medicamentos | V0 | ✓ CDS/CDR + alertas UI |
| Alergias conocidas | V0 | ✓ |
| Datos faltantes | V1+ | ○ |
| Revisión farmacológica sugerida | V3 | ○ |
| Mostrar incertidumbre | V5 | ○ |

---

## 3. Límites obligatorios (Ollama NO puede)

| Prohibición | Enforcement |
|-------------|-------------|
| Ejecutar SQL | Sin cliente DB en `local-ai` |
| Escribir en PostgreSQL | Sin Drizzle/ORM en IA |
| Aprobar o firmar | Solo API con RBAC humano |
| Crear documentos clínicos finales | Solo campos sugeridos → borrador |
| Inventar datos no presentes en contexto | Prompt policy + validación |
| Saltar permisos | API proxy valida sesión |
| Ejecutar órdenes | Sin action executors |
| Ocultar fuentes (RAG) | Contrato exige citations *(V1)* |
| Bloquear o dar alta autónomamente | CDR advisory only |

Validador: `ai-write-boundary` en `npm run architecture:validate`.

---

## 4. Arquitectura técnica actual

```text
apps/web  →  apps/api (/api/ai/*)  →  services/local-ai  →  Ollama HTTP
                │                           │
                │                           ├─ assistSchemas.ts
                │                           ├─ clinicalPromptPolicy.ts
                │                           ├─ draftPromptCatalog.ts
                │                           └─ gatewayCapabilities.ts
                └─ ai_runs (auditoría)
```

| Artefacto | Origen adaptado |
|-----------|-----------------|
| Gateway capabilities | EPIDOS AI Gateway |
| Prompts por blueprint | EPIS epis-ai-prompts |
| Schemas JSON | EPIS2 contracts |

---

## 5. Roadmap IA por versión

| Versión | Entregable IA |
|---------|---------------|
| V0 | Assist borrador 4 blueprints; safety notes; app sin Ollama |
| V1 | RAG con fuentes; búsqueda documental |
| V5 | Intent NL; resúmenes longitudinal; prompts versionados; evals sintéticas |

---

## 6. Trazabilidad

| Evento | Registro |
|--------|----------|
| Llamada assist | `ai_runs` (modelo, latencia, éxito) |
| Sugerencia rechazada | Log API + no persiste |
| Aprobación humana | `audit_events` / `approvals` |

---

## 7. Candidatos legacy

| ID manifiesto | Decisión |
|---------------|----------|
| epidos-ai-gateway | ADAPTED |
| epis-ai-prompts | ADAPTED |
| epis-rag-sidecar | REJECT como SoT; reevaluar V1 REWRITE |
| epidos-regex-command-interpreter | REJECT |

---

## Referencias

- [../CLINICAL_SAFETY_PRINCIPLES.md](../CLINICAL_SAFETY_PRINCIPLES.md)
- [../architecture/EPIS2_SINGLE_SOURCE_OF_TRUTH.md](../architecture/EPIS2_SINGLE_SOURCE_OF_TRUTH.md)
- [../../services/local-ai/src/gatewayCapabilities.ts](../../services/local-ai/src/gatewayCapabilities.ts)
