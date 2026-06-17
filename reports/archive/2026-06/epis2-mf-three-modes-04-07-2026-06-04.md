# MF-THREE-MODES-04…07 — Cierre automatizado

**Fecha:** 2026-06-04  
**Programa:** PROG-THREE-MODES · **Roadmap:** EPIS2-PM-01

## Alcance

| MF | Estado | Entregable |
|----|--------|------------|
| **04** Router tipado | **DONE** | `validateSearch` en `/comando` (`parseCommandSearch`) y `/espacio/ficha` (`parseClinicalPatientSearch`); tests `clinicalNavigate.test.ts` |
| **05** Dashboard→Classic | **DONE** | Top bar + detail pane pasan `activeTab` a `openClassicMode`; tests `modeTransitions.test.ts` |
| **06** Migración imports | **DONE** | Consumidores importan desde `modes/index`; `ClassicMd3PreferencesSection` sin shim `userPreferences` |
| **07** Journey E2E | **DONE** | `e2e/three-modes-journey.spec.ts` · script `npm run test:e2e:three-modes` |

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK |
| `npm run db:validate` | OK |
| `npm run quality:three-modes-gate` | OK (exige E2E spec + parse en router) |
| `vitest run apps/web` | OK (154 tests) |

## Riesgos

1. **MF-08** sigue bloqueado: gates `classic-md3-mode` / `dashboard-md3-mode` exigen archivos shim; eliminarlos requiere actualizar esos gates en sesión dedicada.
2. **E2E** depende de API + PostgreSQL demo (`:5433`); ejecutar con stack levantado antes de PM01-E en CI.
3. Chips dashboard legacy (no MD3) en `DashboardModeContent` aún navegan sin sesión — fuera de alcance MD3.

## Próximo paso

1. **MF-THREE-MODES-08** — retirar shims y actualizar gates classic/dashboard MD3.
2. Integrar `test:e2e:three-modes` en pipeline CI post-MVP (PM01-E).
3. Marcar **Fase UX-1** cerrada en plan global tras E2E verde en CI.

## Comandos

```bash
npm run check
npm run quality:three-modes-gate
npm run test:e2e:three-modes   # requiere DB demo + dev servers
```
