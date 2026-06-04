# EPIS2 — Una sola fuente de verdad por dominio

**Versión:** 1.0 · **Estado:** Canónico

EPIS2 evita registros duplicados (error histórico de EPIS/EPIONE). Cada dominio tiene **exactamente un** dueño de verdad.

---

## 1. Matriz SoT

| Dominio | Fuente de verdad | Consumidores | Prohibido |
|---------|------------------|--------------|-----------|
| **Comandos e intents** | `packages/command-registry` | Web, API `/commands`, tests, IA (futuro intent) | Segundo registry en apps; regex monolítico EPIDOS |
| **Formularios y campos** | `packages/clinical-forms` | Web renderer, API validación, IA assist | Formularios inline en páginas; blueprints EPIS sin adaptar |
| **Permisos** | `packages/clinical-domain` (RBAC) | API preHandlers, web guards | Wildcards; permisos solo en frontend |
| **Acciones clínicas** | `packages/clinical-actions` *(futuro)* | Command-registry (mapeo), API | Catálogo EPIONE 117 ids copiado |
| **Contratos API/IA** | `packages/contracts` | api, web, local-ai | Tipos duplicados en apps |
| **Datos clínicos aprobados** | PostgreSQL (Drizzle) | API clinical | localStorage EPIONE; OpenMRS writeback |
| **Borradores** | PostgreSQL `drafts` + estados dominio | API drafts, UI | Tratar borrador como nota final |
| **Aprobaciones** | PostgreSQL `approvals` + transición servicio | API | Auto-approve en IA o triggers ocultos |
| **Auditoría** | PostgreSQL `audit_events` | API, reportes | Logs solo en consola |
| **Alertas CDS** | `clinical-domain/clinicalSafety` | evaluate → API alerts | Motor paralelo en frontend |
| **Alertas CDR** | `clinical-domain/clinicalDecisionRules` | evaluate → API alerts | Reglas solo en UI |
| **IA / prompts** | `services/local-ai` + política prompts | API `/ai` | Prompts hardcoded en web; sidecar con ORM |
| **Casos demo** | `packages/test-fixtures` + seeds DB | tests, migraciones | Paquete EPIS demo sin manifiesto |
| **FHIR export** | `packages/fhir-export` + perfil docs | API fhir | UI que edite recursos FHIR como SoT |
| **Copy visible** | `packages/design-system/copy/es.ts` | Web | Cadenas clínicas en inglés en UI |
| **RUT Chile** | `packages/clinical-domain/src/chile/rut.ts` | API search, forms | Copia en apps/web |

---

## 2. Flujo de lectura/escritura

```text
                    ┌─────────────────┐
                    │ command-registry │
                    └────────┬────────┘
                             │ intent, routePath
                    ┌────────▼────────┐
                    │ clinical-forms   │
                    └────────┬────────┘
                             │ blueprintId, fields
         ┌───────────────────▼───────────────────┐
         │            apps/api                    │
         │  RBAC → draft → approve → clinical    │
         └───────────────────┬───────────────────┘
                             │
                    ┌────────▼────────┐
                    │   PostgreSQL     │  ← única SoT clínica
                    └──────────────────┘

         ┌───────────────────┐
         │   local-ai        │  ← lectura permitida, escritura prohibida
         └───────────────────┘
```

---

## 3. Reglas de integración legacy

1. Código donante **nunca** se importa como SoT paralelo.
2. Tras adaptación, el path canónico es el de la tabla anterior.
3. `legacy-import-manifest.json` debe listar `integratedPath` cuando status = ADAPTED.
4. Candidatos `REFERENCE_ONLY` no se copian a runtime.

---

## 4. Validadores automáticos

| Validador | Protege SoT de |
|-----------|----------------|
| `single-command-registry` | Comandos |
| `single-form-registry` | Formularios |
| `ai-write-boundary` | Datos clínicos / IA |
| `human-approval-required` | Aprobaciones |
| `no-legacy-dependencies` | OpenMRS/Carbon |

Ejecutar: `npm run architecture:validate`.

---

## 5. Decisiones explícitas

| Pregunta | Respuesta |
|----------|-----------|
| ¿Dónde vive el intent «evoluciona»? | `command-registry` (+ sinónimos EPIS adaptados) |
| ¿Dónde vive el formulario de receta? | `clinical-forms/blueprints/prescription` |
| ¿Dónde vive la nota aprobada? | Tabla clínica PostgreSQL post-approve |
| ¿Dónde viven las alertas? | Evaluadores dominio → contrato `ClinicalAlert` → API |
| ¿Ollama guarda borradores? | **No** — solo sugiere; humano guarda vía API |

---

## 6. Paquete futuro `packages/permissions`

Hoy RBAC vive en `clinical-domain`. Si crece:

- Extraer matriz sin cambiar semántica.
- **No** duplicar checks en web sin reflejar API.

---

## Referencias

- [EPIS2_DOMAIN_ARCHITECTURE.md](./EPIS2_DOMAIN_ARCHITECTURE.md)
- [../legacy/EPIS_EPIDOS_EPIONE_CAPABILITY_REUSE_MATRIX.md](../legacy/EPIS_EPIDOS_EPIONE_CAPABILITY_REUSE_MATRIX.md)
- [../../legacy-import-manifest.json](../../legacy-import-manifest.json)
