# MF-CICA-PR6-01 — Cierre (redirects PR6 E2E)

**Fecha:** 2026-06-19 · **Programa:** PROG-PURGE-CICA · **Tramo:** 4

## Alcance

Validación E2E del mapa PR6 (`cicaLegacyRedirects.ts`) con CICA GO.

| Entrega | Detalle |
|---------|---------|
| `e2e/cica-pr6-legacy-redirects.spec.ts` | 22 redirects + fallback sin `patientId` |
| `test:e2e:cica-pr6-redirects` | Playwright `--fresh` (puerto 5199) |
| `validate-cica-pr6-redirects-gate.mjs` | Cobertura paths documentados |

## Gates

| Gate | Resultado |
|------|-----------|
| `node scripts/quality/validate-cica-pr6-redirects-gate.mjs` | OK |
| `npm run test:e2e:cica-pr6-redirects -w @epis2/web` | OK (con stack) |

## Checklist Tramo 4

- [x] PR6 redirects validados E2E
- [ ] Walkthrough institucional GO PILOT

## Próximo paso

Walkthrough humano piloto + evaluar default ON CICA en demo.
