# EPIS2 — Arquitectura objetivo

**Fase:** EPIS2-00 · **Implementación:** EPIS2-01 en adelante

---

## Vista general

```text
┌──────────────────────────────────────────────┐
│              EPIS2 Web App                   │
│ React + TypeScript + Vite + Material UI      │
│ TanStack Router · TanStack Query             │
│                                              │
│ Login → Command Center → Clinical Workspace  │
└──────────────────────┬───────────────────────┘
                       │ HTTPS / JSON
┌──────────────────────▼───────────────────────┐
│                EPIS2 API                     │
│ Fastify + TypeScript · Drizzle ORM           │
│ Auth · RBAC · Commands · Clinical · Drafts   │
│ Approval · Audit · Validation (Zod/shared)   │
└───────────────┬────────────────────┬─────────┘
                │                    │
┌───────────────▼──────────┐  ┌──────▼──────────────┐
│ PostgreSQL               │  │ Local AI Service    │
│ Fuente de verdad clínica │  │ Ollama (separado)   │
│ Migraciones versionadas  │  │ Salidas estructuradas│
└──────────────────────────┘  └─────────────────────┘
                │
┌───────────────▼──────────────────────────────┐
│ FHIR Compatibility Boundary (EPIS2-10+)      │
│ Import/export — no modelo de UI              │
└──────────────────────────────────────────────┘
```

---

## Monorepo objetivo (EPIS2-01)

```text
epis2/
├─ apps/
│  ├─ web/                 # React + Vite + MUI
│  └─ api/                 # Fastify + Drizzle
├─ services/
│  └─ local-ai/            # Cliente Ollama; schemas
├─ packages/
│  ├─ contracts/           # Zod / JSON Schema compartidos
│  ├─ clinical-domain/     # Tipos y reglas de dominio
│  ├─ command-registry/    # Intents, slots, routing
│  ├─ clinical-forms/      # Blueprints declarativos
│  ├─ design-system/       # Tema MUI EPIS2
│  └─ test-fixtures/        # Datos sintéticos
├─ database/
│  ├─ migrations/
│  └─ seeds/
├─ docs/
├─ reports/
└─ scripts/
```

---

## Frontend

| Tecnología | Uso |
|------------|-----|
| React 18+ | UI |
| TypeScript strict | Tipado |
| Vite | Build/dev |
| Material UI | Componentes + tema centralizado |
| TanStack Router | Rutas tipadas |
| TanStack Query | Datos servidor |
| Formularios declarativos | Desde blueprints en `clinical-forms` |

**Regla:** una sola acción principal por pantalla; sin menús hospitalarios extensos.

---

## Backend

| Tecnología | Uso |
|------------|-----|
| Fastify | API HTTP, plugins |
| Drizzle ORM | Acceso tipado a PostgreSQL |
| PostgreSQL | SoT clínica, auditoría append-only |
| Zod (en `contracts`) | Validación compartida API ↔ web ↔ IA |

Módulos API sugeridos: `auth`, `rbac`, `patients`, `encounters`, `commands`, `drafts`, `approvals`, `audit`, `ai-proxy`.

---

## IA local (`services/local-ai`)

- Proceso o servicio **separado** del API clínico.
- Entrada/salida solo **objetos JSON** validados por schema.
- Capacidades: clasificar intent, extraer slots, resumir contexto existente, proponer borrador, detectar faltantes.
- **Nunca:** aprobar, firmar, SQL, escritura en tablas `clinical_*` aprobadas.

Degradación: si Ollama no responde, command registry + formularios manuales siguen operativos.

---

## Modelo de datos (núcleo)

Separación obligatoria:

```text
clinical source of truth  ≠  AI suggestions / drafts
```

Tablas iniciales (EPIS2-04): `users`, `roles`, `user_roles`, `patients`, `patient_identifiers`, `encounters`, `clinical_notes`, `clinical_note_versions`, `problems`, `observations`, `medications`, `medication_orders`, `service_requests`, `documents`, `command_sessions`, `clinical_drafts`, `draft_versions`, `approvals`, `audit_events`, `ai_runs`.

UUID, FK, constraints, timestamps, autor en cada escritura.

---

## FHIR (frontera, EPIS2-10)

Recursos objetivo export (orden): Patient, Encounter, DocumentReference, ServiceRequest; luego Condition, Observation, MedicationRequest, Practitioner.

FHIR **no** define pantallas ni formularios visibles.

---

## Infra local (EPIS2-01)

Docker Compose **solo** para:

- PostgreSQL  
- Ollama (opcional en dev)

Sin OpenMRS, sin Redis obligatorio en v1 (evaluar en spike Medplum si aplica).

---

## Seguridad (diseño)

- RBAC en aplicación (fuente primaria).
- RLS PostgreSQL como defensa adicional (post-MVP operativo).
- Secretos vía `.env`; nunca en repo.
- Autenticación demo ≠ autenticación producción — revisión especializada antes de PHI real.
