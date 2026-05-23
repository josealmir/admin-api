import 'reflect-metadata';
import { env } from '@shared/constants/env';
import { startTracer, shutdownTracer } from '@infrastructure/telemetry/tracer';
import { buildApp } from './app';

async function main() {
  startTracer();

  const app = await buildApp();

  await app.listen({ port: env.PORT, host: env.HOST });
  console.log(`Server running on http://${env.HOST}:${env.PORT}`);
  console.log(`Docs available at http://localhost:${env.PORT}/docs`);
}

process.on('SIGTERM', async () => {
  await shutdownTracer();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await shutdownTracer();
  process.exit(0);
});

main().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
