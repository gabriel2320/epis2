# EPIS2 — Inventario gates (read-only)

**Generado:** 2026-06-16 · **Comando:** `node tools/gates/inventory-orphans.mjs`

## Resumen

| Métrica | Valor |
|---------|-------|
| Entradas catálogo | 285 |
| Scripts validate-* en disco | 261 |
| quality:* en package.json root | 5 |
| Referenciados (manifiestos + close-gates) | 90 |
| Solo catálogo (no wired) | 195 |
| Disco sin catálogo | 12 |

## Gates wired (CI / manifiestos / close-gates)

- `quality:ai`
- `quality:ai-catalog-smoke-gate`
- `quality:ai-client-gate`
- `quality:ai-tramo-evals-gate`
- `quality:calm-premium-signoff`
- `quality:case-intel-assist-gate`
- `quality:case-intel-catalog-gate`
- `quality:case-intel-closure-gate`
- `quality:case-intel-gate`
- `quality:cds-hooks-gate`
- `quality:ci-parity`
- `quality:clinical`
- `quality:dev-agent-low-risk-write-gate`
- `quality:dev-agent-ollama-automation-gate`
- `quality:dev-agent-orchestration-gate`
- `quality:dev-env-gate`
- `quality:di-autocomplete-gate`
- `quality:di-context-gate`
- `quality:di-journeys-gate`
- `quality:di-memory-gate`
- `quality:di-next`
- `quality:di-prefill-gate`
- `quality:di-signoff-gate`
- `quality:di-suggestions-gate`
- `quality:di-templates-gate`
- `quality:di-timeline-gate`
- `quality:dual-chart-gate`
- `quality:dual-chart-ledger`
- `quality:dual-chart-plan`
- `quality:evolab-bridge-gate`
- `quality:fast`
- `quality:ficha-first-gate`
- `quality:ficha-first-next`
- `quality:ficha-norm-signoff-gate`
- `quality:full`
- `quality:golden-journey`
- `quality:interop-chile-gate`
- `quality:layers-integration-gate`
- `quality:local-ci`
- `quality:m3-human-pilot`
- `quality:m3-signoff`
- `quality:m3-visual-pass`
- `quality:medrepo-consumption-gate`
- `quality:microphase-next`
- `quality:microphases`
- `quality:openapi-gate`
- `quality:openclaw-cycle-gate`
- `quality:openclaw-gate`
- `quality:paper-mode-next`
- `quality:pilot-trial`
- `quality:pm01`
- `quality:pm03-orchestration-gate`
- `quality:rapid-gate`
- `quality:registry-status`
- `quality:sh-03-degrade-gate`
- `quality:stack-dev-gate`
- `quality:strengthen-close-gate`
- `quality:strengthen-next`
- `quality:three-modes-gate`
- `quality:tramo-a-closure-gate`
- `quality:tramo-b-closure-gate`
- `quality:tramo-c-closure-gate`
- `quality:tramo-closure-evals-gate`
- `quality:tramo-d-closure-gate`
- `quality:tramo-e-closure-gate`
- `quality:tramo-e2e-registry-gate`
- `quality:tramo-f-closure-gate`
- `quality:tramo-g-closure-gate`
- `quality:tramo-h-closure-gate`
- `quality:tramo-i-closure-gate`
- `quality:tramo-j-closure-gate`
- `quality:tramo-k-closure-gate`
- `quality:tramo-k-inventory-gate`
- `quality:tramo-scaffold-canon-gate`
- `quality:tramos-ak-closure-gate`
- `quality:tramos-clinical-signoff-gate`
- `quality:tramos-clinical-signoff-session`
- `quality:tramos-hygiene-gate`
- `quality:tramos-signoff-prep-gate`
- `quality:tres-frentes-next`
- `quality:ui`
- `quality:ui-simplify-gate`
- `quality:ux-g02`
- `quality:ux-lab-close`
- `quality:ux-pilot`
- `quality:ux-pilot-gate`
- `quality:web-ai-boundary-gate`
- `quality:week2-gate`
- `quality:week3-gate`
- `quality:week4-gate`

## Catálogo-only — candidatos a archivo (muestra acción sugerida)

| Gate | Acción sugerida |
|------|-----------------|
| `quality:agent-truth-gate` | catalog-only — revisar |
| `quality:ai-ext-inference-gate` | catalog-only — revisar |
| `quality:ai-otel-gate` | catalog-only — revisar |
| `quality:ai-provenance-gate` | catalog-only — revisar |
| `quality:auto-dev-6h-gate` | catalog-only — revisar |
| `quality:autocomplete-gate` | catalog-only — revisar |
| `quality:bulk-actions-gate` | catalog-only — revisar |
| `quality:case-intel-promote-gate` | catalog-only — revisar |
| `quality:classic-actionrail-gate` | catalog-only — revisar |
| `quality:classic-commandbar-gate` | catalog-only — revisar |
| `quality:classic-fixed-panels-gate` | catalog-only — revisar |
| `quality:classic-md3-ai-mode-gate` | archive-candidate (PROG-THREE-MODES) |
| `quality:classic-md3-mode-gate` | archive-candidate (PROG-THREE-MODES) |
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
| `quality:cm-01-barra-gate` | archive-candidate (Olas / TE / PA) |
| `quality:cm-02-palette-gate` | archive-candidate (Olas / TE / PA) |
| `quality:cm-03-assist-route-gate` | archive-candidate (Olas / TE / PA) |
| `quality:cm-04-context-gate` | archive-candidate (Olas / TE / PA) |
| `quality:cm-05-panel-ia-gate` | archive-candidate (Olas / TE / PA) |
| `quality:cm-06-assist-draft-gate` | archive-candidate (Olas / TE / PA) |
| `quality:cm-07-evals-gate` | archive-candidate (Olas / TE / PA) |
| `quality:cm-08-signoff-gate` | archive-candidate (Olas / TE / PA) |
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
| `quality:dashboard-md3-mode-gate` | archive-candidate (PROG-THREE-MODES) |
| `quality:dashboard-mode-isolation-gate` | catalog-only — revisar |
| `quality:dashboard-screenshot-advisory` | catalog-only — revisar |
| `quality:dashboard-secondary-gate` | catalog-only — revisar |
| `quality:demo-safety-gate` | catalog-only — revisar |
| `quality:deps-hygiene-gate` | catalog-only — revisar |
| `quality:design-agent-schemas-gate` | catalog-only — revisar |
| `quality:design-agents-gate` | catalog-only — revisar |
| `quality:design-mode-gate` | catalog-only — revisar |
| `quality:doc-screen-catalog-gate` | catalog-only — revisar |
| `quality:draft-trace-gate` | catalog-only — revisar |
| `quality:drag-drop-safety-gate` | catalog-only — revisar |
| `quality:dual-chart-census-gate` | catalog-only — revisar |
| `quality:dual-chart-launcher-gate` | catalog-only — revisar |
| `quality:dual-chart-legacy-freeze-gate` | catalog-only — revisar |
| `quality:dual-chart-next` | archive-candidate (histórico) |
| `quality:dual-chart-paper-layout-gate` | catalog-only — revisar |
| `quality:dual-chart-paper-sot-gate` | catalog-only — revisar |
| `quality:dual-chart-router-gate` | catalog-only — revisar |
| `quality:dual-chart-scaffold-gate` | catalog-only — revisar |
| `quality:dual-chart-shell-anatomy-gate` | catalog-only — revisar |
| `quality:dual-chart-traditional-gate` | catalog-only — revisar |
| `quality:dual-chart-traditional-layout-gate` | catalog-only — revisar |
| `quality:duplicate-actions-gate` | catalog-only — revisar |
| `quality:e2e-transversal-bar-gate` | catalog-only — revisar |
| `quality:experiencia-core-signoff-gate` | catalog-only — revisar |
| `quality:ficha-norm-benchmark-gate` | archive-candidate (PROG-FICHA-FIRST) |
| `quality:ficha-norm-density-gate` | archive-candidate (PROG-FICHA-FIRST) |
| `quality:ficha-norm-mirror-b1-gate` | archive-candidate (PROG-FICHA-FIRST) |
| `quality:ficha-norm-mirror-b2-gate` | archive-candidate (PROG-FICHA-FIRST) |
| `quality:ficha-norm-motion-gate` | archive-candidate (PROG-FICHA-FIRST) |
| `quality:ficha-norm-theme-gate` | archive-candidate (PROG-FICHA-FIRST) |
| `quality:ficha-norm-typography-gate` | archive-candidate (PROG-FICHA-FIRST) |
| `quality:form-collapse-gate` | catalog-only — revisar |
| `quality:form-screen-tree-gate` | catalog-only — revisar |
| `quality:grid-surface-gate` | catalog-only — revisar |
| `quality:icon-budget-gate` | catalog-only — revisar |
| `quality:im-02-embed-gate` | catalog-only — revisar |
| `quality:legal-disclaimer-gate` | catalog-only — revisar |
| `quality:login-command-home-gate` | archive-candidate (PROG-FICHA-FIRST) |
| `quality:m3-scaffold-gate` | archive-candidate (Olas / TE / PA) |
| `quality:mode-guards-gate` | archive-candidate (PROG-THREE-MODES) |
| `quality:mode-safety-gate` | archive-candidate (PROG-THREE-MODES) |
| `quality:mode-switcher-gate` | archive-candidate (PROG-THREE-MODES) |
| `quality:mode-transitions-gate` | archive-candidate (PROG-THREE-MODES) |
| `quality:ola1c-imaging-gate` | archive-candidate (Olas / TE / PA) |
| `quality:ola1c-journey-gate` | archive-candidate (Olas / TE / PA) |
| `quality:ola2-m3-ui-gate` | archive-candidate (Olas / TE / PA) |
| `quality:ola2-physical-exam-gate` | archive-candidate (Olas / TE / PA) |
| `quality:ola3-alerts-gate` | archive-candidate (Olas / TE / PA) |
| `quality:ola3-ficha-depth-gate` | archive-candidate (Olas / TE / PA) |
| `quality:ola3-ficha-gate` | archive-candidate (Olas / TE / PA) |
| `quality:ola3-ficha-hub-gate` | archive-candidate (Olas / TE / PA) |
| `quality:ola3-longitudinal-gate` | archive-candidate (Olas / TE / PA) |
| `quality:ola3-surgical-gate` | archive-candidate (Olas / TE / PA) |
| `quality:ola3-timeline-gate` | archive-candidate (Olas / TE / PA) |
| `quality:ola6a-print-gate` | archive-candidate (Olas / TE / PA) |
| `quality:ollama-structured-output-gate` | catalog-only — revisar |
| `quality:paper-chart-section-tree-gate` | catalog-only — revisar |
| `quality:paper-mode-ai-commands-gate` | catalog-only — revisar |
| `quality:paper-mode-ai-meta-gate` | catalog-only — revisar |
| `quality:paper-mode-doc-bridge-gate` | catalog-only — revisar |
| `quality:paper-mode-fichapapel-reference-gate` | catalog-only — revisar |
| `quality:paper-mode-fields-gate` | catalog-only — revisar |
| `quality:paper-mode-nav-gate` | catalog-only — revisar |
| `quality:paper-mode-pagination-gate` | catalog-only — revisar |
| `quality:paper-mode-signoff-gate` | catalog-only — revisar |
| `quality:paper-mode-tokens-gate` | catalog-only — revisar |
| `quality:paper-mode-toolbar-gate` | catalog-only — revisar |
| `quality:paper-planner-ai-gate` | archive-candidate (histórico) |
| `quality:paper-planner-gates` | archive-candidate (histórico) |
| `quality:paper-planner-month-gate` | archive-candidate (histórico) |
| `quality:paper-planner-print-gate` | archive-candidate (histórico) |
| `quality:paper-planner-scaffold-gate` | archive-candidate (histórico) |
| `quality:paper-planner-week-gate` | archive-candidate (histórico) |
| `quality:quality-aliases-gate` | catalog-only — revisar |
| `quality:rad-m3-discipline-gate` | catalog-only — revisar |
| `quality:rag-retrieval-gate` | catalog-only — revisar |
| `quality:registry-gate` | catalog-only — revisar |
| `quality:registry-meta-gate` | catalog-only — revisar |
| `quality:role-care-separation-gate` | catalog-only — revisar |
| `quality:root-script-surface-gate` | catalog-only — revisar |
| `quality:scroll-discipline-gate` | catalog-only — revisar |
| `quality:security-promote-gate` | catalog-only — revisar |
| `quality:sh-02-intent-evals-gate` | archive-candidate (PROG-STRENGTHEN) |
| `quality:sh-05-rls-gate` | archive-candidate (PROG-STRENGTHEN) |
| `quality:sh-06-migration-gate` | archive-candidate (PROG-STRENGTHEN) |
| `quality:spellcheck-gate` | catalog-only — revisar |
| `quality:split-pane-gate` | catalog-only — revisar |
| `quality:te-02-sections-gate` | archive-candidate (Olas / TE / PA) |
| `quality:te-04-sections-gate` | archive-candidate (Olas / TE / PA) |
| `quality:te-06-supporting-pane-gate` | archive-candidate (Olas / TE / PA) |
| `quality:te-07-tabular-gate` | archive-candidate (Olas / TE / PA) |
| `quality:te-08-signoff-gate` | archive-candidate (Olas / TE / PA) |
| `quality:three-modes-design-agents-gate` | archive-candidate (PROG-THREE-MODES) |
| `quality:tramo-b-reception-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-b-ui-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-c-admission-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-c-census-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-c-emergency-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-c-epicrisis-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-c-mar-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-c-orders-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-c-trends-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-d-flowsheet-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-d-fluid-balance-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-d-hemodynamics-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-d-icu-discharge-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-d-icu-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-d-invasive-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-d-inventory-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-d-neurological-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-d-sedoanalgesia-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-d-severity-scales-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-d-vasoactive-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-d-ventilation-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-e-audit-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-e-inventory-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-e-or-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-e-preanesthesia-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-e-scaffold-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-e-who-checklist-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-f-aps-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-f-audit-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-f-inventory-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-f-scaffold-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-g-audit-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-g-inventory-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-g-scaffold-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-g-specialized-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-h-audit-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-h-iaas-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-h-inventory-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-h-scaffold-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-i-audit-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-i-inventory-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-i-scaffold-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-i-specialty-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-j-audit-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-j-inventory-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-j-pharmacy-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-j-scaffold-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-k-audit-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-k-quality-gate` | archive-candidate (Tramos A–K) |
| `quality:tramo-k-scaffold-gate` | archive-candidate (Tramos A–K) |
| `quality:ui-density-gate` | catalog-only — revisar |
| `quality:ux-lab-autopilot` | catalog-only — revisar |
| `quality:ux-lab-autopilot-gate` | catalog-only — revisar |
| `quality:ux-lab-autopilot-pr` | catalog-only — revisar |
| `quality:visual-density-agent-gate` | catalog-only — revisar |

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
- `quality:gates-inventory-gate`
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
