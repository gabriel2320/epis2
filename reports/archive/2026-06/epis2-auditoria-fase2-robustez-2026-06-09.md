# EPIS2 — Fase 2 auditoría: robustez SoT + E2E impresión (2026-06-09)

**Alcance declarado:** Fase 2 del plan en [`epis2-auditoria-profunda-2026-06-09.md`](./epis2-auditoria-profunda-2026-06-09.md) §7.

---

## Entregas

| # | Acción | Archivos |
|---|--------|----------|
| 2.1 | **Transacción siempre en `approveDraft`** (hallazgo C3): nota + versión + approval + side-effects por `draftType` + auditoría en una sola transacción; con RLS `enforce` anida como savepoint | `apps/api/src/clinical/service.ts` |
| 2.2 | E2E receta A5: journey CTA → sessionStorage preview → `/espacio/receta/imprimir` → documento A5 | `e2e/ola6a-print-prescription.spec.ts` |
| 2.3 | Set CI `test:e2e` ampliado con impresión (certificado + receta) → **12 tests** (antes 10); nuevo atajo `test:e2e:print` | `package.json` |
| 2.4 | Test integración `closeEncounter`: aprobar `outpatient_visit` con `closeEncounter` cierra episodio abierto (gap Hilo B) | `apps/api/src/clinical/closeEncounter.integration.test.ts` |
| 2.5 | `verifySessionToken` valida rol con `isClinicalRole()` — rechaza JWT con rol forjado (hallazgo A3) | `apps/api/src/auth/sessionToken.ts` · `sessionToken.test.ts` |

## Gates

| Gate | Resultado |
|------|-----------|
| vitest dirigido (sessionToken 3 · auth 6 · integración clinical/admission/MAR/closeEncounter 8) | OK 17/17 |
| `npm run test:e2e` (set CI ampliado, incl. impresión) | OK **12/12** |
| `quality:ola6a-print-gate` | OK |
| `npm run typecheck -w @epis2/api` | OK |
| `npm run check` | OK |

## Decisiones

- La auditoría (`appendAudit`) queda **dentro** de la transacción: si la aprobación falla, no queda evento de una aprobación inexistente.
- El estado `ready_for_review` **no** se hizo obligatorio para aprobar (hallazgo A4) — cambio de proceso clínico, se difiere a decisión de producto (Fase 5 / pre-producción).
- CI sube de 10 → 12 E2E (~+8s estimado por los dos specs de impresión).

## Riesgos

- Transacción anidada (RLS enforce → savepoint): cubierta por integración con `RLS_MODE` del entorno de test.
- Tokens de sesión existentes no se invalidan; solo se endurece la verificación.

## Próximo paso exacto

**Fase 3** (auditoría §7): pulido M3 — `palette.tertiary` runtime, `EpisDraftStatus` con roles clínicos, refactor `AdminConsolePage`, motion auto-sync.
