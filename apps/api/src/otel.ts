/**
 * MF-NORM-203 — OpenTelemetry mínimo (R-47).
 *
 * Instrumenta HTTP entrante (node:http, usado por Fastify) y saliente vía
 * undici/fetch (llamadas a local-ai / Ollama / LanguageTool). El driver de DB
 * es postgres.js, sin instrumentación OTel oficial — los spans de query quedan
 * como extensión futura (span manual en service si se necesita).
 *
 * Off por defecto (`OTEL_ENABLED=false`): sin flag no se carga ningún SDK.
 * Nota ESM: `startOtel` debe ejecutarse ANTES de importar `app.js` (ver
 * server.ts — import dinámico) para que el patch de node:http alcance a Fastify.
 */
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { UndiciInstrumentation } from '@opentelemetry/instrumentation-undici';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import type { SpanProcessor } from '@opentelemetry/sdk-trace-base';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import type { AppConfig } from './config.js';

export type OtelConfig = Pick<
  AppConfig,
  'OTEL_ENABLED' | 'OTEL_EXPORTER_OTLP_ENDPOINT' | 'OTEL_SERVICE_NAME'
>;

export type OtelHandle = {
  shutdown: () => Promise<void>;
};

type StartOtelOptions = {
  /** Override para tests: procesadores en memoria en lugar del exporter OTLP. */
  spanProcessors?: SpanProcessor[];
};

export function startOtel(config: OtelConfig, options: StartOtelOptions = {}): OtelHandle | null {
  if (!config.OTEL_ENABLED) {
    return null;
  }

  const sdk = new NodeSDK({
    resource: resourceFromAttributes({ [ATTR_SERVICE_NAME]: config.OTEL_SERVICE_NAME }),
    ...(options.spanProcessors
      ? { spanProcessors: options.spanProcessors }
      : {
          traceExporter: new OTLPTraceExporter({
            url: `${config.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/traces`,
          }),
        }),
    instrumentations: [new HttpInstrumentation(), new UndiciInstrumentation()],
  });

  sdk.start();

  return {
    shutdown: () => sdk.shutdown(),
  };
}
