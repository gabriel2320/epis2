# EPIS2-10 — Interoperabilidad FHIR (export)

**ID:** EPIS2-10  
**Estado:** Completada  
**Fecha:** 2026-06-04

---

## Entregables

| Área | Implementación |
|------|----------------|
| Paquete | `@epis2/fhir-export` — mappers R4, perfiles Zod, `assertExportClean` |
| API | `GET /api/fhir/Patient|Encounter|DocumentReference|ServiceRequest/:id`, bundle por paciente |
| Permiso | `fhir.export` (médico, enfermería, farmacia, admin, auditor) |
| Docs | `docs/fhir/EPIS2_MINIMAL_EXPORT_PROFILE.md` |
| Arquitectura | Validador `fhir-export-boundary` (sin FHIR en UI) |

---

## Gates

| Criterio | ✓ |
|----------|---|
| Export valida perfil mínimo | Zod + tests mappers |
| Sin campos UI-only | `UI_ONLY_EXPORT_KEYS` + `bodyToNarrative` filtra claves |
| FHIR ≠ modelo UI | Sin imports en `apps/web` |
| Import diferido | `importEnabled: false` en `/api/fhir/status` |

---

## Uso

```bash
# Tras login (cookie de sesión)
curl -H "Cookie: epis2_session=..." \
  http://localhost:3001/api/fhir/patients/{uuid}/bundle
```

---

## Próximo paso

**EPIS2-11** — QA humano y piloto demo (journey dorado E2E).

---

## Commit sugerido

```text
feat(epis2-10): FHIR R4 export boundary with minimal profile validation
```
