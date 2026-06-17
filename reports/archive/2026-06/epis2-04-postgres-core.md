# EPIS2-04 — Núcleo PostgreSQL

**ID:** EPIS2-04  
**Estado:** Completada  
**Fecha:** 2026-06-04

---

## Entregables

| Área | Implementación |
|------|----------------|
| Migraciones | `003_core_clinical.sql`, `004_seed_synthetic.sql` |
| Drizzle | `apps/api/src/db/schema.ts` |
| Pacientes | `GET /api/patients`, `GET /api/patients/:id` |
| Borradores | `POST/PATCH /api/drafts`, versiones en `draft_versions` |
| Aprobación | `POST /api/drafts/:id/approve` → `clinical_notes` + `approvals` |
| Auditoría | `audit_events` en PostgreSQL (fallback memoria sin `DATABASE_URL`) |
| Seeds | 3 pacientes DEMO + usuarios app |

---

## Gates

| Criterio | ✓ |
|----------|---|
| Escrituras con autor + timestamp | columnas `created_by`, `updated_by`, `created_at`, `updated_at` |
| Borradores ≠ notas finales | consultas separadas; test integración (con DB) |
| `npm run db:validate` | 4 migraciones |

---

## Uso local

```bash
docker compose up -d
# .env con DATABASE_URL=postgresql://epis2:epis2@127.0.0.1:5432/epis2
npm run db:migrate
npm run dev:api
```

---

## Próximo paso

**EPIS2-05** — Command Registry y router.

---

## Commit sugerido

```text
feat(epis2-04): PostgreSQL clinical core with drafts and approvals

Add core schema migrations, Drizzle models, patient/draft/approval API,
persistent audit events, and synthetic demo seeds.
```
