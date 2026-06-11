# PROG-AUTO-DEV-6H — Arranque sesión autónoma

**Fecha:** 2026-06-10 · **Autorización:** `EPIS2_AUTO_DEV_AUTHORIZED=1`

## Entregado en esta sesión

| Tramo | Estado | Entregable |
|-------|--------|------------|
| Programa | ✓ | `docs/product/EPIS2_AUTO_DEV_6H_PROGRAM.md` |
| Ledger | ✓ | `docs/quality/auto-dev-6h-ledger.json` |
| Runner | ✓ | `npm run dev:auto:6h` |
| H-AUTO-1 | ✓ | Diccionario comandos + terminología + autocompletar ficha |
| Gate | ✓ | `quality:auto-dev-6h-gate` |

## Ejecutar 6 h sin humano

```powershell
$env:EPIS2_AUTO_DEV_AUTHORIZED="1"
npm run dev:auto:6h -- --commit --push
```

Tramo aislado:

```powershell
npm run dev:auto:6h -- --tramo 2 --dry-run
```

## Límites (canon)

- IA no firma ni aprueba clínica
- Tier X (pages, registry) requiere agente Cursor — runner ejecuta gates y docs L0
- Ollama opcional: `--ollama-auto --apply` entre tramos

## Próximo tramo automático

**H-AUTO-2** — gates dual-chart + tests chart al ejecutar runner completo.
