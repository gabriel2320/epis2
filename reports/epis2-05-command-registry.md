# EPIS2-05 — Command Registry y router

**ID:** EPIS2-05  
**Estado:** Completada  
**Fecha:** 2026-06-04

---

## Entregables

| Área | Implementación |
|------|----------------|
| Registry | `packages/command-registry` — normalización ES, definiciones MVP, slots, matcher |
| Router | `resolveCommand()` — permiso → intent → paciente → ruta |
| API | `POST /api/commands/resolve` (sesión + RBAC) |
| Web | Centro de Comando llama API y navega a `/espacio/*` |
| Suite | ≥100 frases en `COMMAND_PHRASE_SUITE` |

---

## Comandos MVP

| Intent | Ruta |
|--------|------|
| `search_patient` | `/espacio/buscar-paciente` |
| `summarize_patient` | `/espacio/resumen` |
| `create_evolution_draft` | `/espacio/evolucion` |
| `prepare_discharge_draft` | `/espacio/epicrisis` |
| `prepare_prescription` | `/espacio/receta` |
| `request_laboratory` | `/espacio/laboratorio` |

---

## Gates

| Criterio | ✓ |
|----------|---|
| ≥100 frases estáticas | `router.test.ts` |
| Ambiguo → `needs_clarification` | `AMBIGUOUS_PHRASES` + empates de prioridad |
| Sin permiso → 403 ES | API + `forbidden` |
| Sin paciente → `needs_patient` | API + router |

---

## Próximo paso

**EPIS2-06** — Formularios generados desde blueprints.

---

## Commit sugerido

```text
feat(epis2-05): command registry, resolve API, and clinical routes

Add Spanish command normalization, intent routing with RBAC gates,
100+ phrase test suite, and Command Center integration.
```
