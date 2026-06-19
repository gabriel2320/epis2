# MF-BRÚJULA-00 — Cierre (brújula post-PONYTAIL)

**Fecha:** 2026-06-18 · **Programa:** PROG-PRODUCT-MAP · **Pre-req:** merge `master` @ `b2d6a00`

## Alcance

Conciliar documentación de brújula tras PROG-PONYTAIL-TRIM (cierre técnico). Sin runtime, router, registry ni gates.

## Contradicciones resueltas

| Tema | Antes | Después |
|------|-------|---------|
| Home operativo | `/espacio/buscar-paciente` en AGENT_CONTEXT | **Entrada activa:** `/app/buscar` CICA · **Fallback:** `/espacio/*` |
| Intención ficha-first | Confundida con ruta legacy | Invariante clínico (censo → ficha → borrador → aprobación), independiente del fallback |
| Programa activo | PROG-PURGE-CICA solo | **PROG-PRODUCT-MAP** activo · PURGE en paralelo |
| Ponytail | Implícito | **PROG-PONYTAIL-TRIM** ✓ cierre técnico (KNIP + PONY + GATE-01) |
| Knip | Parcial en inventario | Baseline KNIP-04 documentada; MF-KNIP-05 = exports triage |

## Archivos tocados

| Archivo | Cambio |
|---------|--------|
| `docs/EPIS2_CURRENT_STATE.md` | v1.4 · entrada CICA · programas · Knip |
| `docs/AGENT_CONTEXT_MINIMAL.md` | v4.8 · regla 1 · programas · placeholders mapa |
| `docs/MODULE_INVENTORY.md` | v1.2 · Ponytail cerrado · próximo paso PRODUCT-MAP |

## SoT (recordatorio)

```txt
Técnico rutas:  EPIS_CICA_SCREEN_REGISTRY.ts
Humano (next):  EPIS2_ROUTE_MAP.md · EPIS2_PRODUCT_CATALOG.md
No crear:       productCatalog.ts paralelo
```

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run quality:fast` | (cierre sesión) |

## Próximo paso

**MF-CATALOG-00** — `EPIS2_ROUTE_MAP.md` + `export-route-map.mjs` + `quality:route-map-gate`.
