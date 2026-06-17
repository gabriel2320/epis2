# EPIS2 — Fase 1 auditoría: higiene (2026-06-09)

**Alcance declarado:** Fase 1 del plan en [`epis2-auditoria-profunda-2026-06-09.md`](./epis2-auditoria-profunda-2026-06-09.md) §7 — sync documental + 4 fixes puntuales de bajo riesgo.

---

## Entregas

| # | Acción | Archivos |
|---|--------|----------|
| 1.1 | Sync documental piloto M3 verde + HEAD `2d77bfe` + nueva auditoría enlazada | `docs/product/EPIS2_TABLERO.md` · `docs/product/EPIS2_GLOBAL_DEV_PLAN.md` · `reports/archive/2026-06/epis2-auditoria-fase1-higiene-2026-06-09.md` |
| 1.2 | Rail: etiquetas 11px → `labelMedium` 13px (se elimina override `fontSize: 0.6875rem`) | `packages/epis2-ui/src/clinical/EpisNavigationRail.tsx` |
| 1.3 | Preview A5: `boxShadow: 1` → borde tonal (`border: 1, borderColor: 'divider'`) — THEME-06 | `packages/epis2-ui/src/print/PrintA5Document.tsx` |
| 1.4 | Gate dev-catalog cubre `/dev/scheduler-spike` (`isSchedulerSpikeEnabled` + flag documentado) | `scripts/architecture/dev-catalog-gates.mjs` · `.env.example` |
| 1.5 | Permiso explícito `admin.catalogs.write` (solo rol `admin`) en `POST /api/admin/catalogs` — antes `audit.read` permitía escritura a auditor | `packages/clinical-domain/src/permissions.ts` · `rbac.ts` · `rbac.test.ts` · `apps/api/src/admin/routes.ts` |

## Gates

| Gate | Resultado |
|------|-----------|
| `architecture:validate` (incl. dev-catalog ampliado, explicit-permissions) | OK 17/17 |
| vitest dirigido (rbac 6 · PrintA5 · receta/cert print · navigation rail) | OK 11/11 |
| `npm run check` | OK |

## Riesgos

- `admin.catalogs.write`: el rol `auditor` pierde capacidad de POST en catálogos staging (era el bug M5); la lectura GET no cambia.
- Sin cambios de comportamiento en impresión real (`@media print` ya quitaba la sombra; ahora quita el borde).

## Próximo paso exacto

**Fase 2** (auditoría §7): transacción siempre en `approveDraft` (C3) + E2E receta A5 + ampliar set `test:e2e` de CI con impresión.
