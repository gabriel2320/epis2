# MF-177 — Backup y restauración

**Estado:** DONE | **Ola:** 5 | **Fecha:** 2026-06-04

## Alcance
Restaurar volcados de `npm run db:backup`; PostgreSQL = SoT.

## Entregables
- `scripts/epis-db-restore.mjs`
- Script `db:restore` en `package.json`

## Gates
`npm run db:validate` post-restore; prueba en BD descartable; `npm run check`.

## Riesgos
Restore en producción sin ventana; `DATABASE_URL` con privilegios altos.

## Próximo paso
MF-178 — signoff M3, modo oscuro y offline (**READY**).
