# MF-RAPID — Cierre loop dev rápido (Cursor orquestador local)

**Programa:** PROG-RAPID-2026  
**Fecha:** 2026-06-14  
**Gate:** `npm run quality:rapid-gate`

## Alcance

Orquestación de iteración diaria: contexto mínimo, tres niveles de quality loop, auditor Ollama secundario sobre diff, atajo `dev:rapid` e integración con `dev:velocity` / hook Cursor.

## Microfases

| ID | Entrega | Evidencia |
|----|---------|-----------|
| **MF-RAPID-01** | `quality:fast` · `quality:clinical` · `quality:full` + `AGENT_CONTEXT_MINIMAL.md` + regla `50-fast-loop.mdc` | commit `7cb4fab` |
| **MF-RAPID-02** | `dev:agent:audit-diff` (Ollama sobre git diff) | commit `7cb4fab` |
| **MF-RAPID-03** | `dev:rapid` + vitest hermano por archivo tocado | commit `d84e1ef` |
| **MF-RAPID-04** | Gate smoke + tablero + velocity/session | este reporte |

## Comandos

```bash
# Iteración (default post-cambio)
npm run dev:rapid
npm run dev:rapid -- --skip-audit

# Loops por nivel
npm run quality:fast
npm run quality:clinical
npm run quality:full

# Cierre programa
npm run quality:rapid-gate
```

## Evidencia gate

| Check | Resultado |
|-------|-----------|
| Artefactos MF-RAPID-01…03 presentes | ✓ |
| `schemas.test.mjs` (`parseDevDiffAudit`) | ✓ |
| `dev:agent:audit-diff --dry-run` | ✓ |
| `dev:rapid --skip-audit` (= `quality:fast`) | ✓ |

## Fuera de alcance (bloque D — plan correcciones)

- `ci-fast.yml`, `quality:ui`, `agent:doctor`
- `build:core` / `build:intel`, `safety-preflight`, monorepo boundaries CI
- Split `packages/ai-client`

## Próximo paso

**PROG-STRENGTHEN** — **MF-IM-01** embeddings pgvector 384d · `npm run db:validate`.
