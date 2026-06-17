# EPIS2 — Conciliación del árbol de navegación

**Fecha:** 2026-06-04  
**Alcance:** Unificar workspaces MD3, rutas, 18 blueprints e inventario IDC 1–200 en un árbol canónico verificable.

---

## Entregables

| Artefacto | Ruta |
|-----------|------|
| Árbol canónico (doc) | `docs/architecture/EPIS2_RECONCILED_NAVIGATION_TREE.md` |
| Registry verificable | `apps/web/src/navigation/epis2NavigationTree.ts` |
| Tests invariantes | `apps/web/src/navigation/epis2NavigationTree.test.ts` |
| Cross-refs | inventario maestro · workspaces M3 · auditoría global |

---

## Resumen de conciliación

| Capa | Antes | Después |
|------|-------|---------|
| 200 IDC | Inventario disperso | → 5 workspaces + matriz ola |
| Menú | Riesgo menú único | → Rail conmutador N0 + contextual |
| Rutas (~25) | Auditoría suelta | → ~30 nodos en `EPIS2_NAVIGATION_TREE` |
| 18 formularios | Catálogo aparte | → Mapeados a workspace, tab, IDC |
| Home | Canon verbal | → Gate test: `/comando`, dashboard ≠ command |

---

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK |
| `npm run test` | OK — 402 tests |
| `npm run db:validate` | OK — 31 migraciones |

---

## Riesgos

1. Tab **Certificados** planificado en workspace ambulatorio — aún no en `patientChartNavigation.ts` (Ola 2).
2. Cross-link IAAS documentado pero sin UI inline.
3. Recepción IDC 2–10 permanece fuera de workspaces (tablero paralelo Ola 4).

---

## Próximo paso

**Ola 2:** tab Certificados + scrollspy consulta ambulatoria IDC 31–36 en workspace `ambulatory`.
