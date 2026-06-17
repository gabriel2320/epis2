# EPIS2 — Prompt agente Tramo K

Alcance: MF-TRAMO-K-002 · solo archivos del tramo K
Canon: docs/PRODUCT_CANON.md · docs/product/PRODUCT_INVARIANTS.md
Home: Centro de Comando (/comando) — nunca dashboard como home
Patrón: docs/product/EPIS2_TRAMO_SCAFFOLD_CANON.md (1 IDC = 1 panel = 1 testid = 1 MF)

## Plan tramo

# EPIS2 — Plan Tramo K (calidad y auditoría)

**Versión:** 1.0 · **Fecha:** 2026-06-07

---

## Secuencia canon

Ola 17 — calidad/auditoría IDC 171–180 bajo tab calidad (`?tab=quality`).

**Horizonte:** Post signoff A–J — inventario Semana 4 → scaffold MF-TRAMO-K-002…011.

---

## Estado

| Programa | IDC | EPIS2 hoy |
|----------|-----|-----------|
| Centinela | 171 | ◐ **MF-TRAMO-K-002** (pendiente) |
| ACR | 172 | ○ Planned |
| Comité mortalidad | 173 | ○ Planned |
| Auditoría registros | 174 | ○ Planned |
| OIRS | 175 | ○ Planned |
| Clima laboral | 176 | ○ Planned |
| Consentimientos | 177 | ○ Planned |
| Acreditación | 178 | ◐ **MF-TRAMO-K-009** (pendiente) |
| Docs institucionales | 179 | ○ Planned |
| Suspensión Qx | 180 | ○ Planned |

---

## Microfases

| MF | Alcance | Estado |
|----|---------|--------|
| MF-TRAMO-K-001 | Inventario calidad/auditoría | ✅ Semana 4 |
| MF-TRAMO-K-002 … K-011 | Scaffold paneles 171–180 | ○ |
| MF-TRAMO-K-CLOSURE | Cierre técnico Tramo K | ○ |

---

## Prompt agente

```bash
npm run dev:agent:tramo-k

## Inventario

Leer: docs/product/EPIS2_TRAMO_K_QUALITY_INVENTORY.md

## Cierre obligatorio

1. node scripts/product/generate-idc-matrix.mjs
2. npm run quality:tramo-k-*-gate (cuando existan)
3. npm run quality:tramos-hygiene-gate
4. npm run check && npm run test && npm run db:validate
5. npm run quality:golden-journey
6. reports/epis2-tramo-k-*.md
7. No commit salvo orden explícita

## Evals IA (con dev:ai)

npm run ai:evals:tramo-k
npm run ai:evals:closure
