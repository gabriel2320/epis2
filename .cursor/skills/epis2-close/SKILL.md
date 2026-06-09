---
name: epis2-close
description: >-
  Cierre de sesión EPIS2: npm run check, test, db:validate, reporte en reports/,
  detenerse si architecture:validate falla. Usar antes de commit o al terminar tarea.
disable-model-invocation: true
---

# EPIS2 — Cierre de sesión

## Gates obligatorios

Ejecutar en orden y reportar resultado:

```bash
npm run check
npm run test
npm run db:validate
```

Si la fase lo exige: `npm run quality:golden-journey`.

## Reporte

Crear o actualizar `reports/<tema>-YYYY-MM-DD.md` con:

- Alcance (SDEPIS2 + MF-* / Hilo / Tramo)
- Gates ejecutados (pass/fail)
- Riesgos abiertos
- Próximo paso exacto (una acción)

Opcional: `npm run dev:agent:close` si usaste orquestación dev-agent.

## Detenerse si

- `architecture:validate` falla
- La tarea contradice `docs/product/PRODUCT_INVARIANTS.md`
- Aparece segundo Command Registry, OpenMRS, Carbon o dashboard como home

## Commit / push

El humano aprueba commit y push; no commitear `.env` ni tokens MCP.
