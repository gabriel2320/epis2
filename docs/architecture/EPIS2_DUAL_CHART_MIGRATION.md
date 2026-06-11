# EPIS2 — Migración dual ficha (desde comando / classic / dashboard)

**ADR:** [`ADR-002`](../adr/ADR-002-dual-chart-modes.md) · **Rutas:** [`EPIS2_DUAL_CHART_ROUTE_MAP.md`](./EPIS2_DUAL_CHART_ROUTE_MAP.md)

---

## Inventario legacy

| Superficie | Rutas | Estado post-migración |
|------------|-------|------------------------|
| Centro de Comando | `/comando` | Fase 3: launcher; mantiene home invariante |
| Modo clásico MD3 | `?mode=classic` + ficha/formularios | **Congelado** — paridad bugfix only |
| Dashboard MD3 | `/epis2/dashboard?mode=dashboard` | **Congelado** — turno legacy |
| Ficha modern | `/espacio/ficha` stack UX-B | Reemplazada por `chartMode=traditional` |
| Three-modes switcher | `EpisModeSwitcher` | Deprecar UI fase 4; mantener deep links |

---

## Fase 0 — Scaffold (actual)

- [x] ADR-002, mapa rutas, tokens `chartModes`
- [x] `ClinicalShell`, `TraditionalEhrMode`, `PaperChartMode`
- [x] `PaperChartTemplate` (7 secciones MVP)
- [x] Storybook + E2E bajo `VITE_ENABLE_DUAL_CHART_MODES`
- [x] Plan automatizado PROG-DUAL-CHART (`EPIS2_DUAL_CHART_DEV_PLAN.md` + ledger + gates)

**Automatización:**

```bash
npm run quality:dual-chart-ledger      # validar ledger
npm run quality:dual-chart-next        # fase READY (JSON)
npm run dev:dual-chart:session         # brief de sesión
npm run quality:dual-chart-plan -- --phase 0 --verify
```

**Flag:** `.env` → `VITE_ENABLE_DUAL_CHART_MODES=true`  
**Preview:** `/dev/chart-modes?patientId=…`

---

## Fase 1 — Paridad visual traditional

1. Migrar `PatientClinicalSummaryGrid` → área central `TraditionalEhrMode`
2. Nav lateral alineada a Figma Medical Record
3. Panel derecho IA/contexto (supporting pane ≥1280px)
4. Command bar dock en `ClinicalShell` — todas las rutas `/espacio/*`

**No tocar:** tests `three-modes-journey.spec.ts`

---

## Fase 2 — Modo papel SoT

1. Blueprint Zod `paper-chart-section` por sección I–VII
2. API borrador por sección (PostgreSQL JSONB column o drafts existentes)
3. Print preview `/espacio/ficha/imprimir`
4. `@page` Carta + A5 en `paperChartPrint.css`

**Gate:** `quality:golden-journey` extensión papel

---

## Fase 3 — Router switch

```tsx
// PatientWorkspacePage.tsx (pseudocódigo)
if (isDualChartModesEnabled() && chartMode) {
  return <DualChartPatientPage ... />;
}
// legacy paths unchanged
```

Default `chartMode=traditional` cuando hay `patientId`.

---

## Fase 4 — Congelar legacy shells

- Banner deprecación en `EpisModeSwitcher` classic/dashboard
- Redirect suave: `?mode=classic` → `chartMode=traditional` (302 search rewrite)
- Mantener dashboard para turno hasta signoff

---

## Fase 5 — Comando launcher

- Reducir hero comando a búsqueda paciente + sugerencias
- Propuesta enmienda `PRODUCT_INVARIANTS.md` #6: *Home = Command launcher; ficha = workspace clínico principal*

---

## Matriz de tests

| Test | Fase | Acción |
|------|------|--------|
| `three-modes-journey.spec.ts` | 0–3 | Sin cambios |
| `dual-chart-modes.spec.ts` | 0+ | Opt-in flag CI |
| `PatientWorkspacePage.test.tsx` | 3 | Añadir rama dual mock |
| Storybook chart modes | 0 | Siempre |

---

## Rollback

Desactivar `VITE_ENABLE_DUAL_CHART_MODES=false` — zero impacto producción.
