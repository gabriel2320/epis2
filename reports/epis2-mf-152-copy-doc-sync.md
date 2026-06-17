# EPIS2 — MF-152 Corrección copy español y deriva documental

**Fecha:** 2026-06-05  
**Ola:** 0 — Verdad operativa y gates  
**Alcance:** Copy visible en `copy/es.ts`; sincronización documental §7 SCREEN_CONNECTION_MAP; sin cambios clínica/API/BD.

---

## 1. Copy centralizado

| Componente | Antes | Después |
|------------|-------|---------|
| `QualityDashboardTab.tsx` | Métricas hardcodeadas (`Pacientes`, `IA runs`, etc.) | `copy.interop.metric*` (6 claves) |
| `DocumentSearchPanel.tsx` | `Tipo`, `Título`, defaults demo hardcodeados | `copy.longitudinal.intakeTypeLabel`, `intakeTitleLabel`, `intakeTitleDefault`, `intakeDocumentFallback` |

**Archivo SoT:** `packages/design-system/src/copy/es.ts`

- `interop.metricPatients`, `metricOpenDrafts`, `metricApprovedNotes`, `metricAudit24h`, `metricAiRuns`, `metricCriticalUnacked`
- `longitudinal.intakeTypeLabel`, `intakeTitleLabel`, `intakeTitleDefault`, `intakeDocumentFallback`

**Tests actualizados:** `QualityDashboardTab.test.tsx` (aserciones vía `copy.interop`).

---

## 2. Deriva documental corregida

| Documento | Cambio |
|-----------|--------|
| `docs/product/EPIS2_SCREEN_CONNECTION_MAP.md` §7 | C3, C5, C6 → RESUELTO; C4 → PARCIAL; C1/C2/C7 sin cambio |
| `reports/archive/2026-06/epis2-complete-product-gap-audit.md` | Nota supersession WIDGET-01 / documentos UI |
| `reports/archive/2026-06/epis2-project-audit-2026-06-05.md` | Nota piloto → GO DEMO |

---

## 3. Gates

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK — 15/15 architecture gates |
| `npm run test` | OK — 299 passed, 20 skipped |
| `npm run db:validate` | OK — 22 migraciones |
| `npm run ai:evals` | OK — 5 casos |
| `npm run quality:microphases` | OK — próxima READY: MF-153 |

---

## 4. Ledger

- **MF-152:** DONE  
- **MF-153:** READY — Paridad local con CI y PostgreSQL

---

## 5. Riesgos

- Copy demo (`Nota clínica demo`) sigue siendo texto de demostración; aceptable en MVP, no PHI.
- C4 (traslado) permanece abierto; fuera de alcance MF-152.

---

## 6. Próximo paso

**MF-153** — Documentar `DATABASE_URL` para tests de integración y eliminar skips silenciosos (10 suites `skipIf(!DATABASE_URL)`).
