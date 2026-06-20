import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import fastifySwagger from '@fastify/swagger';
import apiReference from '@scalar/fastify-api-reference';
import { env } from '@shared/constants/env';
import { errorHandler } from '@shared/middleware/error-handler';
import { setupHealthCheck } from '@infrastructure/telemetry/health-check';
import { setupMetricsRoute } from '@infrastructure/telemetry/prometheus';
import authPlugin from '@presentation/plugins/auth.plugin';
import { routes } from '@presentation/routes';
import { AppDataSource } from '@infrastructure/database/typeorm.config';

export async function buildApp(): Promise<FastifyInstance> {
  await AppDataSource.initialize();
  if (env.NODE_ENV === 'development') {
    await AppDataSource.runMigrations();
  }
  const app = Fastify({
    logger: {
      transport: env.NODE_ENV === 'development' ? { target: 'pino-pretty' } : undefined,
      serializers: {
        req: (req) => ({
          method: req.method,
          url: req.url,
        }),
        res: (res) => ({
          statusCode: res.statusCode,
        }),
        err: (err) => ({
          type: err.name,
          message: err.message,
          stack: err.stack || '',
        }),
      },
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app.setErrorHandler(errorHandler as any);

  await app.register(cors);
  await app.register(jwt, { secret: env.JWT_SECRET });
  await app.register(authPlugin);

  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Admin API',
        description: 'Admin API - Clean Architecture with Fastify',
        version: '1.0.0',
      },
      servers: [{ url: `http://localhost:${env.PORT}` }],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
  });

  await app.register(apiReference, {
    routePrefix: '/docs',
  });

  await setupHealthCheck(app);
  await setupMetricsRoute(app);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await app.register(routes as any, { prefix: '/api/v1' });

  return app;
}
