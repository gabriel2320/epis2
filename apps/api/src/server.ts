import { loadConfig } from './config.js';
import { startOtel } from './otel.js';

async function main() {
  const config = loadConfig();
  // OTel antes del import de app.js: el patch de node:http debe preceder a Fastify (ESM).
  const otel = startOtel(config);
  const { buildApp } = await import('./app.js');
  const app = await buildApp(config);
  if (otel) {
    app.addHook('onClose', async () => {
      await otel.shutdown();
    });
  }
  await app.listen({ host: config.API_HOST, port: config.API_PORT });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
