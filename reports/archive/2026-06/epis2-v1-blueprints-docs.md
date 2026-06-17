# EPIS2 V1 — Blueprints y búsqueda de documentos

**Commit:** slice post-V1 longitudinal.

## Entregables

- Blueprints **interconsulta** (`/espacio/interconsulta`) e **imagenología** (`/espacio/imagenologia`).
- Intents `request_referral`, `request_imaging` en command-registry.
- API `GET /api/patients/:id/documents/search?q=` (búsqueda por título/ref, sin RAG).
- UI `DocumentSearchPanel` en ficha longitudinal.

## Verificación

`interconsulta` / `pedir tac` desde Centro de Comando; búsqueda «laboratorio» en ficha DEMO-001.
