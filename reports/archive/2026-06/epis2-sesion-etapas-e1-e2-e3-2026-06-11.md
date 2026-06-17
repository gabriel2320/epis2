# EPIS2 — Sesión Etapas E1 · E2 · E3 (Hilo C)

**Fecha:** 2026-06-11  
**Alcance SDEPIS2:** Hilo C · Entrega C-4 (parcial) · Etapas diseño E1–E3  
**Canon:** `EPIS2_TRADITIONAL_M3_SHAPE_COLOR_PLAN.md` · `EPIS2_DUAL_CHART_VISUAL_CANON.md`

---

## Etapa E1 — Evaluación baseline (Bloque 0)

### Gates ejecutados

| Gate | Resultado |
|------|-----------|
| `npm run check` | PASS |
| `npm run quality:dual-chart-ledger` | PASS — 10/10 MF DONE |
| `npm run test:unit:chart` | PASS — 3/3 |
| `npm run theme:validate` | **FAIL** — `validate-no-hardcoded-colors` (preexistente en `chart-modes-tokens.ts`, shell chart) |

### Inventario forma

| Fuente | Estado |
|--------|--------|
| `packages/epis2-ui/src/theme/shape.ts` | Escala 0–10px alineada MD3 comprimido |
| `island-layout.ts` | `island: 8px` ✓ |
| `components.ts` (pre-E3) | Chips `pill` 8px — ajustado en E3 |

### Inventario color

| Perfiles MTB registrados | 7/8 |
| Gap | `clinical-calm` (#0B5C66) pendiente → Etapa E4 |

### Veredicto E1

**GO con nota** — baseline código OK; `theme:validate` hex en tokens chart es deuda conocida (no bloquea E2/E3).

---

## Etapa E2 — Entrega C-4 (activación dual ficha)

### Cambios

1. **CI job `e2e-dual-chart`** — build + E2E con `VITE_ENABLE_DUAL_CHART_MODES=true` (opt-in, job principal sin flag).
2. **`.env.example`** — documentación local/E2E/staging.
3. **Tablero** — C-4 parcial: CI opt-in ✓; prod flag off.

### Criterios Entrega C-4

| Criterio | Estado |
|----------|--------|
| E2E `dual-chart-modes.spec.ts` en CI | ✓ job dedicado |
| Flag off en CI principal (legacy E2E) | ✓ sin cambio job `check` |
| Activación prod/staging | Pendiente decisión humana |

### Gates previstos post-merge

`quality:dual-chart-gate` · `test:e2e:dual-chart` (job CI)

---

## Etapa E3 — Forma cuadrada traditional

### Cambios código

| Archivo | Cambio |
|---------|--------|
| `shape.ts` | `epis2TraditionalShapeMaxPx`, `epis2ShapeProfiles` (traditional vs command) |
| `shape.test.ts` | Tests perfil EMR ≤ 10px, chips/campos 4px |
| `components.ts` | `MuiChip` → `traditional.chip` (4px); `MuiOutlinedInput` → `traditional.field` (4px) |
| `chart-modes-tokens.ts` | Papel preview `borderRadius: 4px` explícito; print `0` sin cambio |

### Criterio Done (parcial plan visual)

- [x] Perfil traditional documentado en código
- [x] Chips y campos EMR 4px global theme
- [ ] Storybook traditional light/dark (E3.5 — siguiente sesión)
- [ ] 8º paleta `clinical-calm` (E4)

---

## Riesgos

- `theme:validate` sigue FAIL por hex en tokens chart — resolver en tramo THEME-CALM-01 (migrar a roles tema).
- Prod: no activar `VITE_ENABLE_DUAL_CHART_MODES=true` hasta signoff humano C-1/C-2.

---

## Próximo paso

1. **Etapa E4** — `clinical-calm.material-theme.json` + registry 8/8  
2. **Etapa E5** — barra comando unificada censo + ficha  
3. **C-3b** — MF-CLINICAL-SUMMARY-B datos

```bash
npm run dev:session
# @reports/dev-agent-brief.md + layers-integrator (E4/E5)
```
