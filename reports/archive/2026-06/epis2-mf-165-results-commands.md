# EPIS2 — MF-165 Comandos de resultados

**Fecha:** 2026-06-06

## Alcance

Intent `open_results_inbox` en command-registry → `/espacio/resultados`.

## Entregables

- `packages/command-registry`: tipo, ruta, definición y aliases («bandeja de resultados», «ver resultados», …)
- Test `router.test.ts` — resolución y `routePath`
- Frases excluyen solicitud de estudios (`solicitar`/`pedir`) para no colisionar con `request_laboratory`

## Ola 2 cerrada

MF-161…165 DONE. Próxima READY: **MF-166** (conciliación medicamentos).
