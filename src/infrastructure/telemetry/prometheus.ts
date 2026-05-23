import { FastifyInstance } from 'fastify';
import client from 'prom-client';

const register = new client.Registry();

client.collectDefaultMetrics({ register });

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 5],
});

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestsTotal);

export function trackRequest(
  method: string,
  route: string,
  statusCode: number,
  duration: number,
): void {
  httpRequestDuration.observe({ method, route, status_code: String(statusCode) }, duration);
  httpRequestsTotal.inc({ method, route, status_code: String(statusCode) });
}

export async function setupMetricsRoute(app: FastifyInstance): Promise<void> {
  app.get('/metrics', async (_request, reply) => {
    reply.header('Content-Type', register.contentType);
    return register.metrics();
  });
}

export { register };
