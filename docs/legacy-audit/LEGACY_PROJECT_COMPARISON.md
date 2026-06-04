# Comparativa transversal — EPIS, EPIDOS, EPIONE

| Dimensión | EPIS | EPIDOS | EPIONE | Recomendación EPIS2 |
|-----------|------|--------|--------|---------------------|
| Claridad del producto | Media (pivot V2 vs distro O3) | **Alta** (visión médico-centrada) | Media (prototipo demo explícito) | Mantener canon `PRODUCT_CANON` EPIS2 |
| Command-first | Parcial (Material V2 + legacy O3) | **Alta** (barra central) | Alta en ficha, **baja en home** (Inicio/jornada) | Solo Centro de Comando |
| Formularios | Blueprints + material-forms (duplicado) | Zod + payload genérico | TS triple + JSON + handlers | **Un** `clinical-forms` registry |
| Experiencia visual | Carbon+MUI+O3 | shadcn | Radix/Tailwind | **MUI** único |
| Modelo de datos | OpenMRS + sidecar | PostgreSQL SoT | PG (API) / localStorage (demo) | PostgreSQL SoT |
| Arquitectura backend | OpenMRS + sidecar | Fastify | Hono | **Fastify** (actual EPIS2) |
| IA local | Ollama + RAG + sidecar | Ollama Gateway | Ollama read-only | Ollama desacoplado, sin RAG MVP |
| Permisos | Roles + sidecar policy | JWT roles explícitos | RBAC granular | Permisos explícitos EPIS2 |
| Auditoría | `@epis/audit` memoria | `audit_logs` DB | Audit en API | Auditoría EPIS2 API |
| Seguridad | Writeback pilot OFF | Confirmación UI débil en execute | IA sin write (bien) | Humano aprueba; IA no escribe |
| Tests | Masivos (infra-heavy) | Vitest + E2E opcional | Unit + E2E api-mode | Golden journey clínico |
| Mantenibilidad | Baja (tamaño, O3) | **Media-alta** | Media (resolvers dispersos) | Monorepo pequeño EPIS2 |
| Integración | OpenMRS FHIR | FHIR export golden | FHIR read-only | Frontera `fhir-export` |
| Deuda técnica | **Muy alta** | Media (regex) | Alta (registries múltiples) | No importar deuda |

## Conclusión

- **EPIDOS** → mejor referencia arquitectónica (Fastify, PG, gateway IA).
- **EPIONE** → mejor referencia de **MAU**, safety y volumen de acciones clínicas (reescribir).
- **EPIS** → mejor referencia de **aliases ES**, CDS demo, prompts; **peor** en infra OpenMRS.

EPIS2 ya implementa la síntesis deseada en fases 00–11; la migración debe ser **quirúrgica**, no por copia de repos.
