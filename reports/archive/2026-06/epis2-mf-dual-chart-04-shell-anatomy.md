# MF-DUAL-CHART-04 — Anatomía shell v2

**Estado:** DONE  
**Gate:** `npm run quality:dual-chart-shell-anatomy-gate`  
**Fecha:** 2026-06-10

## Alcance

Cuatro capas fijas del canon visual en `ClinicalShell`:

| Capa | Componente |
|------|------------|
| 1 | `ClinicalInstitutionalHeader` — azul marino `#0B2540`, usuario, logout |
| 2 | `PatientIdentityBand` — identidad, alergias siempre visibles, estado documento |
| 3 | `ClinicalActionBar` — modos, acciones frecuentes, comando (Ctrl+K) |
| 4 | `ClinicalFooterStatus` — confidencialidad, autoguardado, estado legal |

Tokens: `epis2ClinicalShellTokens` en `chart-modes-tokens.ts`.  
Microcopy: `copy.chartModes.*` ampliado.

## Archivos

- `apps/web/src/components/chart/ClinicalInstitutionalHeader.tsx`
- `apps/web/src/components/chart/PatientIdentityBand.tsx`
- `apps/web/src/components/chart/ClinicalActionBar.tsx`
- `apps/web/src/components/chart/ClinicalFooterStatus.tsx`
- `apps/web/src/components/chart/ClinicalShell.tsx` — composición 4 capas
- `apps/web/src/pages/DualChartPatientPage.tsx` — props identidad demo
- `packages/epis2-ui/src/theme/chart-modes-tokens.ts`
- `packages/design-system/src/copy/es.ts`

## Gates

```bash
npm run quality:dual-chart-shell-anatomy-gate
npm run quality:dual-chart-scaffold-gate
npm run check
```

## Riesgos

- Acciones Guardar/Firmar/Imprimir visibles pero sin wiring SoT completo hasta fases posteriores.
- Header institucional duplica info de usuario respecto al layout `/espacio` legacy (transición ADR-002).

## Próximo paso

**MF-DUAL-CHART-05** — `TraditionalSectionNav`, panel denso, contexto colapsable.
