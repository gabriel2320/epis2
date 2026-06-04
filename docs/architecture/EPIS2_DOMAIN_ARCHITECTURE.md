# EPIS2 — Arquitectura de dominios

**Versión:** 1.0 · **Estado:** Canónico (plan maestro)  
La arquitectura física (React, Fastify, PostgreSQL, Ollama) **no cambia**. Este documento define **dominios lógicos** y sus fronteras.

---

## 1. Diagrama inmutable

```text
┌──────────────────────────────────────────────┐
│              React + Material UI             │
│                                              │
│ Login → Centro de Comando → Espacios clínicos│
│                  ↘ Modo tablero (opcional)   │
└──────────────────────┬───────────────────────┘
                       │ API tipada (contracts)
┌──────────────────────▼───────────────────────┐
│            Fastify + TypeScript              │
│                                              │
│ Auth · RBAC · Comandos · Servicios clínicos  │
│ Borradores · Aprobaciones · Auditoría        │
└──────────────┬───────────────────────┬───────┘
               │                       │
┌──────────────▼──────────────┐ ┌──────▼──────────────┐
│ PostgreSQL                  │ │ Servicio IA local   │
│ Fuente clínica de verdad    │ │ Ollama              │
│ Versionado y auditoría      │ │ Structured outputs  │
└─────────────────────────────┘ └─────────────────────┘
```

**Prohibido integrar:** OpenMRS, O3, Carbon, overlays, rutas legacy, segundo registry, IA con escritura directa a SoT, dashboard como página inicial.

---

## 2. Dominios y responsabilidades

| Dominio | Responsabilidad | Ubicación principal |
|---------|-----------------|---------------------|
| **Identidad** | Usuarios, sesiones, roles demo | `apps/api/src/auth` |
| **Autorización** | Permisos explícitos por acción | `packages/clinical-domain` RBAC |
| **Comando** | NL → intent → ruta → blueprint | `packages/command-registry`, API commands |
| **Paciente** | Identidad demo, búsqueda, contexto | API clinical, DB patients |
| **Encuentro** | Episodios ambulatorios/hospitalarios *(V1+)* | DB *(plan)* |
| **Formulario** | Blueprints, validación campos | `packages/clinical-forms` |
| **Borrador** | Estados draft → approved | API drafts, DB |
| **Aprobación** | Transición humana, no automática | API approvals |
| **Registro clínico** | Notas y datos aprobados versionados | DB clinical_notes, versions |
| **Seguridad clínica** | CDS advisory | `clinical-domain/clinicalSafety` |
| **Decisiones clínicas** | CDR advisory | `clinical-domain/clinicalDecisionRules` |
| **Documento** | Archivos, OCR, versiones *(V1)* | *(plan EPIS2-11)* |
| **Conocimiento** | RAG, embeddings *(V1)* | PostgreSQL pgvector + contratos |
| **Interoperabilidad** | FHIR export/import frontera | `packages/fhir-export`, API fhir |
| **Inteligencia** | Assist, intent futuro | `services/local-ai`, proxy API ai |
| **Tablero** | Agregación worklist *(V0+)* | *(plan EPIS2-12)* |
| **Auditoría** | Eventos append-only | DB audit_events |
| **Localización** | Chile RUT, futuro CIE/GES | `clinical-domain/chile` |

---

## 3. Flujo entre dominios

```text
[Comando]
    → Command Registry valida intent
    → RBAC valida permiso
    → Router devuelve routePath + blueprintId
[UI Página clínica]
    → clinical-forms renderiza blueprint
    → Borrador API crea/actualiza draft
[IA opcional]
    → local-ai propone campos
    → contracts validan schema
    → policy: nunca persiste nota final
[Humano]
    → approve → Registro clínico + versión
    → Auditoría registra actor + payload hash
```

---

## 4. `packages/clinical-actions` (futuro)

Concepto EPIONE **Clinical Action Engine**, reescrito:

```text
packages/clinical-actions/
  ├─ catalog/          # Acciones declarativas (id, permiso, blueprint, audit)
  ├─ resolver/         # intent → actionId (subconjunto, no 117 ids crudos)
  └─ index.ts
```

Reglas:

- Cada acción referencia **un** blueprint o ruta EPIS2.
- Sin ejecutores que escriban SoT sin borrador.
- Sin UI acoplada.

Estado: **○ planificado V2** — no existe paquete aún; no crear registry paralelo al command-registry.

---

## 5. Capas de policy

| Capa | Función | Bloquea guardado |
|------|---------|------------------|
| RBAC | ¿Puede el rol? | Sí (HTTP 403) |
| Validación formulario | ¿Campos válidos? | Sí (cliente/API) |
| CDS/CDR | Alertas demo | **No** (advisory) |
| IA schema | ¿JSON válido? | Rechaza sugerencia, no borrador humano |
| Aprobación | ¿Humano autorizado? | Requisito para nota final |

---

## 6. Fronteras externas

| Sistema | Relación |
|---------|----------|
| Ollama | HTTP solo desde `local-ai` / proxy API |
| FHIR | Export/import en frontera; no modelo UI |
| HL7 v2 | V4 — adaptadores staging |
| EPIS / EPIDOS / EPIONE | Solo lectura → manifiesto → cuarentena |

---

## 7. Evolución por versión de producto

| Versión | Dominios que crecen |
|---------|---------------------|
| V0 | Comando, borrador, tablero work |
| V1 | Encuentro, documento, timeline, RAG |
| V2 | Hospitalización, órdenes, tablero servicio, clinical-actions |
| V3 | Enfermería, farmacia, MAR |
| V4 | Interop, administración |
| V5 | Inteligencia avanzada (siempre subordinada) |

---

## Referencias

- [EPIS2_SINGLE_SOURCE_OF_TRUTH.md](./EPIS2_SINGLE_SOURCE_OF_TRUTH.md)
- [../ARCHITECTURE_TARGET.md](../ARCHITECTURE_TARGET.md)
- [../intelligence/EPIS2_OLLAMA_CAPABILITY_PLAN.md](../intelligence/EPIS2_OLLAMA_CAPABILITY_PLAN.md)
