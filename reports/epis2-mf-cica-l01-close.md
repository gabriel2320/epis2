# MF-CICA-L01 — Cierre (Buscar + Censo)

**Fecha:** 2026-06-18 · **Programa:** PROG-PURGE-CICA · **Loop:** CICA-L-01

## Alcance

Reformulación P0 `/app/buscar` + `/app/censo` según wireframe aprobado.

| Entrega | Detalle |
|---------|---------|
| `auditCicaScreen` | Perfil `systemWorkspace` (sin banda paciente / barra NL) |
| `cicaSystemScreenAudit.ts` | Score GO buscar + censo |
| `CicaCensusPage` | Subtitle copy canónico |
| Ledger | `reports/cica-l/01-censo-reform.md` fases A/C/F |

## Gates

| Gate | Resultado |
|------|-----------|
| `node scripts/quality/validate-cica-l01-gate.mjs` | OK |
| `npm run quality:clinical` | OK |

## Pendiente humano

Walkthrough censo → ficha antes de activar `VITE_ENABLE_CICA_UI` default ON.

## Próximo paso

Validar golden journey `/app/*` con flag CICA ON (Tramo 4 reform plan).
