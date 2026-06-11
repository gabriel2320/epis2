# EPIS2 — Programa autodesarrollo IA 6 h (PROG-AUTO-DEV-6H)

**Versión:** 1.0 · **Fecha:** 2026-06-10  
**Autorización explícita sesión:** commit + push automatizados con `EPIS2_AUTO_DEV_AUTHORIZED=1`

> **Límite canon:** IA no aprueba ni firma clínica (inv. #11–13). Autodesarrollo = código, docs, tests, microcopy, diccionarios — no escritura SoT clínica final.

---

## Objetivo

Orquestar **6 horas** de mejora continua del repo con Ollama local, gates EPIS2 y runner `npm run dev:auto:6h`, sin intervención humana entre tramos.

---

## Tramos (hitos ~1 h)

| Tramo | ID | Entregable | Gates |
|-------|-----|------------|-------|
| 0 | H-AUTO-0 | Stack + probe Ollama + ledger + brief | `stack:dev`, `ollama:probe` |
| 1 | H-AUTO-1 | Terminología unificada + diccionario comandos | `test` command-registry |
| 2 | H-AUTO-2 | Ficha tradicional/papel + sinónimos barra | `dual-chart-*`, `check` |
| 3 | H-AUTO-3 | Deprecación UI redundante (legacy freeze) | `three-modes-gate`, `legacy-freeze` |
| 4 | H-AUTO-4 | Tests + auto-repair loop | `check`, `test:unit:chart` |
| 5 | H-AUTO-5 | Documentación + archivo ramas | `auto-dev-6h-gate` |
| 6 | H-AUTO-6 | Auditoría final + commit + push | `quality:*` subset |

---

## Comandos

```bash
# Sesión completa (6 tramos secuenciales)
EPIS2_AUTO_DEV_AUTHORIZED=1 npm run dev:auto:6h -- --commit --push

# Un tramo
npm run dev:auto:6h -- --tramo 1 --commit

# Dry-run (solo planifica y gates, sin git)
npm run dev:auto:6h -- --dry-run

# Con Ollama docs L0 entre tramos
npm run dev:auto:6h -- --ollama-auto --apply
```

---

## Artefactos

| Archivo | Uso |
|---------|-----|
| `docs/quality/auto-dev-6h-ledger.json` | Estado tramos |
| `reports/auto-dev-6h-log.jsonl` | Log append-only |
| `reports/epis2-auto-dev-6h-close-*.md` | Cierre sesión |
| `docs/product/EPIS2_CLINICAL_TERMINOLOGY.md` | Terminología única |
| `packages/command-registry/src/clinical-command-dictionary.ts` | Diccionario + sinónimos |

---

## Flujo ficha médica tradicional

1. Censo / búsqueda (`CommandLauncherSlim`)
2. `/espacio/ficha?patientId=&chartMode=traditional|paper`
3. Shell 4 capas (PROG-DUAL-CHART)
4. Barra clínica: diccionario → resolve → borrador humano

---

## Ramas truncas

El tramo 5 genera `reports/epis2-branch-archive-*.md` — no borra remotos; documenta candidatos a archivo.

---

## Referencias

- `EPIS2_AI_ASSISTED_DEV.md` · `EPIS2_DEV_AGENT_LOW_RISK_WRITE.md`
- `EPIS2_DUAL_CHART_VISUAL_CANON.md` · `dual-chart-ledger.json`
