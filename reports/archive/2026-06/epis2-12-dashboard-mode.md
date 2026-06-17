# EPIS2-12 — Modo tablero básico

**Fecha:** 2026-06-04  
**Gate V0:** journey dorado + Modo tablero «Mi trabajo»

## Entregado

- Ruta `/epis2/dashboard` (no es home; index sigue en `/comando`).
- Intents `open_dashboard*` en `packages/command-registry` con permiso `dashboard.read`.
- API `GET /api/dashboard/work` + auditoría `dashboard.opened`.
- Contrato `packages/contracts/src/dashboard.ts`.
- UI `DashboardModePage`: pestañas Mi trabajo / Paciente / Servicio (V1/V2 placeholder).
- Acceso desde Centro de Comando: botón «Modo tablero» y comandos NL.
- Pacientes recientes en `sessionStorage` (`recentPatients.ts`).
- Tests: router, API, página, golden journey paso 10.

## Verificación

```bash
npm run test
npm run check
```

## Siguiente fase recomendada

Cerrar gate V0 humano (checklist piloto + pasos 11–12 journey) o iniciar V1 longitudinal según [EPIS2_RELEASE_ROADMAP.md](../docs/product/EPIS2_RELEASE_ROADMAP.md).
