# MF-KNIP-00 — Cierre (Knip audit-only config)

**Fecha:** 2026-06-18 · **Programa:** PROG-PONYTAIL-TRIM + Knip audit

## Alcance

Formalizar Knip como herramienta de auditoría confiable — **sin borrar código ni deps**.

## Archivos tocados

| Archivo | Cambio |
|---------|--------|
| `knip.json` | Workspaces monorepo + entry scripts/tools/gates + ignores archive |
| `package.json` | `devDependency` knip + script `knip:audit` |
| `package-lock.json` | Lock knip |

## Qué se eliminó

Nada (audit-only).

## Qué evitamos construir

- Borrado automático guiado por 483 falsos positivos sin config
- Mega-PR mezclando poda Knip + CICA

## Baseline Knip (post-config)

| Métrica | Antes | Después |
|---------|-------|---------|
| Unused files (total repo) | 483 | **38** |
| Unused files `apps/web/src/cica/**` | n/a | **0** |
| Config hints | 4 workspaces sin config | 32 (refinamiento futuro) |

Comando: `npm run knip:audit`

Hallazgos CICA actuales = **exports** no usados (p. ej. re-export `CICA_CHART_TAB_REGISTRY.ts`) — candidatos MF-PONY-07-cont / MF-KNIP-02, no delete-safe aún.

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run quality:fast` | OK |

## Riesgos residuales

- 38 unused files restantes requieren revisión humana (design-agents, components legacy)
- Root Storybook deps ignoradas en workspace `.` vía `ignoreDependencies` (hoist npm)
- `knip:audit` no está en CI — solo local hasta MF-KNIP-01/02

## Próximo paso

**MF-KNIP-01** — generar `reports/knip-audit-pony-2026-06-18.md` y priorizar delete-safe por zona.
