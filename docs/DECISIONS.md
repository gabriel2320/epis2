# EPIS2 — Registro de decisiones (ADR)

Formato breve. Decisiones irreversibles sin ADR no deben implementarse.

---

## ADR-001 — Backend clínico propio vs FHIR headless

**Estado:** Aceptado (EPIS2-00)  
**Fecha:** 2026-06-04

### Contexto

EPIS dependía de OpenMRS como SoT invisible, lo que reprodujo deriva arquitectónica. Se evaluó Medplum u otro backend FHIR headless.

### Decisión

Comenzar EPIS2 con **backend propio**: Fastify + Drizzle + PostgreSQL.

Mantener **frontera FHIR** para export/import (EPIS2-10), no como modelo de UI ni runtime principal en v1.

### Consecuencias

- Construir auth, RBAC, auditoría e interoperabilidad en EPIS2.
- Spike Medplum opcional y **aislado**; no bloquea EPIS2-01…04.
- Si el spike gana en el futuro, requiere ADR-002 y migración planificada — no en caliente.

### Alternativas rechazadas

- OpenMRS / O3 — ver `NON_GOALS.md`
- Medplum como SoT en v1 — complejidad operacional (Redis, etc.) sin validar flujo command-first

---

## ADR-002 — Repositorio independiente

**Estado:** Aceptado (EPIS2-00)

EPIS2 vive en repositorio/carpeta `EPIS2` separado de `Epis`. EPIS = `LEGACY_REFERENCE` únicamente.

---

## ADR-003 — IA local separada

**Estado:** Aceptado (EPIS2-00)

Ollama vive en `services/local-ai`. Salidas JSON Schema. Sin escritura directa en tablas clínicas aprobadas.

---

## ADR-004 — Idioma de producto

**Estado:** Aceptado (EPIS2-00)

Toda superficie clínica visible al usuario en **español**. Código y APIs pueden usar inglés en identificadores.

---

## Pendientes

| ID | Tema | Cuándo |
|----|------|--------|
| ADR-005 | Row-Level Security PostgreSQL — piloto migración 022 (`off`/`enforce`) | Piloto Plan F |
| ADR-006 | Auth híbrida piloto (`AUTH_MODE=hybrid` + `SERVICE_API_KEY`) | Plan F slice 3 |
| ADR-007 | Modelo Ollama por entorno | EPIS2-07 |
