/**
 * MF-NORM-203 — smoke OTel: arranque con y sin flag; spans visibles con flag.
 * Usa exporter en memoria (sin collector). `startOtel` debe ejecutarse antes de
 * cargar `app.js` para que HttpInstrumentation alcance a Fastify (ver otel.ts).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { OtelHandle } from './otel.js';
import { testApiConfig } from './testConfig.js';

let otel: OtelHandle | null = null;

afterEach(async () => {
  await otel?.shutdown();
  otel = null;
});

describe('startOtel (MF-NORM-203)', () => {
  it('sin OTEL_ENABLED no inicia SDK', async () => {
    const { startOtel } = await import('./otel.js');
    expect(startOtel(testApiConfig)).toBeNull();
  });

  it('con OTEL_ENABLED emite spans HTTP contra el API', async () => {
    vi.resetModules();
    const { InMemorySpanExporter, SimpleSpanProcessor } =
      await import('@opentelemetry/sdk-trace-base');
    const exporter = new InMemorySpanExporter();
    const processor = new SimpleSpanProcessor(exporter);
    const { startOtel } = await import('./otel.js');
    otel = startOtel(
      { ...testApiConfig, OTEL_ENABLED: true, OTEL_SERVICE_NAME: 'epis2-api-test' },
      { spanProcessors: [processor] },
    );
    expect(otel).not.toBeNull();

    const { buildApp } = await import('./app.js');
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

    await processor.forceFlush();
    const spans = exporter.getFinishedSpans();
    expect(spans.length).toBeGreaterThan(0);
    expect(spans.some((s) => s.name.includes('GET'))).toBe(true);
  });

  it('arranque sano: el app responde igual con SDK activo', async () => {
    const { InMemorySpanExporter, SimpleSpanProcessor } =
      await import('@opentelemetry/sdk-trace-base');
    const exporter = new InMemorySpanExporter();
    const { startOtel } = await import('./otel.js');
    const { buildApp } = await import('./app.js');
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
