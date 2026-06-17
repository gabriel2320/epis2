# MF-170 — Cola de formularios

**Estado:** DONE | **Ola:** 3 | **Fecha:** 2026-06-04

## Alcance
Cerrar ola 3: registry único completo y automatización para siguientes blueprints.

## Entregables
- 18 entradas en `EPIS2_FORM_BLUEPRINTS` (`registry.ts`)
- `assertRegistryInvariants()` (intents ↔ blueprints)
- `scripts/quality/scaffold-mf-blueprint.mjs`
- Migración `028_wave3_form_draft_types.sql`

## Gates
Invariantes registry en CI; `npm run check`; ledger MF-170 DONE.

## Riesgos
Nuevos intents sin blueprint rompen gates hasta nueva microfase.

## Próximo paso
MF-171 — `GET /api/admin/users` y UI usuarios.
