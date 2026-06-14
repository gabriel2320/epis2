# EPIS2 — OpenTelemetry mínimo (MF-NORM-203, R-47)

Trazas opt-in del API clínico. **Off por defecto** — sin `OTEL_ENABLED=true` no se carga
ningún SDK ni exporter (cero overhead en dev/test/CI).

## Qué instrumenta

| Capa | Instrumentación | Cubre |
|------|-----------------|-------|
| HTTP entrante | `@opentelemetry/instrumentation-http` (node:http) | Requests Fastify (`/api/*`, health) |
| HTTP saliente | `@opentelemetry/instrumentation-undici` (fetch) | local-ai, Ollama, LanguageTool |
| DB | — | `postgres.js` no tiene instrumentación OTel oficial; spans de query quedan como extensión futura (span manual en service) |

## Configuración

```bash
OTEL_ENABLED=true                                  # default: false
OTEL_EXPORTER_OTLP_ENDPOINT=http://127.0.0.1:4318  # OTLP/HTTP (collector local)
OTEL_SERVICE_NAME=epis2-api
```

Validada con Zod en `apps/api/src/config.ts` (mismo patrón que `LOG_LEVEL`).

## Arquitectura

- `apps/api/src/otel.ts` — `startOtel(config)`: `NodeSDK` + OTLP trace exporter; devuelve
  handle con `shutdown()` (cableado a `onClose` de Fastify).
- `apps/api/src/server.ts` — **orden importa (ESM):** `startOtel` corre antes del
  `import('./app.js')` dinámico para que el patch de `node:http` preceda a Fastify.
- Correlación con logs: el `correlationId` (R-45/R-46, pino) sigue siendo la llave de
  correlación request↔log; los spans agregan la dimensión de latencia distribuida.

## Collector local (verificación manual)

### Opción A — docker compose (MF-TOOL-05, recomendada)

```bash
npm run stack:observability
# o: docker compose --profile observability up -d otel-collector
OTEL_ENABLED=true npm run dev -w @epis2/api
# curl http://127.0.0.1:3001/health/live → span GET en logs del collector
docker logs -f epis2-otel-collector
```

Config: `infra/otel/collector-config.yaml` (OTLP/HTTP `:4318` → exporter `debug`).

### Opción B — contenedor ad hoc

```bash
docker run --rm -p 4318:4318 otel/opentelemetry-collector
OTEL_ENABLED=true npm run dev -w @epis2/api
# curl http://127.0.0.1:3001/health/live → span GET visible en la salida del collector
```

## Smoke automatizado

`apps/api/src/otel.test.ts` — arranque con y sin flag; con flag, exporter en memoria
captura spans HTTP reales (el span garantizado es el de undici/fetch, que usa
`diagnostics_channel` y no depende del orden de imports en vitest).
