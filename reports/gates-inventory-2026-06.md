# EPIS2 — Inventario gates (read-only)

**Generado:** 2026-06-16 · **Comando:** `node tools/gates/inventory-orphans.mjs`

## Resumen

| Métrica | Valor |
|---------|-------|
| Entradas catálogo activo | 184 |
| Entradas archived | 103 |
| Scripts validate-* en disco | 262 |
| quality:* en package.json root | 5 |
| Referenciados (manifiestos + close-gates) | 15 |
| Solo catálogo (no wired) | 169 |
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
| `quality:ai` | catalog-only — revisar |
| `quality:ai-catalog-smoke-gate` | catalog-only — revisar |
| `quality:ai-client-gate` | catalog-only — revisar |
| `quality:ai-ext-inference-gate` | catalog-only — revisar |
| `quality:ai-otel-gate` | catalog-only — revisar |
| `quality:ai-provenance-gate` | catalog-only — revisar |
| `quality:ai-tramo-evals-gate` | catalog-only — revisar |
| `quality:auto-dev-6h-gate` | catalog-only — revisar |
| `quality:autocomplete-gate` | catalog-only — revisar |
| `quality:bulk-actions-gate` | catalog-only — revisar |
| `quality:calm-premium-signoff` | catalog-only — revisar |
| `quality:case-intel-assist-gate` | catalog-only — revisar |
| `quality:case-intel-catalog-gate` | catalog-only — revisar |
| `quality:case-intel-gate` | catalog-only — revisar |
| `quality:case-intel-promote-gate` | catalog-only — revisar |
| `quality:classic-actionrail-gate` | catalog-only — revisar |
| `quality:classic-commandbar-gate` | catalog-only — revisar |
| `quality:classic-fixed-panels-gate` | catalog-only — revisar |
| `quality:classic-mode-isolation-gate` | catalog-only — revisar |
| `quality:classic-screenshot-advisory` | catalog-only — revisar |
| `quality:classic-statusbar-gate` | catalog-only — revisar |
| `quality:classic-supporting-pane-gate` | catalog-only — revisar |
| `quality:clinical-ai-text-safety-gate` | catalog-only — revisar |
| `quality:clinical-form-rhf-gate` | catalog-only — revisar |
| `quality:clinical-grid-gate` | catalog-only — revisar |
| `quality:clinical-productivity-gate` | catalog-only — revisar |
| `quality:clinical-snippets-gate` | catalog-only — revisar |
| `quality:clinical-spellcheck-gate` | catalog-only — revisar |
| `quality:clinical-spellcheck-integration` | catalog-only — revisar |
| `quality:clinical-textbox-assist-gate` | catalog-only — revisar |
| `quality:clinical-textbox-gate` | catalog-only — revisar |
| `quality:command-center-googlebar-gate` | catalog-only — revisar |
| `quality:command-center-hub-gate` | catalog-only — revisar |
| `quality:command-center-layout-gate` | catalog-only — revisar |
| `quality:command-palette-gate` | catalog-only — revisar |
| `quality:copy-paste-safety-gate` | catalog-only — revisar |
| `quality:core-no-labs-imports-gate` | catalog-only — revisar |
| `quality:dashboard-bulk-actions-gate` | catalog-only — revisar |
| `quality:dashboard-data-quality-gate` | catalog-only — revisar |
| `quality:dashboard-design-agents-gate` | catalog-only — revisar |
| `quality:dashboard-grid-surface-gate` | catalog-only — revisar |
| `quality:dashboard-kpi-actionability-gate` | catalog-only — revisar |
| `quality:dashboard-mode-isolation-gate` | catalog-only — revisar |
| `quality:dashboard-screenshot-advisory` | catalog-only — revisar |
| `quality:dashboard-secondary-gate` | catalog-only — revisar |
| `quality:demo-safety-gate` | catalog-only — revisar |
| `quality:deps-hygiene-gate` | catalog-only — revisar |
| `quality:design-agent-schemas-gate` | catalog-only — revisar |
| `quality:design-agents-gate` | catalog-only — revisar |
| `quality:design-mode-gate` | catalog-only — revisar |
| `quality:dev-agent-low-risk-write-gate` | catalog-only — revisar |
| `quality:dev-agent-ollama-automation-gate` | catalog-only — revisar |
| `quality:dev-agent-orchestration-gate` | catalog-only — revisar |
| `quality:dev-env-gate` | catalog-only — revisar |
| `quality:di-autocomplete-gate` | catalog-only — revisar |
| `quality:di-context-gate` | catalog-only — revisar |
| `quality:di-journeys-gate` | catalog-only — revisar |
| `quality:di-memory-gate` | catalog-only — revisar |
| `quality:di-next` | catalog-only — revisar |
| `quality:di-prefill-gate` | catalog-only — revisar |
| `quality:di-signoff-gate` | catalog-only — revisar |
| `quality:di-suggestions-gate` | catalog-only — revisar |
| `quality:di-templates-gate` | catalog-only — revisar |
| `quality:di-timeline-gate` | catalog-only — revisar |
| `quality:doc-screen-catalog-gate` | catalog-only — revisar |
| `quality:draft-trace-gate` | catalog-only — revisar |
| `quality:drag-drop-safety-gate` | catalog-only — revisar |
| `quality:dual-chart-census-gate` | catalog-only — revisar |
| `quality:dual-chart-launcher-gate` | catalog-only — revisar |
| `quality:dual-chart-ledger` | catalog-only — revisar |
| `quality:dual-chart-legacy-freeze-gate` | catalog-only — revisar |
| `quality:dual-chart-paper-layout-gate` | catalog-only — revisar |
| `quality:dual-chart-paper-sot-gate` | catalog-only — revisar |
| `quality:dual-chart-plan` | catalog-only — revisar |
| `quality:dual-chart-router-gate` | catalog-only — revisar |
| `quality:dual-chart-scaffold-gate` | catalog-only — revisar |
| `quality:dual-chart-shell-anatomy-gate` | catalog-only — revisar |
| `quality:dual-chart-traditional-gate` | catalog-only — revisar |
| `quality:dual-chart-traditional-layout-gate` | catalog-only — revisar |
| `quality:duplicate-actions-gate` | catalog-only — revisar |
| `quality:e2e-transversal-bar-gate` | catalog-only — revisar |
| `quality:experiencia-core-signoff-gate` | catalog-only — revisar |
| `quality:ficha-first-next` | archive-candidate (PROG-FICHA-FIRST) |
| `quality:ficha-norm-signoff-gate` | archive-candidate (PROG-FICHA-FIRST) |
| `quality:form-collapse-gate` | catalog-only — revisar |
| `quality:form-screen-tree-gate` | catalog-only — revisar |
| `quality:full` | catalog-only — revisar |
| `quality:gates-inventory-gate` | catalog-only — revisar |
| `quality:gates-prune-phase1-gate` | catalog-only — revisar |
| `quality:grid-surface-gate` | catalog-only — revisar |
| `quality:icon-budget-gate` | catalog-only — revisar |
| `quality:im-02-embed-gate` | catalog-only — revisar |
| `quality:interop-chile-gate` | catalog-only — revisar |
| `quality:legal-disclaimer-gate` | catalog-only — revisar |
| `quality:local-ci` | catalog-only — revisar |
| `quality:m3-human-pilot` | archive-candidate (Olas / TE / PA) |
| `quality:m3-signoff` | archive-candidate (Olas / TE / PA) |
| `quality:m3-visual-pass` | archive-candidate (Olas / TE / PA) |
| `quality:microphase-next` | archive-candidate (histórico) |
| `quality:microphases` | archive-candidate (histórico) |
| `quality:ollama-structured-output-gate` | catalog-only — revisar |
| `quality:openclaw-cycle-gate` | catalog-only — revisar |
| `quality:paper-chart-section-tree-gate` | catalog-only — revisar |
| `quality:paper-mode-ai-commands-gate` | catalog-only — revisar |
| `quality:paper-mode-ai-meta-gate` | catalog-only — revisar |
| `quality:paper-mode-doc-bridge-gate` | catalog-only — revisar |
| `quality:paper-mode-fichapapel-reference-gate` | catalog-only — revisar |
| `quality:paper-mode-fields-gate` | catalog-only — revisar |
| `quality:paper-mode-nav-gate` | catalog-only — revisar |
| `quality:paper-mode-next` | catalog-only — revisar |
| `quality:paper-mode-pagination-gate` | catalog-only — revisar |
| `quality:paper-mode-signoff-gate` | catalog-only — revisar |
| `quality:paper-mode-tokens-gate` | catalog-only — revisar |
| `quality:paper-mode-toolbar-gate` | catalog-only — revisar |
| `quality:pilot-trial` | catalog-only — revisar |
| `quality:pm03-orchestration-gate` | catalog-only — revisar |
| `quality:quality-aliases-gate` | catalog-only — revisar |
| `quality:rad-m3-discipline-gate` | catalog-only — revisar |
| `quality:rag-retrieval-gate` | catalog-only — revisar |
| `quality:rapid-gate` | catalog-only — revisar |
| `quality:registry-gate` | catalog-only — revisar |
| `quality:registry-meta-gate` | catalog-only — revisar |
| `quality:registry-status` | catalog-only — revisar |
| `quality:role-care-separation-gate` | catalog-only — revisar |
| `quality:root-script-surface-gate` | catalog-only — revisar |
| `quality:scroll-discipline-gate` | catalog-only — revisar |
| `quality:security-promote-gate` | catalog-only — revisar |
| `quality:sh-03-degrade-gate` | archive-candidate (PROG-STRENGTHEN) |
| `quality:spellcheck-gate` | catalog-only — revisar |
| `quality:split-pane-gate` | catalog-only — revisar |
| `quality:stack-dev-gate` | catalog-only — revisar |
| `quality:strengthen-next` | catalog-only — revisar |
| `quality:three-modes-gate` | archive-candidate (PROG-THREE-MODES) |
| `quality:tramo-a-closure-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-b-closure-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-c-closure-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-closure-evals-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-d-closure-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-e-closure-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-e2e-registry-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-f-closure-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-g-closure-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-h-closure-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-i-closure-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-j-closure-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-k-closure-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-scaffold-canon-gate` | archive-candidate (Tramos A–K) |
| `quality:tramos-ak-closure-gate` | catalog-only — revisar |
| `quality:tramos-clinical-signoff-gate` | catalog-only — revisar |
| `quality:tramos-clinical-signoff-session` | catalog-only — revisar |
| `quality:tramos-hygiene-gate` | catalog-only — revisar |
| `quality:tramos-signoff-prep-gate` | catalog-only — revisar |
| `quality:tres-frentes-next` | catalog-only — revisar |
| `quality:ui` | catalog-only — revisar |
| `quality:ui-density-gate` | catalog-only — revisar |
| `quality:ui-simplify-gate` | catalog-only — revisar |
| `quality:ux-g02` | catalog-only — revisar |
| `quality:ux-lab-autopilot` | catalog-only — revisar |
| `quality:ux-lab-autopilot-gate` | catalog-only — revisar |
| `quality:ux-lab-autopilot-pr` | catalog-only — revisar |
| `quality:ux-lab-close` | catalog-only — revisar |
| `quality:ux-pilot` | catalog-only — revisar |
| `quality:ux-pilot-gate` | catalog-only — revisar |
| `quality:visual-density-agent-gate` | catalog-only — revisar |
| `quality:web-ai-boundary-gate` | catalog-only — revisar |
| `quality:week2-gate` | archive-candidate (histórico) |
| `quality:week3-gate` | archive-candidate (histórico) |
| `quality:week4-gate` | archive-candidate (histórico) |

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
- `quality:classic-screenshot-advisory`
- `quality:clinical-spellcheck-integration`
- `quality:dashboard-screenshot-advisory`
- `quality:dual-chart-ledger`
- `quality:microphases`

## Próximo paso (PR chore/gates-prune-phase1)

1. Mover gates `archive-candidate` a sección `archived` en catálogo (no borrar `.mjs`).
2. Mantener wired + gates de programas activos (AEST, ficha-first, paper standalone, e2e-transversal).
3. Regenerar con `node tools/gates/inventory-orphans.mjs` tras poda.
