# MF-151 — Gobernanza del programa de microfases

## Estado
DONE

## Objetivo

Establecer una única fuente de verdad para el programa MF-151…MF-182: ledger JSON, validación automatizada, comandos de selección y documentación de gobernanza — **sin modificar** comportamiento clínico, UI clínica, APIs ni base de datos.

## Estado previo verificado

| Item | Resultado |
|------|-----------|
| Auditoría base | `reports/archive/2026-06/epis2-comprehensive-audit-2026-06-05.md` |
| `git status` | Limpio salvo auditoría sin track |
| `npm run check` | OK (preflight) |
| MVP V0–V5 | Cerrado según auditoría |
| Ledger previo | No existía; plantilla `MICROPHASE_TEMPLATE.md` refería EPIS2-NN |

## Cambios realizados

1. **Ledger canónico** `docs/quality/microphase-ledger.json` — 32 microfases (MF-151…MF-182) con dependencias, estados, evidencia y reportes esperados.
2. **Programa** `docs/quality/MICROPHASE_PROGRAM.md` — reglas operativas y olas.
3. **Puntero canónico** `docs/quality/MICROPHASE_LEDGER_CANONICAL.md` — sin duplicar JSON.
4. **Scripts** `scripts/quality/microphase-ledger-lib.mjs`, `validate-microphase-ledger.mjs`, `microphase-next.mjs`.
5. **npm scripts** `quality:microphases`, `quality:microphase-next`.
6. **AGENTS.md** y **MICROPHASE_TEMPLATE.md** alineados al programa MF-XXX.

## Archivos modificados

| Archivo | Tipo |
|---------|------|
| `docs/quality/microphase-ledger.json` | nuevo |
| `docs/quality/MICROPHASE_PROGRAM.md` | nuevo |
| `docs/quality/MICROPHASE_LEDGER_CANONICAL.md` | nuevo |
| `scripts/quality/microphase-ledger-lib.mjs` | nuevo |
| `scripts/quality/validate-microphase-ledger.mjs` | nuevo |
| `scripts/quality/microphase-next.mjs` | nuevo |
| `scripts/quality/validate-microphase-ledger.test.mjs` | nuevo |
| `package.json` | scripts npm |
| `AGENTS.md` | guía agentes |
| `docs/MICROPHASE_TEMPLATE.md` | plantilla MF-XXX |
| `reports/epis2-mf-151-governance.md` | este reporte |

## Tests creados o modificados

- `scripts/quality/validate-microphase-ledger.test.mjs` — ledger válido; próxima READY = MF-152.

## Gates ejecutados y resultados

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK |
| `npm run test` | OK (incluye test ledger) |
| `npm run db:validate` | OK |
| `npm run ai:evals` | OK |
| `npm run qa:bundle-analyze` | OK |
| `npm run quality:microphases` | OK — próxima READY: **MF-152** |
| `npm run quality:microphase-next` | OK — JSON MF-152 |

## Evidencia funcional

```bash
npm run quality:microphases
# [OK] Próxima READY: MF-152 — Corrección copy español y deriva documental

npm run quality:microphase-next
# { "id": "MF-152", "state": "READY", ... }
```

Ledger post-MF-151:

- **MF-151:** DONE  
- **MF-152:** READY  
- **MF-153…MF-182:** BLOCKED (dependencias no satisfechas)

## Riesgos residuales

- Ledger debe actualizarse manualmente al cerrar cada MF-XXX (estado DONE + `closureReport`).
- Warnings si reporte de cierre aún no existe en disco al validar (no bloquea).
- `quality:microphases` no está en CI aún (candidato MF-153).

## Cambios fuera de alcance evitados

- Sin cambios en `apps/web`, `apps/api`, `packages/*` clínico, migraciones SQL.
- Sin commit, push ni nuevas dependencias npm.
- Sin iniciar MF-152.

## Próxima microfase READY recomendada

**MF-152 — Corrección copy español y deriva documental**

Evidencia esperada: `copy/es.ts`, `SCREEN_CONNECTION_MAP` actualizado, `reports/epis2-mf-152-copy-doc-sync.md`.
