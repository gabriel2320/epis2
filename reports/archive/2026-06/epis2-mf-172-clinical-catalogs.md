# MF-172 — Catálogos clínicos

**Estado:** DONE | **Ola:** 4 | **Fecha:** 2026-06-04

## Alcance
Catálogos en tabla staging (no SoT); GET/POST con auditoría.

## Entregables
- `029_clinical_catalog_staging.sql`, Drizzle `clinicalCatalogStaging`
- `GET/POST /api/admin/catalogs`
- Pestaña Catálogos en consola admin; evento `admin.catalog.created`

## Gates
`npm run db:validate` tras 029; `npm run check`; staging ≠ datos aprobados.

## Riesgos
Uso directo en formularios sin promoción a catálogo productivo.

## Próximo paso
MF-173 — pestaña auditoría (`/api/audit/events`).
