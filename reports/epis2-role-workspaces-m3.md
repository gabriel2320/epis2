# EPIS2 — Espacios de trabajo por rol (MD3)

**Fecha:** 2026-06-04  
**Alcance:** Conciliación arquitectónica del inventario 1–200 vía workspaces; conmutador N0 en Navigation Rail.

---

## Entregables

| Artefacto | Ruta |
|-----------|------|
| Tipos workspace | `packages/epis2-ui/src/clinical/clinical-workspace.types.ts` |
| Registry + rutas | `apps/web/src/navigation/clinicalWorkspaceRegistry.ts` |
| Hook persistencia | `apps/web/src/navigation/useClinicalWorkspace.ts` |
| Rail conmutador | `apps/web/src/navigation/epis2NavigationRail.tsx` |
| Preferencia `clinicalWorkspace` | `EpisThemePreferences` (localStorage v2) |
| Copy español | `packages/design-system/src/copy/es.ts` → `workspaces.*` |
| Canon diseño | `docs/design/EPIS2_ROLE_WORKSPACES_M3.md` |
| Matriz IDC → workspace | `docs/product/EPIS2_INVENTORY_WORKSPACE_MATRIX.md` |
| Tests | `clinicalWorkspaceRegistry.test.ts`, `EpisNavigationRail.test.tsx` (divider) |

---

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK |
| `npm run test` | OK — 397 tests |
| `npm run db:validate` | OK — 31 migraciones |

---

## Decisiones

1. **Cinco workspaces** — `command`, `ambulatory`, `icu`, `quality_iaas`, `admin_system`; home sigue siendo Comando.
2. **Rail bifurcado** — conmutador superior (5 íconos) + divisor + ítems contextuales del workspace activo.
3. **Persistencia** — `clinicalWorkspace` en preferencias de tema (misma clave localStorage que densidad/modo).
4. **Rutas disabled** — UCI y varios ítems IAAS marcados `disabled: true` hasta olas 13/16; evita prometer flujos MISSING.
5. **Anidación** — documentada; lazy/cross-link/empty ya parcialmente soportados por `EpisClinicalForm` (`initialVisibility: 'collapsed'`) y copy `workspaces.nesting.*`.

---

## Riesgos

| Riesgo | Mitigación |
|--------|------------|
| Rail más alto (5 + divider + N ítems) | Tooltips MD3; scroll interno si crece en móvil |
| Duplicidad agenda Comando vs Ambulatorio | Ambulatorio reutiliza `/epis2/dashboard?tab=work` hasta tablero dedicado Ola 2 |
| Cross-link IAAS sin UI | Próximo: Expandable Card en evolución UCI (Ola 13) |
| IDC 2–10 recepción fuera de workspaces | Tablero operativo paralelo — no mezclar con home Comando |

---

## Próximo paso exacto

1. **Ola 2** — tabs N2 ambulatorio (`patientTabIds` en registry) + scrollspy IDC 31–36.
2. **Ola 13** — habilitar rail UCI y sábana 24h.
3. **Cross-link** — botón `workspaces.nesting.crossLinkIaas` en evolución con card inline.

---

## Referencias

- [`EPIS2_ROLE_WORKSPACES_M3.md`](../docs/design/EPIS2_ROLE_WORKSPACES_M3.md)
- [`EPIS2_INVENTORY_WORKSPACE_MATRIX.md`](../docs/product/EPIS2_INVENTORY_WORKSPACE_MATRIX.md)
