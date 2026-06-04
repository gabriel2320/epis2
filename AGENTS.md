# EPIS2 — Guía para agentes (Cursor)

## Modo de operación

1. **Una microfase por sesión** — p. ej. `Ejecuta solo EPIS2-03. No avances a EPIS2-04.`
2. **EPIS2 First** — PostgreSQL es fuente de verdad; la home es el Centro de Comando.
3. **EPIS es donante, no base** — nunca copiar carpetas completas desde `../Epis`.
4. **Sin pacientes reales** — solo datos sintéticos marcados DEMO hasta piloto autorizado.
5. **IA local asiste; no decide** — Ollama nunca aprueba, firma ni escribe en tablas clínicas finales.

## Fase actual

```text
EPIS2-00 ✓  (documentación y reglas)
EPIS2-01 ✓  (monorepo bootstrap)
EPIS2-02     (pendiente — shell MUI + Command Center)
```

## Antes de escribir código

Leer:

- `docs/PRODUCT_CANON.md`
- `docs/SCOPE_V1.md`
- `docs/QUALITY_GATES.md`
- La sección de la fase en `docs/ROADMAP.md`

## Entregables por fase

Cada fase debe terminar con:

- cambios acotados a archivos permitidos;
- tests/gates de la fase;
- reporte en `reports/epis2-NN-*.md`;
- commit sugerido (no ejecutar salvo petición explícita).

## Prohibido en EPIS2

OpenMRS, O3, Carbon, overlays EPIS, dashboards como home, writeback automático, firma automática, migración masiva de legacy.
