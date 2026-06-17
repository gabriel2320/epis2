# Reporte — Matriz IDC 1–200 (cuatro campos)

**Fecha:** 2026-06-06  
**Alcance:** Documentación de planificación — sin cambios de código productivo  
**Canon:** `docs/product/EPIS2_WAVE_EXECUTION_CANON.md` §5

---

## Entregables

| Artefacto | Ruta |
|-----------|------|
| Matriz humana (200 filas) | `docs/product/EPIS2_IDC_EXECUTION_MATRIX.md` |
| Fuente JSON (agentes/CI) | `docs/product/epis2-idc-execution-matrix.json` |
| Generador reproducible | `scripts/product/generate-idc-matrix.mjs` |

Regenerar tras cerrar olas o cambiar overrides:

```bash
node scripts/product/generate-idc-matrix.mjs
```

---

## Campos por ítem

| Campo | Valores |
|-------|---------|
| Estado | Planned · Active · Blocked · Done |
| Prioridad | Critical · High · Medium · Low |
| Horizonte | Core · Post-core · Future |
| Decisión | Build · Integrate · Defer · Exclude |

Columnas auxiliares: **Ola**, **Workspace**, **Legacy** (COMPLETE/PARTIAL/MISSING/DEFERRED), **Nota**.

---

## Distribución (2026-06-06)

| Dimensión | Conteos |
|-----------|---------|
| Estado | Planned 148 · Active 44 · Blocked 1 · **Done 7** |
| Prioridad | Critical 7 · High 47 · Medium 95 · Low 51 |
| Horizonte | Core 41 · Post-core 88 · Future 71 |
| Decisión | Build 127 · Integrate 5 · Defer 66 · Exclude 2 |

**Done:** IDC 1 (login), 37 (SOAP), 52 (receta), 55 (lab), 64 (derivación), 91 (assist), 165 (conciliación).

**Blocked / Exclude:** IDC 95 (sugerencia diagnóstica — invariante no auto-diagnóstico), 98 (chatbot soporte EMR).

**Defer masivo:** 11–20 facturación, 41–50 UCI duplicada, 121–129 APS ministerial, 131–140 UCI avanzada, 151–160 pabellón, 181–190 especialidades, 197–198 IoT.

---

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run check` | No aplicado (solo docs) |
| `npm run test` | No aplicado |
| Validación generador | 200 IDs únicos · enums válidos ✓ |

---

## Riesgos

1. **Active vs Done:** Varios ítems Ola 2 (31–40, 62 certificado) siguen **Active** aunque hay blueprints parciales — actualizar overrides al cerrar MF.
2. **Duplicidad UCI:** IDC 41–50 y 131–140 — ambos Defer/Future salvo excepciones explícitas.
3. **Workspace `emergency`:** IDC 101–110 mapeados pero rail aún no implementado (canon §4).

---

## Próximo paso

1. Al cerrar **Ola 3**, promover IDC 27–30 y enriquecer 21–26 de Active → Done donde aplique gate.
2. Sincronizar overrides en `generate-idc-matrix.mjs` con cada `reports/epis2-mf-*.md`.
3. Opcional: test Vitest que importe JSON y valide 200 filas en CI.
