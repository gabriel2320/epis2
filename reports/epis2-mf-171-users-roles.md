# MF-171 — Usuarios y roles

**Estado:** DONE | **Ola:** 4 | **Fecha:** 2026-06-04

## Alcance
Listado read-only de usuarios app para admin demo (sin CRUD ni OIDC provisión).

## Entregables
- `GET /api/admin/users` (`admin.users.read`)
- `adminApi.ts` → `fetchAdminUsers`
- Pestaña Usuarios en `AdminConsolePage.tsx`

## Gates
`npm run check`; permisos/RLS; solo usuarios sintéticos demo.

## Riesgos
Mutación de roles y usuarios reales de piloto fuera de alcance.

## Próximo paso
MF-172 — catálogos staging (migración 029).
