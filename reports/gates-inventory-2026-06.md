# EPIS2 — Inventario gates (read-only)

**Generado:** 2026-06-16 · **Comando:** `node tools/gates/inventory-orphans.mjs`

## Resumen

| Métrica | Valor |
|---------|-------|
| Entradas catálogo activo | 40 |
| Entradas archived | 248 |
| Scripts validate-* en disco | 263 |
| quality:* en package.json root | 5 |
| Referenciados (manifiestos + close-gates) | 15 |
| Solo catálogo (no wired) | 25 |
| Disco sin catálogo | 11 |

## Gates wired (CI / manifiestos / close-gates)

- `quality:case-intel-closure-gate`
- `quality:cds-hooks-gate`
- `quality:ci-parity`
- `quality:clinical`
- `quality:dual-chart-gate`
- `quality:evolab-bridge-gate`
- `quality:fast`
- `quality:ficha-first-gate`
- `quality:golden-journey`
- `quality:layers-integration-gate`
- `quality:medrepo-consumption-gate`
- `quality:openapi-gate`
- `quality:openclaw-gate`
- `quality:pm01`
- `quality:strengthen-close-gate`

## Catálogo-only — candidatos a archivo (muestra acción sugerida)

| Gate | Acción sugerida |
|------|-----------------|
| `quality:agent-truth-gate` | catalog-only — revisar |
| `quality:core-no-labs-imports-gate` | catalog-only — revisar |
| `quality:demo-safety-gate` | catalog-only — revisar |
| `quality:deps-hygiene-gate` | catalog-only — revisar |
| `quality:dual-chart-paper-layout-gate` | catalog-only — revisar |
| `quality:dual-chart-traditional-layout-gate` | catalog-only — revisar |
| `quality:e2e-transversal-bar-gate` | catalog-only — revisar |
| `quality:ficha-first-next` | archive-candidate (PROG-FICHA-FIRST) |
| `quality:ficha-norm-signoff-gate` | archive-candidate (PROG-FICHA-FIRST) |
| `quality:gates-inventory-gate` | catalog-only — revisar |
| `quality:gates-prune-phase1-gate` | catalog-only — revisar |
| `quality:gates-prune-phase2-gate` | catalog-only — revisar |
| `quality:legal-disclaimer-gate` | catalog-only — revisar |
| `quality:rapid-gate` | catalog-only — revisar |
| `quality:registry-gate` | catalog-only — revisar |
| `quality:root-script-surface-gate` | catalog-only — revisar |
| `quality:security-promote-gate` | catalog-only — revisar |
| `quality:sh-03-degrade-gate` | archive-candidate (PROG-STRENGTHEN) |
| `quality:strengthen-next` | catalog-only — revisar |
| `quality:three-modes-gate` | archive-candidate (PROG-THREE-MODES) |
| `quality:tramos-hygiene-gate` | catalog-only — revisar |
| `quality:ux-g02` | catalog-only — revisar |
| `quality:ux-lab-autopilot-gate` | catalog-only — revisar |
| `quality:ux-lab-close` | catalog-only — revisar |
| `quality:ux-pilot-gate` | catalog-only — revisar |

## Scripts en disco sin entrada catálogo

- `quality:aesthetic-action-density-gate`
- `quality:aesthetic-layout-gate`
- `quality:aesthetic-reset-close-gate`
- `quality:cica-loop-close-gate`
- `quality:cica-screen-admission-gate`
- `quality:cica-screen-inventory-gate`
- `quality:classic-chart-composition-gate`
- `quality:clinical-command-bar-transversal-gate`
- `quality:clinical-navigation-clarity-gate`
- `quality:no-horizontal-overflow-gate`
- `quality:paper-mode-standalone-gate`

## Catálogo apunta a script faltante

- `quality:ci-parity`

## Próximo paso

Catálogo podado phase 1+2. Regenerar inventario tras cambios: `node tools/gates/inventory-orphans.mjs`.
