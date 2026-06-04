import { buildAiApp } from './app.js';
import { loadAiConfig } from './config.js';

async function main() {
  const config = loadAiConfig();
  const app = await buildAiApp(config);
  await app.listen({ host: config.AI_HOST, port: config.AI_PORT });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
