import { buildAiApp } from './app.js';
import { loadAiConfig } from './config.js';
import { shutdownLangfuse } from './langfuseTrace.js';

async function main() {
  const config = loadAiConfig();
  const app = await buildAiApp(config);
  await app.listen({ host: config.AI_HOST, port: config.AI_PORT });

  const shutdown = async () => {
    await app.close();
    await shutdownLangfuse();
    process.exit(0);
  };

  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
