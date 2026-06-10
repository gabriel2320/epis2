/**
 * MF-NORM-203 — smoke OTel: arranque con y sin flag; spans visibles con flag.
 * Usa exporter en memoria (sin collector); el span asegurado es el de cliente
 * undici/fetch (diagnostics_channel — independiente del orden de imports ESM).
 */
import { InMemorySpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { afterEach, describe, expect, it } from 'vitest';
import { buildApp } from './app.js';
import { startOtel, type OtelHandle } from './otel.js';
import { testApiConfig } from './testConfig.js';

let otel: OtelHandle | null = null;

afterEach(async () => {
  await otel?.shutdown();
  otel = null;
});

describe('startOtel (MF-NORM-203)', () => {
  it('sin OTEL_ENABLED no inicia SDK', () => {
    expect(startOtel(testApiConfig)).toBeNull();
  });

  it('con OTEL_ENABLED emite spans HTTP contra el API', async () => {
    const exporter = new InMemorySpanExporter();
    otel = startOtel(
      { ...testApiConfig, OTEL_ENABLED: true, OTEL_SERVICE_NAME: 'epis2-api-test' },
      { spanProcessors: [new SimpleSpanProcessor(exporter)] },
    );
    expect(otel).not.toBeNull();

    const app = await buildApp(testApiConfig);
    await app.listen({ host: '127.0.0.1', port: 0 });
    try {
      const address = app.server.address();
      const port = typeof address === 'object' && address !== null ? address.port : 0;
      const res = await fetch(`http://127.0.0.1:${port}/health/live`);
      expect(res.status).toBe(200);
    } finally {
      await app.close();
    }

    const spans = exporter.getFinishedSpans();
    expect(spans.length).toBeGreaterThan(0);
    expect(spans.some((s) => s.name.includes('GET'))).toBe(true);
  });

  it('arranque sano: el app responde igual con SDK activo', async () => {
    const exporter = new InMemorySpanExporter();
    otel = startOtel(
      { ...testApiConfig, OTEL_ENABLED: true },
      { spanProcessors: [new SimpleSpanProcessor(exporter)] },
    );
    const app = await buildApp(testApiConfig);
    const res = await app.inject({ method: 'GET', url: '/health/live' });
    expect(res.statusCode).toBe(200);
    await app.close();
  });
});
